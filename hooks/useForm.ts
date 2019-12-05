import { fold } from 'fp-ts/lib/Either';
import { Refinement } from 'fp-ts/lib/function';
import * as IO from 'fp-ts/lib/IO';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Email, Password, String50 } from '../types';

// How the ideal form validation library should be designed?
// Think about it. A "form" can contain anything.
// HTML inputs, custom components, Hooks, whatever. The same for validation.
// And we have to be able to validate all the business rules any application has.
// The same for error messages. The possibilities are endless.
// The answer for the infinite scaling is function composition.
// But which functions? As Scott Wlaschin said:
// "I believe that solutions emerge from the judicious study of discernible reality."
// So what we need is the right reusable primitives. io-ts is one of them.
// The rest are React components and hooks. The design emerges from the life.
// Just compose functions.
// I believe this code is simple enough to be copy-pasted, but sure it can be a library.

// Group text input based types.
const TextInputField = t.union([String50, Email, Password]);
// Define text input props for them.
interface TextInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement>;
  value: string;
}

// Just Checkbox.
const CheckboxField = t.boolean;
interface CheckboxProps {
  isChecked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement>;
}

// Type factory for props based on conditional types.
type Props<T> = T extends t.TypeOf<typeof TextInputField>
  ? TextInputProps
  : T extends t.TypeOf<typeof CheckboxField>
  ? CheckboxProps
  : unknown; // TODO: Add value, setValue, infer type from t.OutputOf.

type Fields<T> = {
  [K in keyof T]: {
    isInvalid: boolean;
    props: Props<T[K]>;
    error: string;
  };
};

// Ideally, this should be union of all codecs names.
// https://github.com/gcanti/io-ts/issues/392
type ErrorType = string;

type InvalidFields<T> = Partial<
  {
    [K in keyof T]: ErrorType;
  }
>;

type Refs<P extends t.Props> = {
  [K in keyof P]: RefObject<any>;
};

export const useForm = <P extends t.Props>(
  codec: t.TypeC<P>,
  initialState: t.OutputOf<t.TypeC<P>>,
): {
  fields: Fields<t.TypeOfProps<P>>;
  state: t.OutputOf<t.TypeC<P>>;
  // https://gcanti.github.io/fp-ts/modules/IO.ts.html
  reset: IO.IO<void>;
  validate: IO.IO<ReturnType<t.TypeC<P>['decode']>>;
} => {
  const initialStateRef = useRef(initialState);
  const [state, setState] = useState(initialState);
  // Creating refs is very cheap so we don't have to create them lazily.
  const refsRef = useRef<Refs<P>>(
    Object.keys(codec.props).reduce(
      // This does not break rules of hooks as long as a codec is always the same.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      (acc, key) => ({ ...acc, [key]: useRef() }),
      {} as Refs<P>,
    ),
  );

  // Messages should be read from React context react-intl or similar.
  // Type shoul be infered from codecs.
  const errorMessages = useMemo<any>(
    () => ({
      NonEmptyString: 'Field can not be empty.',
      TrimmedString: 'Please remove trailing whitespaces.',
      Email: 'Email is not valid.',
      Password: 'Password is too short.',
      String50: 'Max 50 characters.',
      String800: 'Max 800 characters.',
    }),
    [],
  );

  const [invalidFields, setInvalidFields] = useState<
    InvalidFields<t.TypeOfProps<P>>
  >({});

  const focusFirstInvalidField = useCallback((invalidKeys: string[]) => {
    const isDOMElement: Refinement<any, Element> = (a): a is Element =>
      'nodeType' in a && a.nodeType === Node.ELEMENT_NODE;

    const firstFieldInDOM = invalidKeys
      .map(key => refsRef.current[key])
      .sort(({ current: a }, { current: b }) => {
        if (!isDOMElement(a) || !isDOMElement(b)) return 0;
        // Sort by document position, because that's how key tab navigation works.
        const position = a.compareDocumentPosition(b);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
      })[0].current;
    if (firstFieldInDOM && typeof firstFieldInDOM.focus === 'function')
      firstFieldInDOM.focus();
  }, []);

  const onFail = useCallback(
    (errors: t.Errors) => {
      const invalidFields = errors.reduce((acc, error) => {
        // t.ValidationError is weird but manageable.
        // First is some object, second is key, last is the first error.
        const key = error.context[1].key;
        const name = error.context[error.context.length - 1].type.name;
        return { ...acc, [key]: name };
      }, {});
      setInvalidFields(invalidFields);
      focusFirstInvalidField(Object.keys(invalidFields));
    },
    [focusFirstInvalidField],
  );

  const onSuccess = useCallback(() => {
    setInvalidFields({});
  }, []);

  const validate = useCallback(() => {
    const result = codec.decode(state);
    pipe(result, fold(onFail, onSuccess));
    return result;
  }, [codec, onFail, onSuccess, state]);

  const reset = useCallback(() => {
    setState(initialStateRef.current);
  }, []);

  // Note we are creating callbacks (onChange etc.) on any state change which also
  // updates fields with unchanged value. Believe or not, it's OK. Forms are small and
  // big forms should be splitted to smaller forms anyway. Sure, we can micro-optimize
  // via refs or wrapper component like many other form libraries, but I believe it's
  // unnecessary for almost all cases. React is fast enough.
  // There is also another reason for not micro-optimizing. React concurrent mode.
  // "the safest solution right now is to always invalidate the callback"
  // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
  const fields = useMemo(() => {
    const createTextInputProps = (key: string): TextInputProps => ({
      value: state[key],
      onChange({ target }) {
        setState({ ...state, [key]: target.value });
      },
      onKeyPress(event) {
        // Simulate submit on enter. It could be configurable.
        if (event.key === 'Enter') validate();
      },
      ref: refsRef.current[key],
    });

    const createCheckboxProps = (key: string): CheckboxProps => ({
      isChecked: state[key],
      onChange({ target }) {
        setState({ ...state, [key]: target.checked });
      },
      ref: refsRef.current[key],
    });

    const createProps = (key: string, type: t.Mixed) => {
      if ((TextInputField.types as t.Mixed[]).includes(type))
        return createTextInputProps(key);
      if (type === CheckboxField) return createCheckboxProps(key);
      return {};
    };

    return Object.keys(codec.props).reduce((acc, key) => {
      const type = codec.props[key];
      const props = createProps(key, type);
      const isInvalid = key in invalidFields;
      const error = errorMessages[invalidFields[key]] || 'fok';
      return { ...acc, [key]: { props, isInvalid, error } };
    }, {} as Fields<t.TypeOfProps<P>>);
  }, [codec.props, errorMessages, invalidFields, state, validate]);

  return useMemo(() => ({ fields, reset, state, validate }), [
    fields,
    reset,
    state,
    validate,
  ]);
};

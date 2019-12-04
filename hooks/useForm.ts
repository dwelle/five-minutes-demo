import {
  ChangeEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as IO from 'fp-ts/lib/IO';
import * as t from 'io-ts';
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
// Just compose functions. I believe this code is simple enough to be copy-pasted,
// but sure it can be a lib.

// Group text input based types.
const TextInputField = t.union([String50, Email, Password]);
// Define text input props for them.
interface TextInputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
    // TODO: errors
  };
};

type Refs<P extends t.Props> = {
  [K in keyof P]: RefObject<any>;
};

export const useForm = <P extends t.Props>(
  codec: t.TypeC<P>,
  initialState: t.OutputOf<t.TypeC<P>>,
): {
  fields: Fields<t.TypeOfProps<P>>;
  reset: IO.IO<void>;
  state: t.OutputOf<t.TypeC<P>>;
  validate: IO.IO<void>;
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

  // Note we are creating callbacks (onChange etc.) on any state change which also
  // updates fields with unchanged value. Believe or not, it's OK. Forms are small and
  // big forms should be splitted to smaller forms anyway. Sure, we can micro-optimize
  // via refs or wrapper component like many other form libraries, but I believe it's
  // unnecessary for almost all cases. React is fast enough.
  // There is also another reason for not micro-optimizing. React concurrent mode:
  // "the safest solution right now is to always invalidate the callback"
  // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
  const fields = useMemo(() => {
    const createTextInputProps = (key: string): TextInputProps => ({
      value: state[key],
      onChange({ target }) {
        setState({ ...state, [key]: target.value });
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
      // TODO: Implement unknown.
      return {};
    };

    return Object.keys(codec.props).reduce((acc, key) => {
      const type = codec.props[key];
      const props = createProps(key, type);
      const isInvalid = false;
      return { ...acc, [key]: { props, isInvalid } };
    }, {} as Fields<t.TypeOfProps<P>>);
  }, [codec.props, state]);

  const validate = useCallback(() => {
    //
  }, []);

  const reset = useCallback(() => {
    setState(initialStateRef.current);
  }, []);

  return useMemo(() => ({ fields, reset, state, validate }), [
    fields,
    reset,
    state,
    validate,
  ]);
};

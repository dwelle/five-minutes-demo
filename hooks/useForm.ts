import { useState, ChangeEvent, RefObject } from 'react';
import * as t from 'io-ts';
import { String50, Password, Email } from '../types';

// How form validation library should be designed?
// Think about it. A "form" can contain anything. HTML inputs, custom components,
// Hooks, whatever. The same for validation.
// And we have to be able to validate all the business rules any application has.
// The same for error messages. The possibilities are endless.
// So, how form validation library should be designed?
// In functional programming, we compose functions.
// But which functions? As Scott Wlaschin said:
// "I believe that solutions emerge from the judicious study of discernible reality."
// So what we need is the right reusable primitives.
// io-ts is one of them, the rest are React components and hooks.
// That's all.

interface TextInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement>;
}

interface CheckboxProps {
  isChecked: boolean;
}

type Field<T> = T extends String50 | Email | Password
  ? TextInputProps
  : T extends t.BooleanType
  ? CheckboxProps
  : unknown;

type Fields<T> = { [K in keyof T]: Field<T[K]> };

export const useForm = <P extends t.Props>(
  codec: t.TypeC<P>,
  initialState: t.OutputOf<typeof codec>,
): {
  fields: Fields<t.TypeOfProps<typeof codec.props>>;
} => {
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line no-console
  console.log(state, setState);
  return {
    fields: {} as any,
  };
};

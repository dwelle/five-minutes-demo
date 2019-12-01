// wtf?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as t from 'io-ts';

/**
 * Do we need a special form validation library? Think about it. A "form" can contain
 * anything. HTML inputs, custom components, Hooks, whatever. The same for validation.
 * We have to be able to validate all the business rules an application has.
 * The same for error messages. The possibilities are endless. But how to do it?
 * From a functional programming view, we should just compose functions.
 * But which functions? As Scott Wlaschin said:
 * "I believe that solutions emerge from the judicious study of discernible reality."
 * So all we need is the right reusable primitives, io-ts is one of them.
 * With io-ts, we define TypeScript types which can be evaluated at the runtime.
 */

export const useForm = <T extends t.TypeC<any>>(
  t: T,
  initial: t.OutputOf<typeof t>,
) => {
  // eslint-disable-next-line no-console
  console.log(initial);
};

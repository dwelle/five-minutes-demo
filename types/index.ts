import * as t from 'io-ts';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

// io-ts is a trojan; come for the codec, stay for the Either
// https://twitter.com/GiulioCanti/status/1197459999276056576

// The best way how to explain functional programming is with an example.
// We will start with io-ts, a runtime type system for IO decoding/encoding
// for TypeScript. It's built on top of fp-ts. We will use it for the sign-up form.
//
// For example, this is how we can define a runtime User type:
// const User = t.type({
//   userId: t.number,
//   name: t.string
// })

// And this is how we can extract its TypeScript type:
// type User = t.TypeOf<typeof User>
// Which is the same as:
// type User = {
//   userId: number
//   name: string
// }

// We can use User to decode any unknown value in runtime, safely:
// const either = User.decode(anything)

// What is Either?
// The Either type returned by decode is defined in fp-ts, a library containing
// implementation of common algebraic types in TypeScript.

// The Either type represents a value of one of two possible types (a disjoint union).
// An instance of Either is either an instance of Left or Right:
// type Either<E, A> =
//   | {
//       readonly _tag: 'Left';
//       readonly left: E;
//     }
//   | {
//       readonly _tag: 'Right';
//       readonly right: A;
//     };
// Convention dictates that Left is used for failure and Right is used for success.

// In functional programming, we don't use Either directly. We pipe all the things!
// TODO: Better snippet.
// pipe(
//   User.decode(...),
//   fold(onFail, onSuccess)
// )

// With io-ts and Either, we can type and validate everything.
// But before validation, we need to define some model to be validated.
// We will use two super useful abstractions: Option and branded types.

// 1) Option type
// Instead of null / undefined, we use fp-ts Option type.
// Option is a Monad - a wrapped value with some helpers, expressing a non-existing thing.
// Helpers? Imagine Promise.all, but for null/undefined values instead of promises.
// Option (and Promise) is one of many monads.

// 2) Branded type, which is even more wonderful.
// We can have type-safe non empty string or email string. No kidding.
// Ffor example, you can define by a type system alone, that function foo can
// accept only non empty string. Traditionally, this is possible
// only by throwing exceptions (no way) or with complex value objects (unnecessary).

// The best thing about functional programming is we can compose all the things
// ad infinitum without source code rot, because pure functions do not rot.
// That's why functional programming is so awesome. Code does not rot that easily.
// Let's start with things we need for a sign-up form.

// All forms use strings, and strings have to be trimmed.
// We all know that storing ' some@email.com  ' in a database would be really bad.
// But where should we trim? On the client? Before saving to the database? Everywhere?
// We don't know and we can't know, because classical type system can't tell us.
// Haskell approach is to explicitly indicate via types where we can expect already
// trimmed string, and where we have to trim. Basically, we only validate
// values from an IO boundary (HTTP, HTML forms, file system, database, ...).
// Inside the application, we use a branded type (similar to Haskel newtype), so
// the code is both perfectly readable and safe.

interface TrimmedStringBrand {
  readonly TrimmedString: unique symbol;
}
const TrimmedString = t.brand(
  t.string,
  (s): s is t.Branded<string, TrimmedStringBrand> =>
    // Trim can be costly, so define max length for all trimmed strings once for all.
    s.length < 10000 && s.trim().length === s.length,
  'TrimmedString',
);
type TrimmedString = t.TypeOf<typeof TrimmedString>;

// Take a look at how the compiler protects us. We can't assign a wrong value.
// Type '"a "' is not assignable to type 'Branded<string, TrimmedStringBrand>'.
// const a: TrimmedString = 'a '

// We have to use decode, which returns Either. Note the chaining via fold.
// In functional programming, we chain all the time:
// pipe(
//   TrimmedString.decode('a '),
//   fold(onLeft, onRight)
// )

// What if we don't like unknown type in decode? We can extract "output" type,
// a string in this case, with another helper type:
type TrimmedStringOutput = t.OutputOf<typeof TrimmedString>;

// When a value comes out of our app, it's unknown. Let's decode it with pipe and fold:
// import * as E from 'fp-ts/lib/Either';
// import { pipe } from 'fp-ts/lib/pipeable';
// pipe(
//   // Try null, '', 'foo ', whatever.
//   TrimmedString.decode(' adfg'),
//   E.fold(
//     e => {
//       // TODO: Use reporter.
//       console.log(`Failed codec: ${e[0].context[0].type.name}`);
//     },
//     string => {
//       console.log(`Successfully decoded string: ${string}`);
//     },
//   ),
// );

// We validate only external values. Inside the application, we use branded types:
// const toUpperCase = (foo: TrimmedString) => foo.toUpperCase();
// Note TrimmedString still can be used as a regular string.

// OK, we have TrimmedString, so how to create a non empty trimmed string?
// Let's start with NonEmptyString. Fortunately, such codec already exists.
// import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
// To create NonEmptyTrimmedString, we compose TrimmedString and NonEmptyString.

const NonEmptyTrimmedString = t.intersection([TrimmedString, NonEmptyString]);
type NonEmptyTrimmedString = t.TypeOf<typeof NonEmptyTrimmedString>;

// Note that we did not export anything yet. That's because TrimmedString, NonEmptyString,
// and NonEmptyTrimmedString are just helper types. Let's go to domain types.

// Domain types.
// Note that we export both const and type under the same name. TypeScript is awesome.

interface String50Brand {
  readonly String50: unique symbol;
}
export const String50 = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, String50Brand> => s.length < 50,
  'String50',
);
export type String50 = t.TypeOf<typeof String50>;

interface String800Brand {
  readonly String800: unique symbol;
}
export const String800 = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, String800Brand> => s.length < 800,
  'String800',
);
export type String800 = t.TypeOf<typeof String800>;

// OK, we have String50 and String800 types. But for SignUpForm,
// we also need Email, Password, and Option<Phone> types.

interface EmailBrand {
  readonly Email: unique symbol;
}
export const Email = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, EmailBrand> => isEmail(s),
  'Email',
);
export type Email = t.TypeOf<typeof Email>;

interface PasswordBrand {
  readonly Password: unique symbol;
}
export const Password = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, PasswordBrand> => s.length > 5,
  'Password',
);
export type Password = t.TypeOf<typeof Password>;

interface PhoneBrand {
  readonly Phone: unique symbol;
}
export const Phone = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, PhoneBrand> => isMobilePhone(s),
  'Phone',
);
export type Phone = t.TypeOf<typeof Phone>;

// We have all the types we need, so now we can compose the SignUpForm type.
export const SignUpForm = t.type({
  company: String50,
  email: Email,
  password: Password,
  phone: Phone,
  sendNewsletter: t.boolean,
});
export type SignUpForm = t.TypeOf<typeof SignUpForm>;

// // Great, we can validate via decode:
// console.log(
//   SignUpForm.decode({
//     company: 'asdfasdfasdf',
//     email: 'a@s.com',
//     password: 'sdfgsdfg',
//     phone: '775326683',
//     sendNewsletter: true,
//   }),
// );
// For full-fledged validation, check signup form with useForm hook.

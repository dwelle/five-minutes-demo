import * as t from 'io-ts';
import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
import { option } from 'io-ts-types/lib/option';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

// io-ts is a trojan; come for the codec, stay for the Either
// https://twitter.com/GiulioCanti/status/1197459999276056576

// The best way how to explain functional programming is with examples.
// We will start with io-ts, a runtime type system for IO decoding/encoding
// for TypeScript. It's built on top of fp-ts. We will use it for Sign Up form.
//
// For example, that's how we can define runtime User type:
// const User = t.type({
//   userId: t.number,
//   name: t.string
// })

// And that's how we can extract its TypeScript type:
// type User = t.TypeOf<typeof User>
// Which is the same as:
// type User = {
//   userId: number
//   name: string
// }

// We can use User to decode any unknown value in runtime safely:
// const either = User.decode(anything)

// What is Either?
// The Either type returned by decode is defined in fp-ts, a library containing
// implementations of common algebraic types in TypeScript.

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

// In functional programming, we don't use either directly. We pipe all the things!
// TODO: Better snippet.
// pipe(
//   User.decode(...),
//   fold(onFail, onSuccess)
// )

// With io-ts and Either, we can type and validate anything and everything.
// But before a validation, we need to define some model to be validated.
// We will use two super usefull abstractions: Option and branded types.

// 1) Option type
// Instead of null / undefined, we use fp-ts Option type.
// Option is Monad, a wrapped value with some helpers, to express not existing thing.
// Helpers? Imagine Promise.all, but for null/undefined values instead of promises.
// Promise (and Option) is one of many monads.

// 2) Branded type, which is even more wonderfull.
// We can have type safe non empty string or email string. No kidding.
// You, as developer, can define by type system solely, that function foo can
// accept only non empty string, for example. Traditionally, this is possible
// only with throwing exceptions (no way) or complex value objects (unnecessary).

// The best thing is, with functional programming, we can compose all things
// infinitely without source code rot, because pure functions do not rot.
// Period. That's why functional programming is so awesome. Code does not rot.
// Let's start with things we need for sign up form.

// All forms use strings and strings has to be trimmed.
// We all know that ' some@email.com  ' in database would be really bad.
// But where we should trim? In UI? Before saving to database? Everywhere?
// We don't know and we can't know, because classical type system can't tell us.
// Haskell approach is to tell via types explicitly where we can expect already
// trimmed string and where we have to trim. Basically, we validate only
// values from IO boundary (HTTP, HTML forms, file system, database, ...)
// Inside the aplication, we use branded type (Haskel newtype), so the code is
// both perfectly readable and safe.

// TrimmedString
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

// Take a look how compiler protects us. We can't assign a wrong value.
// Type '"a "' is not assignable to type 'Branded<string, TrimmedStringBrand>'.
// const a: TrimmedString = 'a '

// We have to use decode which returns Either. Note chaining via fold.
// In functional programming, we chain all the time:
// pipe(
//   TrimmedString.decode('a '),
//   fold(onLeft, onRight)
// )

// What if we don't like unknown type in decode? How we can extract "output" type,
// a string in this case? With another helper type:
type TrimmedStringOutput = t.OutputOf<typeof TrimmedString>;

// When a value comes out of our app, it's unknown. Let's decode it with pipe and fold:
// import { fold } from 'fp-ts/lib/Either';
// import { pipe } from 'fp-ts/lib/pipeable';
// pipe(
//   // Try null, '', 'foo ', whatever.
//   TrimmedString.decode(' adfg'),
//   fold(
//     e => {
//       // TODO: Use reporter.
//       console.log(`Failed codec: ${e[0].context[0].type.name}`);
//     },
//     string => {
//       console.log(`Successfully decoded string: ${string}`);
//     },
//   ),
// );

// We validate only external values. Inside application, we use branded types:
// const toUpperCase = (foo: TrimmedString) => foo.toUpperCase();
// Note TrimmedString still can be used as a regular string.

// OK, we have TrimmedString, so how to create non empty trimmed string?
// Let's start with NonEmptyString. Fortunately, such codec already exists.
// import { NonEmptyString } from 'io-ts-types/lib/NonEmptyString';
// To create NonEmptyTrimmedString, we compose TrimmedString and NonEmptyString.

// NonEmptyTrimmedString
const NonEmptyTrimmedString = t.intersection([TrimmedString, NonEmptyString]);
type NonEmptyTrimmedString = t.TypeOf<typeof NonEmptyTrimmedString>;

// Note we did not export anything yet. That's because TrimmedString, NonEmptyString,
// and NonEmptyTrimmedString are just helper types. Let's go to domain types.

// Domain types.

// String50
interface String50Brand {
  readonly String50: unique symbol;
}
export const String50 = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, String50Brand> => s.length < 50,
  'String50',
);
export type String50 = t.TypeOf<typeof String50>;

// String800
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

// Email.
interface EmailBrand {
  readonly Email: unique symbol;
}
const Email = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, EmailBrand> => isEmail(s),
  'Email',
);
export type Email = t.TypeOf<typeof Email>;

// Password.
interface PasswordBrand {
  readonly Password: unique symbol;
}
const Password = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, PasswordBrand> => s.length > 5,
  'Password',
);
export type Password = t.TypeOf<typeof Password>;

// Phone.
interface PhoneBrand {
  readonly Phone: unique symbol;
}
const Phone = t.brand(
  NonEmptyTrimmedString,
  (s): s is t.Branded<NonEmptyTrimmedString, PhoneBrand> => isMobilePhone(s),
  'Phone',
);
export type Phone = t.TypeOf<typeof Phone>;

// OK, we have all custom types we need. Now we can create SignUpForm type.
// Functional programming is all about composition.

// SignUpForm
export const SignUpForm = t.type({
  company: String50,
  email: Email,
  password: Password,
  // See how to use option instead of Elvis (?) operator.
  phone: option(Phone),
});
export type SignUpForm = t.TypeOf<typeof SignUpForm>;

// Great, we can validate a form values:
// console.log(
//   SignUpForm.decode({
//     company: 'asdfasdfasdf',
//     email: 'a@s.com',
//     password: 'sdfgsdfg',
//     phone: some('775326683'),
//   }),
// );

// But wait, how to get a type for form initial values? Our form fields know
// nothing about branded types. Do we have to write it? No.
export type SignUpFormOutput = t.OutputOf<typeof SignUpForm>;

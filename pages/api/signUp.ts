import { NextApiRequest, NextApiResponse } from 'next';
import { failure } from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/pipeable';
import { SignUpForm } from '../../types';
import { fold } from 'fp-ts/lib/Either';

const signUp = (req: NextApiRequest, res: NextApiResponse) =>
  // Note we can chain various sync/async logic via pipe:
  // https://github.com/gcanti/io-ts/issues/375#issuecomment-546598070
  pipe(
    SignUpForm.decode(req.body),
    fold(
      errors => {
        // Bad Request with validation errors.
        res.status(400).json({ errors: failure(errors) });
      },
      // signUpForm is 100% typed.
      signUpForm => {
        // Return created object on success is a pattern. It can contain server created
        // data like ID or createdAt etc.
        res.status(200).json(signUpForm);
      },
    ),
  );

export default signUp;

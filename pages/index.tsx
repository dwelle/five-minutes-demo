import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from '@chakra-ui/core';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SignUpForm } from '../types';

// console.log(SignUpForm.decode({ userId: 1, name: 1 }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const a = SignUpForm;

// interface SignUpForm {
//   company: string;
//   email: string;
//   password: string;
//   phone: string;
// }

// const initialState: SignUpForm = {
//   company: '',
//   email: '',
//   password: '',
//   phone: '',
// };

/**
 * This little form helper is all we need.
 */
// const useField = <S extends {}>(
//   // name muze bejt jen dle state
//   name: string,
//   [state, setState]: [S, React.Dispatch<React.SetStateAction<S>>],
// ) => {
//   // vrati value, name? proc ne, onChange, ref
//   // const handleFoo = useCallback<FormEventHandler>(event => {
//   //   console.log(event);
//   // }, []);
// };

const Home = () => {
  // const formState = useState(initialState);
  // TODO: useForm
  // const [] = useForm(formState)

  return (
    <Box m={8}>
      <Text fontSize="xl">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input id="company" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={<Icon name="phone" color="gray.300" />}
              />
              <Input id="phone" type="tel" placeholder="Phone number" />
            </InputGroup>
            <FormErrorMessage>Invalid phone.</FormErrorMessage>
          </FormControl>

          <Button mt={4} variantColor="green">
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;

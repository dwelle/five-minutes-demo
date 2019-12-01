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
import { SignUpForm } from '../types';

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

// const initialState: SignUpFormOutput = {
//   company: '',
//   email: '',
//   password: '',
//   phone: none,
//   sendNewsletter: false,
// };

const Home = () => {
  console.log(SignUpForm.props);

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

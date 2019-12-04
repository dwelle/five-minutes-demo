import {
  Box,
  Button,
  Checkbox,
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
// import { none } from 'fp-ts/lib/Option';
import React, { useCallback } from 'react';
import { useForm } from '../hooks/useForm';
import { SignUpForm } from '../types';

const Home = () => {
  // Everything is 100% typed by SignUpForm.
  const form = useForm(SignUpForm, {
    company: '',
    email: '',
    password: '',
    // phone: none,
    sendNewsletter: false,
  });

  const handleSignUpClick = useCallback(() => {
    // TODO: pipe with sync async code, TE.fromEither, TE.chain etc.
    // pipe(validate(), , reset)
    form.validate();
  }, [form]);

  return (
    <Box m={8}>
      <Text fontSize="xl">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <Stack spacing={4}>
          <FormControl isRequired isInvalid={form.fields.company.isInvalid}>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input id="company" {...form.fields.company.props} />
          </FormControl>

          <FormControl isRequired isInvalid={form.fields.email.isInvalid}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...form.fields.email.props} />
          </FormControl>

          <FormControl isRequired isInvalid={form.fields.password.isInvalid}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              type="password"
              {...form.fields.password.props}
            />
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

          <FormControl>
            <Checkbox {...form.fields.sendNewsletter.props}>
              Yes, send me a newsletter
            </Checkbox>
          </FormControl>

          <Button onClick={handleSignUpClick} mt={4} variantColor="green">
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Home;

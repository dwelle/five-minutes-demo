import React, { useCallback } from 'react';
import Head from 'next/head';
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
  Link,
  Stack,
  Text,
} from '@chakra-ui/core';
import { useForm } from '../hooks/useForm';
import { SignUpForm } from '../types';

const Home = () => {
  // Everything is 100% typed by SignUpForm.
  const form = useForm(SignUpForm, {
    company: '',
    email: '',
    password: '',
    phone: '',
    sendNewsletter: false,
  });

  const handleSignUpClick = useCallback(() => {
    form.validate();
  }, [form]);

  return (
    <>
      <Head>
        <title>
          Typed functional programming in TypeScript in five minutes
        </title>
      </Head>
      <Box m={8}>
        <Text fontSize="xl">Sign Up</Text>
        <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={form.fields.company.isInvalid}>
              <FormLabel htmlFor="company">Company</FormLabel>
              <Input id="company" {...form.fields.company.props} />
              <FormErrorMessage>{form.fields.company.error}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={form.fields.email.isInvalid}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" {...form.fields.email.props} />
              <FormErrorMessage>{form.fields.email.error}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={form.fields.password.isInvalid}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                {...form.fields.password.props}
              />
              <FormErrorMessage>{form.fields.password.error}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={form.fields.phone.isInvalid}>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <InputGroup>
                <InputLeftElement
                  children={<Icon name="phone" color="gray.300" />}
                />
                <Input id="phone" type="tel" {...form.fields.phone.props} />
              </InputGroup>
              <FormErrorMessage>{form.fields.phone.error}</FormErrorMessage>
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
        <Link
          href="https://github.com/typescript-fun/five-minutes-demo"
          isExternal
        >
          github.com/typescript-fun/five-minutes-demo
        </Link>
      </Box>
    </>
  );
};

export default Home;

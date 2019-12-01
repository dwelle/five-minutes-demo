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
  Checkbox,
} from '@chakra-ui/core';
import React from 'react';
import { SignUpForm } from '../types';
import { none } from 'fp-ts/lib/Option';
import { useForm } from '../hooks/useForm';

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const foo = useForm(SignUpForm, {
    company: '',
    email: '',
    password: '',
    phone: none,
    sendNewsletter: false,
  });

  return (
    <Box m={8}>
      <Text fontSize="xl">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input
              // {...fields.company}
              id="company"
            />
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

          <FormControl>
            <Checkbox>Midnight hours available</Checkbox>
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

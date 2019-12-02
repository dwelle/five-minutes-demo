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
import React from 'react';
import { useForm } from '../hooks/useForm';
import { SignUpForm } from '../types';

const Home = () => {
  const { fields } = useForm(SignUpForm, {
    company: '',
    email: '',
    password: '',
    // phone: none,
    sendNewsletter: false,
  });

  return (
    <Box m={8}>
      <Text fontSize="xl">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input id="company" {...fields.company} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" {...fields.email} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" {...fields.password} />
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

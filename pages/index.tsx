import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  FormErrorMessage,
} from '@chakra-ui/core';
import React from 'react';

const Home = () => {
  return (
    <Box m={4}>
      <Text fontSize="lg">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="company">Company</FormLabel>
            <Input id="company" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input type="email" id="email" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input type="password" id="password" />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <InputGroup>
              <InputLeftElement
                children={<Icon name="phone" color="gray.300" />}
              />
              <Input type="tel" id="phone" placeholder="Phone number" />
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

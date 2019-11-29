import { Box, FormControl, FormLabel, Input, Text } from '@chakra-ui/core';
import React from 'react';

const Home = () => {
  return (
    <Box m={4}>
      <Text fontSize="lg">Sign Up</Text>
      <Box maxW="sm" borderWidth="1px" rounded="lg" p={4} my={4}>
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input type="email" id="email" aria-describedby="email-helper-text" />
        </FormControl>
      </Box>
    </Box>
  );
};

export default Home;

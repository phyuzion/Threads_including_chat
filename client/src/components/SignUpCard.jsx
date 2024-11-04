import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Heading,
  useToast,
  Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';
import { gql, useMutation } from "@apollo/client";
import { signupUser } from "../apollo/mutations.js";

const SIGNUP_USER = gql`${signupUser}`;

function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setAuthScreen] = useRecoilState(authScreenAtom);
  const [SIGNUP_USER_COMMAND] = useMutation(SIGNUP_USER);
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: ''
  });


  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (inputs.password.length < 8) {
      toast({
        title: 'Signup failed',
        description: "Password must be at least 8 characters long.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await SIGNUP_USER_COMMAND({ variables: inputs });
      setAuthScreen('login');
      toast({
        title: 'Account created.',
        description: "You have successfully signed up. Please log in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: "Username or email is already in use. Please try a different one.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} style={{ width: '100%', height: '100%' }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
        p={[4, 6, 8]}
        bg="white" // 전체 배경을 흰색으로 설정
        borderRadius="lg"
        boxShadow="lg"
      >
        <Stack spacing={6} w="100%">
          <Heading fontSize="2xl" textAlign="center">Sign Up</Heading>
          <FormControl isRequired>
            <Input
              type="text"
              name="username"
              onChange={handleInputChange}
              value={inputs.username}
              placeholder="Username"
              bg="#e5e5e5"
              border={0}
              _placeholder={{ color: '#a3a3a3' }}
            />
          </FormControl>
          <FormControl isRequired>
            <Input
              type="email"
              name="email"
              onChange={handleInputChange}
              value={inputs.email}
              placeholder="Email"
              bg="#e5e5e5"
              border={0}
              _placeholder={{ color: '#a3a3a3' }}
            />
          </FormControl>
          <FormControl isRequired>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleInputChange}
                value={inputs.password}
                placeholder="Password"
                bg="#e5e5e5"
                border={0}
                _placeholder={{ color: '#a3a3a3' }}
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            loadingText="Signing Up..."
            size="lg"
            bg="#48639D"
            color="white"
            _hover={{ bg: "#d0d3da" }}
            type="submit"
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </Stack>
      </Flex>
    </form>
  );
}

export default SignUpCard;

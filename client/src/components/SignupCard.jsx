import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';
import { gql, useMutation } from "@apollo/client";
import { signupUser } from "../apollo/mutations.js";

const SIGNUP_USER = gql`${signupUser}`;

function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setAuthScreen] = useRecoilState(authScreenAtom);
  const [SIGNUP_USER_COMMAND] = useMutation(SIGNUP_USER);
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [passwordError, setPasswordError] = useState(false);
  const setUser = useSetRecoilState(userAtom);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    if (name === 'password' && value.length >= 8) {
      setPasswordError(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (inputs.password.length < 8) {
      setPasswordError(true);
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
      console.log('inputs: ', inputs);
      const response = await SIGNUP_USER_COMMAND({ variables: inputs });
      console.log('response.data', response.data);
      setAuthScreen('login');
      toast({
        title: 'Account created.',
        description: "You have successfully signed up. Please log in.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
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
    <form onSubmit={handleSignup}>
      <Flex minH={'80vh'} align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
          </Stack>
          <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type='text'
                  name='username'
                  onChange={handleInputChange}
                  value={inputs.username}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  name='email'
                  onChange={handleInputChange}
                  value={inputs.email}
                />
              </FormControl>
              <FormControl isRequired isInvalid={passwordError}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    onChange={handleInputChange}
                    value={inputs.password}
                    borderColor={passwordError ? 'red.500' : 'inherit'}
                  />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() => setShowPassword((showPassword) => !showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText='Signing Up...'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type={'submit'}
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link color={'blue.400'} onClick={() => setAuthScreen('login')}>
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}

export default SignupCard;

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

const SIGNUP_USER = gql` ${signupUser}`;


function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setAuthSceen] = useRecoilState(authScreenAtom);
  const [SIGNUP_USER_COMMAND] = useMutation(SIGNUP_USER);
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
  });
  const setUser = useSetRecoilState(userAtom);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log('inputs: ',inputs)
      const response = await SIGNUP_USER_COMMAND({ variables: inputs})
      console.log('reponse.data')
      // localStorage.setItem('user', JSON.stringify(response?.data?.signupUser));
      // setUser(response?.data?.signupUser);     
      setAuthSceen('login')


    } catch (error) {
      console.log(error);
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
                <FormLabel>User name</FormLabel>
                <Input
                  type='text'
                  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                  value={inputs.username}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                  value={inputs.email}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    value={inputs.password}
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
                  loadingText='Signing In...'
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
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText='Signing In...'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type={'submit'}
                  isLoading={isLoading}
                >
                  temporary button
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Already a user?{' '}
                  <Link color={'blue.400'} onClick={() => setAuthSceen('login')}>
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

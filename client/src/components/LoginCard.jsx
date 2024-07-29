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
import { useRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom.js';
import userAtom from '../atoms/userAtom.js';
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { loginUser } from "../apollo/mutations.js";

function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [_, setAuthSceen] = useRecoilState(authScreenAtom);
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState();
  const toast = useToast();
  const client = useApolloClient(); // Apollo Client instance

  const LOGIN_USER = gql` ${loginUser}`;
  const [LOGIN_USER_COMMAND] = useMutation(LOGIN_USER, { loginCompleted, loginError });

  async function loginCompleted({ data }) {
    console.log(' LOGIN_USER onCompleted : ')
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data.loginUser);
    await client.clearStore(); // Clear Apollo Client cache
    await client.resetStore(); // Reset Apollo Client cache
  }

  function loginError(errors) {
    console.log("🚀 ~ loginError ~ errors:", errors)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      console.log(' inputs: ',inputs)
      const response = await LOGIN_USER_COMMAND({ variables: inputs });
      if(response?.data){
        console.log(' data : ',response.data)
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response?.data?.loginUser);
        await client.clearStore(); // Clear Apollo Client cache
        await client.resetStore(); // Reset Apollo Client cache
      }
    } catch(error) {
      console.log(error.stack)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Flex minH={'80vh'} align={'center'} justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
          </Stack>
          <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.dark')} boxShadow={'lg'} p={8}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type={'text'}
                  onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                  value={inputs.username}
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
                  loadingText='Logging In...'
                  size='lg'
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  type={'submit'}
                  isLoading={isLoading}
                >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Create Account?{' '}
                  <Link color={'blue.400'} onClick={() => setAuthSceen('signup')}>
                    Sign-up
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

export default LoginCard;

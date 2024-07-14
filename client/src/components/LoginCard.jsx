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



  const LOGIN_USER = gql` ${loginUser}`;
  const [LOGIN_USER_COMMAND] = useMutation(LOGIN_USER, { loginCompleted, loginError });
  async function loginCompleted({ data }) {
    console.log(' LOGIN_USER onCompleted : ')
  }
  function loginError(errors) {
    console.log("🚀 ~ loginError ~ errors:", errors)
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      console.log(' inputs: ',inputs)
      const response = await LOGIN_USER_COMMAND({ variables:inputs})//useMutation(LOGIN_USER, {variables:{ inputs  },
      if(response?.data){
        console.log(' data : ',response.data)
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response?.data?.loginUser);
        //localStorage.setItem('token', JSON.stringify(data.jwtToken));
      }
    } catch(error) {
      console.log(error.stack)
    }



    //   const res = await fetch('/api/users/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(inputs),
    //   });

    //   const data = await res.json();
    //   if (data.error) {
    //     toast({
    //       title: 'Error',
    //       description: data.error,
    //       status: 'error',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     return;
    //   } else {
    //     toast({
    //       title: 'Successfully Logged in',
    //       description: '',
    //       status: 'success',
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //   }

    //   localStorage.setItem('user', JSON.stringify(data));
    //   setUser(data);
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setIsLoading(false);
    // }
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
                  loadingText='Loging In...'
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

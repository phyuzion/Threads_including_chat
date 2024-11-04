import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  Heading,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { loginUser } from "../apollo/mutations.js";
import SignUpCard from '../components/SignUpCard.jsx'; // SignUpCard를 가져옵니다.

const LOGIN_USER = gql`${loginUser}`;

function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [, setUser] = useRecoilState(userAtom);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const client = useApolloClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  async function loginCompleted({ data }) {
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data.loginUser);
    await client.clearStore();
    await client.resetStore();
  }

  function loginError(errors) {
    toast({
      title: 'Login failed',
      description: "Invalid username or password.",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  const [LOGIN_USER_COMMAND] = useMutation(LOGIN_USER, {
    onCompleted: loginCompleted,
    onError: loginError,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await LOGIN_USER_COMMAND({ variables: inputs });
      if (response?.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response?.data);
        await client.clearStore();
        await client.resetStore();
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: "Unable to login. Please try again later.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" bg="#f4f4f4" overflow="hidden">
      <Flex
        w={['90%', '85%', '80%', '70%']}
        boxShadow="lg"
        rounded="lg"
        overflow="hidden"
        bg="#ffffff"
        flexDirection={['column', 'column', 'row']}
        maxHeight="90vh"
      >
        {/* Left Side (Login Form) */}
        <Box flex="1" p={8} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Image src="/ess-logo.png" alt="Logo" mb={4} width="100px" />
          <Heading fontSize="2xl" mb={4} textAlign="center">Discover Your Creator</Heading>
          
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <Stack spacing={4}>
              <FormControl id="username" isRequired>
                <Input
                  name="username"
                  placeholder="Username"
                  onChange={handleInputChange}
                  value={inputs.username}
                  bg="#e5e5e5"
                  border={0}
                  _placeholder={{ color: '#a3a3a3' }}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <InputGroup>
                  <Input
                    name="password"
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    value={inputs.password}
                    bg="#e5e5e5"
                    border={0}
                    _placeholder={{ color: '#a3a3a3' }}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                loadingText="Logging In..."
                size="lg"
                bg="#48639D"
                color="white"
                _hover={{
                  bg: "#d0d3da",
                }}
                type="submit"
                isLoading={isLoading}
              >
                Login
              </Button>

              <Text align="center" mt={2}>
                Create Account?{' '}
                <Link color="#007bff" onClick={onOpen}>
                  Sign-up
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>

        {/* Right Side (Image Display) */}
        <Box
          flex="1"
          display={['none', 'none', 'block']}
          bg="#eaeaea"
          position="relative"
          height="100%"
        >
          <Image
            src="https://via.placeholder.com/800"
            alt="Sample"
            objectFit="cover"
            width="100%"
            height="100%"
          />
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="lg"> {/* `size="lg"`로 모달 크기 설정 */}
          <ModalOverlay />
          <ModalContent maxW="600px" borderRadius="lg" p={0}> {/* 패딩을 0으로 설정 */}
            <ModalCloseButton />
            <ModalBody p={0}> {/* `ModalBody` 패딩을 0으로 설정 */}
              <SignUpCard />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
}

export default AuthPage;

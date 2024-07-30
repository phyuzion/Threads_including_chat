import React, { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../hooks/usePreviewImage';
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = ({ isOpen, onClose }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
  });
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const profilePicRef = useRef();
  const { handleImageChange, previewImage } = usePreviewImage();
  const toast = useToast();
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitBtnLoading(true);
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...inputs, profilePic: previewImage }),
      });
      const data = await res.json();
      if (data) {
        toast({
          title: 'Success',
          description: data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsSubmitBtnLoading(false);

        navigate(`/${user.username}`);
        onClose(); // Close the modal after successful update
      }
    } catch (error) {
      toast({
        title: 'Failed To Update Profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitBtnLoading(false);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast({
          title: 'File Too Large',
          description: 'File size should be 2MB or less.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      handleImageChange(e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="md" p={0} m={0}>
        <ModalBody p={0} m={0}>
          <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
            <Flex align={'center'} justify={'center'} p={0} w={'100%'}>
              <Stack spacing={4} w={'full'} bg={'gray.dark'} p={6}>
                <FormControl>
                  <Stack direction={['column', 'row']} spacing={6}>
                    <Center>
                      <Avatar size='xl' src={previewImage || user.profilePic}></Avatar>
                    </Center>
                    <Center w='full'>
                      <Button
                        w='full'
                        onClick={() => {
                          profilePicRef.current.click();
                        }}
                      >
                        Change Profile Pic
                      </Button>
                      <Input type='file' hidden ref={profilePicRef} onChange={handleProfilePicChange} accept="image/*" />
                    </Center>
                  </Stack>
                </FormControl>
                <FormControl>
                  <FormLabel>User name</FormLabel>
                  <Input
                    placeholder='johndoe'
                    _placeholder={{ color: 'gray.500' }}
                    type='text'
                    value={inputs.username}
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    placeholder='your-email@example.com'
                    _placeholder={{ color: 'gray.500' }}
                    type='email'
                    value={inputs.email}
                    onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder='password'
                      _placeholder={{ color: 'gray.500' }}
                      type={showPassword ? 'text' : 'password'}
                      value={inputs.password}
                      onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
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
                <Stack spacing={6} direction={['column', 'row']}>
                  <Button
                    bg={'red.400'}
                    color={'white'}
                    _hover={{
                      bg: 'red.500',
                    }}
                    w={'full'}
                    onClick={onClose} // Close the modal on cancel
                  >
                    Cancel
                  </Button>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    w='full'
                    _hover={{
                      bg: 'blue.500',
                    }}
                    type='submit'
                    isLoading={isSubmitBtnLoading}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfilePage;

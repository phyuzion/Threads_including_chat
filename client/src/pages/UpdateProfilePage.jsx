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
  Textarea,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../hooks/usePreviewImage';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { Update_User } from '../apollo/mutations';

const UpdateProfilePage = ({ isOpen, onClose }) => {
  const UPDATE_USER = gql`${Update_User}`;
  const [UPDATE_USER_COMMAND] = useMutation(UPDATE_USER);
  const PROFILE_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`;
  const [user, setUser] = useRecoilState(userAtom);
  console.log('UpdateProfilePage user:', user);

  const [bioText, setBioText] = useState('');

  const [inputs, setInputs] = useState({
    email: user?.loginUser?.email || '',
    password: user?.loginUser?.password || '',
    passwordConfirm: user?.loginUser?.password || '',
  });
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const profilePicRef = useRef();
  const { handleImageChange, previewImage } = usePreviewImage();
  const toast = useToast();
  const navigate = useNavigate();
  const passwordIsValid = inputs.password.length >= 8 && inputs.password === inputs.passwordConfirm;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (inputs.password.length > 0 && !passwordIsValid) {
      toast({
        title: 'Password Error',
        description: 'Passwords do not match or are too short.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setIsSubmitBtnLoading(true);
      let previewUrl = null;

      if (previewImage) {
        console.log('handleUpdateProfile previewImage available');

        const fileToUpload = profilePicRef.current.files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload);
        const user_ = JSON.parse(localStorage.getItem('user') || '{}');
        const res = await fetch(PROFILE_URL, {
          method: 'POST',
          headers: {
            Authorization: user_?.loginUser?.jwtToken ? `Bearer ${user_.loginUser.jwtToken}` : '',
          },
          body: formData,
        });

        const data = await res.json();
        previewUrl = data?.url;
        console.log('updateProfile previewUrl:', previewUrl);
      }
      console.log('updateProfile inputs:', inputs);
      const variables = {
        email: inputs.email || null,
        password: inputs.password || null,
        profilePic: previewUrl || null,    
        bio: bioText || null   
      }
      console.log('updateProfile inputs:', inputs);
      const response = await UPDATE_USER_COMMAND({
        variables: variables,
      });

      if (response?.data) {
        toast({
          title: 'Success',
          description: 'Update User Successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setUser((prevUser) => ({
          ...prevUser,
          loginUser: {
            ...prevUser.loginUser,
            email: inputs.email || prevUser?.loginUser?.email,
            profilePic: previewUrl || prevUser?.loginUser?.profilePic,
            bio: inputs.bio ||  prevUser?.loginUser?.bio
          },
        }));
        localStorage.setItem('user', JSON.stringify({
          ...user,
          loginUser: {
            ...user.loginUser,
            email: inputs.email || user?.loginUser?.email,
            profilePic: previewUrl || user?.loginUser?.profilePic,
            bio: inputs.bio ||  user?.loginUser?.bio
          },
        }));
        setIsSubmitBtnLoading(false);
        onClose(); // Close the modal after successful update
        navigate(`/${user?.loginUser?.username}`); // Navigate to UserPage after update
        window.location.reload();
      }
    } catch (error) {
      console.log('handleUpdateProfile error:', error);
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

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };


  const handleTextChange = (e) => {
    setBioText(e.target.value.slice(0, 500));
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="md" p={0} m={0} maxHeight={'90vh'} overflowY={'auto'}>
        <ModalBody p={0} m={0}>
          <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
            <Flex align={'center'} justify={'center'} p={0} w={'100%'}>
              <Stack spacing={[4, 6]} w={'full'} bg={'gray.dark'} p={[6, 8]}>
                <FormControl>
                  <Center>
                    <Avatar size={{ base: 'xl', md: '2xl' }} src={previewImage || user?.loginUser?.profilePic}></Avatar>
                  </Center>
                </FormControl>
                <FormControl>
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
                </FormControl>

                <Textarea
                  placeholder='Write your BIO here'
                  value={bioText || user?.loginUser?.bio}
                  onChange={handleTextChange}
                  size='lg'
                  resize='none'
                  color={'white'}
                  maxLength={500}
                />
                <Flex justifyContent='flex-end' width='100%'>
                  <Text color='gray.400'>{bioText.length}/500</Text>
                </Flex>

                <FormControl>
                  <FormLabel fontSize={['sm', 'md']}>Email</FormLabel>
                  <Input
                    placeholder='your-email@example.com'
                    _placeholder={{ color: 'gray.500' }}
                    type='email'
                    value={inputs.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormControl>
                <FormControl isInvalid={!passwordIsValid && inputs.password.length > 0}>
                  <FormLabel fontSize={['sm', 'md']}>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={inputs.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <InputRightElement>
                      <Button onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl isInvalid={!passwordIsValid && inputs.passwordConfirm.length > 0}>
                  <FormLabel fontSize={['sm', 'md']}>Password Check</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={inputs.passwordConfirm}
                      onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                    />
                    <InputRightElement>
                      <Button onClick={() => setShowPassword(!showPassword)}>
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
                    disabled={!passwordIsValid && inputs.password.length > 0}
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

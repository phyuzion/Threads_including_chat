import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
  Avatar,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import usePreviewImage from '../hooks/usePreviewImage';
import { gql, useMutation } from '@apollo/client';
import { Update_User } from '../apollo/mutations';

const UpdateProfilePage = ({ isOpen, onClose }) => {
  const UPDATE_USER = gql`${Update_User}`;
  const [UPDATE_USER_COMMAND] = useMutation(UPDATE_USER);
  const PROFILE_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`;
  const [user, setUser] = useRecoilState(userAtom);
  const [bioText, setBioText] = useState(user?.loginUser?.bio || '');

  const [inputs, setInputs] = useState({
    email: user?.loginUser?.email || '',
    password: '',
    passwordConfirm: '',
  });

  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const profilePicRef = useRef();
  const { handleImageChange, previewImage } = usePreviewImage();
  const toast = useToast();

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
    setIsSubmitBtnLoading(true);

    try {
      let previewUrl = null;
      if (previewImage) {
        const fileToUpload = profilePicRef.current.files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload);

        const res = await fetch(PROFILE_URL, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        previewUrl = data?.url;
      }

      const response = await UPDATE_USER_COMMAND({
        variables: {
          email: inputs.email || null,
          password: inputs.password || null,
          profilePic: previewUrl || user?.loginUser?.profilePic,
          bio: bioText || null,
        },
      });

      if (response?.data) {
        setUser((prevUser) => ({
          ...prevUser,
          loginUser: {
            ...prevUser.loginUser,
            email: inputs.email || prevUser?.loginUser?.email,
            profilePic: previewUrl || prevUser?.loginUser?.profilePic,
            bio: bioText || prevUser?.loginUser?.bio,
          },
        }));
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Failed to Update Profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitBtnLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxW="md" p={0} m={0} maxHeight={'90vh'} overflowY={'auto'}>
        <ModalBody p={0} m={0} bg="white">
          <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
            <Flex direction="column" align="center" p={6}>
              {/* Profile Image Section */}
              <Box
                bgImage={`url(${previewImage || user?.loginUser?.profilePic || 'path/to/anonymous_image.png'})`}
                bgSize="cover"
                bgPosition="center"
                borderRadius="lg"
                width="80%"
                aspectRatio="4/3"
                position="relative"
                overflow="hidden"
                mb={4}
              >
                <Button
                  position="absolute"
                  bottom={2}
                  left="50%"
                  transform="translateX(-50%)"
                  size="sm"
                  bg="#48639D"
                  color="white"
                  borderRadius="full"
                  onClick={() => profilePicRef.current.click()}
                  _hover={{ bg: '#3E5377' }}
                >
                  Change Profile Picture
                </Button>
                <Input
                  type="file"
                  ref={profilePicRef}
                  onChange={(e) => handleImageChange(e)}
                  accept="image/*"
                  hidden
                />
              </Box>

              {/* Bio Section */}
              <Textarea
                placeholder="Write your BIO here"
                value={bioText}
                onChange={(e) => setBioText(e.target.value.slice(0, 500))}
                size="lg"
                resize="none"
                color="gray.800"
                maxLength={500}
                border="1px solid #D1D1D1"
                _focus={{ borderColor: '#48639D' }}
                mb={4}
              />
              <Text alignSelf="flex-end" color="gray.500" fontSize="sm">
                {bioText.length}/500
              </Text>

              {/* Email Section */}
              <FormControl mb={4}>
                <FormLabel fontSize="sm" color="#333333">Email</FormLabel>
                <Input
                  placeholder="your-email@example.com"
                  type="email"
                  value={inputs.email}
                  onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
                  border="1px solid #D1D1D1"
                  _focus={{ borderColor: '#48639D' }}
                />
              </FormControl>

              {/* Password Section */}
              <FormControl mb={4} isInvalid={!passwordIsValid && inputs.password.length > 0}>
                <FormLabel fontSize="sm" color="#333333">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={inputs.password}
                    onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                    border="1px solid #D1D1D1"
                    _focus={{ borderColor: '#48639D' }}
                  />
                  <InputRightElement>
                    <Button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl mb={6} isInvalid={!passwordIsValid && inputs.passwordConfirm.length > 0}>
                <FormLabel fontSize="sm" color="#333333">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={inputs.passwordConfirm}
                    onChange={(e) => setInputs({ ...inputs, passwordConfirm: e.target.value })}
                    border="1px solid #D1D1D1"
                    _focus={{ borderColor: '#48639D' }}
                  />
                  <InputRightElement>
                    <Button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Action Buttons */}
              <Stack direction="row" spacing={4} w="full">
                <Button
                  bg={'#a83232'}
                  color={'white'}
                  _hover={{
                    bg: '#8f2727',
                  }}
                  w="full"
                  borderRadius="full"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                      
                  bg={'#48639D'}
                  color={'white'}
                  _hover={{
                    bg: '#3E5377',
                  }}
                  w="full"
                  borderRadius="full"
                  isLoading={isSubmitBtnLoading}
                  type="submit"
                  disabled={!passwordIsValid && inputs.password.length > 0}
                >
                  Submit
                </Button>
              </Stack>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateProfilePage;

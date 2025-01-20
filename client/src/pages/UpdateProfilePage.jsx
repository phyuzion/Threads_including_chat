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

// 커스텀 훅 (이미지 미리보기)
import usePreviewImage from '../hooks/usePreviewImage';

// GraphQL
import { gql, useMutation } from '@apollo/client';
import { Update_User } from '../apollo/mutations';

// 라우팅 (필요 시)
import { useNavigate } from 'react-router-dom';

const UpdateProfilePage = ({ isOpen, onClose }) => {
  // GraphQL Mutation
  const UPDATE_USER = gql`${Update_User}`;
  const [UPDATE_USER_COMMAND] = useMutation(UPDATE_USER);

  // 업로드 서버 주소 (env)
  const PROFILE_URL = import.meta.env.VITE_MEDIA_SERVER_URL;

  // 전역 User 상태
  const [user, setUser] = useRecoilState(userAtom);

  // BIO, Inputs 상태
  const [bioText, setBioText] = useState(user?.loginUser?.bio || '');
  const [inputs, setInputs] = useState({
    email: user?.loginUser?.email || '',
    password: '',
    passwordConfirm: '',
    wallet_address: user?.loginUser?.wallet_address || '',
  });

  // 로딩/패스워드 관련 상태
  const [isSubmitBtnLoading, setIsSubmitBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 이미지 관련 ref, 미리보기 훅
  const profilePicRef = useRef();
  const { handleImageChange, previewImage } = usePreviewImage();

  // Toast + 라우터
  const toast = useToast();
  const navigate = useNavigate();

  // 비밀번호 유효성 체크 로직
  const passwordIsValid =
    inputs.password.length >= 8 && inputs.password === inputs.passwordConfirm;

  // 인풋 변경 핸들러
  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // BIO 변경 핸들러 (최대 500자)
  const handleTextChange = (e) => {
    setBioText(e.target.value.slice(0, 500));
  };

  // 파일 선택 시(이미지 여부, 2MB 체크), 통과하면 미리보기 세팅
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
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'File size should be 2MB or less.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // 미리보기 훅 호출
      handleImageChange(e);
    }
  };

  // 폼 전송 핸들러
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // 비번 유효성 검사
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
      // 1) 이미지 업로드
      let previewUrl = null;
      if (previewImage && profilePicRef.current?.files[0]) {
        const fileToUpload = profilePicRef.current.files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload);

        // 로컬스토리지에서 토큰 가져오기 (인증 필요한 경우)
        const user_ = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user_?.loginUser?.jwtToken || '';

        const res = await fetch(PROFILE_URL, {
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: formData,
        });
        const data = await res.json();
        previewUrl = data?.url;
      }

      // 2) GraphQL Mutation 실행
      const variables = {
        email: inputs.email || null,
        password: inputs.password || null,
        profilePic: previewUrl || user?.loginUser?.profilePic || null,
        bio: bioText || null,
        wallet_address: inputs.wallet_address || null,
      };

      const response = await UPDATE_USER_COMMAND({ variables });

      // 3) Recoil & localStorage 업데이트
      if (response?.data) {
        // Recoil user 상태 업데이트
        setUser((prevUser) => ({
          ...prevUser,
          loginUser: {
            ...prevUser.loginUser,
            email: inputs.email || prevUser.loginUser.email,
            profilePic: previewUrl || prevUser.loginUser.profilePic,
            bio: bioText || prevUser.loginUser.bio,
            wallet_address: inputs.wallet_address || prevUser.loginUser.wallet_address,
          },
        }));

        // localStorage에 다시 저장
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            loginUser: {
              ...user.loginUser,
              email: inputs.email || user.loginUser.email,
              profilePic: previewUrl || user.loginUser.profilePic,
              bio: bioText || user.loginUser.bio,
              wallet_address: inputs.wallet_address || user.loginUser.wallet_address,
            },
          })
        );

        toast({
          title: 'Success',
          description: 'Update User Successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // 모달 닫기
        onClose();

        // 페이지 이동 + 새로고침 (필요시)
        // navigate(`/${user?.loginUser?.username}`);
        // window.location.reload();
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
      <ModalContent maxW="md" p={0} m={0} maxHeight="90vh" overflowY="auto">
        <ModalBody p={0} m={0} bg="white">
          {/* form 태그 안에서 onSubmit */}
          <form onSubmit={handleUpdateProfile} style={{ width: '100%' }}>
            <Flex direction="column" align="center" p={6}>
              {/* Profile Image Section (두 번째 코드의 UI) */}
              <Box
                position="relative"
                width="80%"
                aspectRatio="4/3"  // Chakra UI 2.x 이상
                borderRadius="lg"
                overflow="hidden"
                mb={4}
              >
                {/** 실제 이미지 태그로 렌더링 (as="img") */}
                <Box
                  as="img"
                  src={previewImage || user?.loginUser?.profilePic}
                  alt="Profile"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
                
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
                  onChange={handleProfilePicChange}
                  accept="image/*"
                  hidden
                />
              </Box>

              {/* Bio Section */}
              <Textarea
                placeholder="Write your BIO here"
                value={bioText}
                onChange={handleTextChange}
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
                <FormLabel fontSize="sm" color="#333333">
                  Email
                </FormLabel>
                <Input
                  placeholder="your-email@example.com"
                  type="email"
                  value={inputs.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  border="1px solid #D1D1D1"
                  _focus={{ borderColor: '#48639D' }}
                />
              </FormControl>

              {/* Password Section */}
              <FormControl
                mb={4}
                isInvalid={!passwordIsValid && inputs.password.length > 0}
              >
                <FormLabel fontSize="sm" color="#333333">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={inputs.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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
              <FormControl
                mb={6}
                isInvalid={!passwordIsValid && inputs.passwordConfirm.length > 0}
              >
                <FormLabel fontSize="sm" color="#333333">
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={inputs.passwordConfirm}
                    onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
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

              {/* Wallet Address */}
              <FormControl mb={4}>
                <FormLabel fontSize="sm" color="#333333">
                  Wallet Address
                </FormLabel>
                <Input
                  placeholder="Your Wallet Address"
                  type="text"
                  value={inputs.wallet_address}
                  onChange={(e) =>
                    handleInputChange('wallet_address', e.target.value)
                  }
                  border="1px solid #D1D1D1"
                  _focus={{ borderColor: '#48639D' }}
                />
              </FormControl>

              {/* Action Buttons */}
              <Stack direction="row" spacing={4} w="full">
                <Button
                  bg="#a83232"
                  color="white"
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
                  bg="#48639D"
                  color="white"
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

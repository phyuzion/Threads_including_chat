import React, { useRef, useState } from 'react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useColorModeValue,
  useDisclosure,
  Textarea,
  Input,
  Text,
  Flex,
  FormControl,
  Box,
  useToast,
  VStack
} from '@chakra-ui/react';
import usePreviewImage from '../hooks/usePreviewImage';
import usePreviewVideo from '../hooks/usePreviewVideo';
import { BsFileImageFill } from 'react-icons/bs';
import { IoMdVideocam } from 'react-icons/io';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { gql, useMutation } from "@apollo/client";
import { Create_Post } from "../apollo/mutations";


const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const { handleImageChange, previewImage, setPreviewImage } = usePreviewImage();
  const { handleVideoChange, previewVideo, setPreviewVideo } = usePreviewVideo();
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const CREATE_POST = gql` ${Create_Post}`;
  const [CREATE_POST_COMMAND] = useMutation(CREATE_POST);
  const UPLOAD_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`;

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !previewImage && !previewVideo) {
      toast({
        title: "Content Required",
        description: "Please provide text, image, or video before posting.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsCreatePostLoading(true);
      const fileToUpload = previewImage ? imageInputRef.current.files[0] : videoInputRef.current.files[0];

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const user_ = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Authorization': user_?.loginUser?.jwtToken ? `Bearer ${user_.loginUser.jwtToken}` : ""
        },
        body: formData,
      });

      const data = await res.json();
      const response = await CREATE_POST_COMMAND({
        variables: {
          text: postText,
          imgUrl: data.url
        }
      });

      if (response.data) {
        setPosts([response.data.createPost, ...posts]);
        onClose();
        setPostText('');
        setPreviewImage(null);
        setPreviewVideo(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error('Create post:', error);
    } finally {
      setIsCreatePostLoading(false);
    }
  };

  return (
    <div>
      <Button position={'fixed'} bottom={10} right={10} bg={useColorModeValue('gray.300', 'gray.dark')} leftIcon={<AddIcon />} onClick={onOpen}>
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Textarea
                placeholder='Write your post details here'
                value={postText}
                onChange={handleTextChange}
                size="lg"
                resize="none"
              />
              <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
                <Input type='file' hidden ref={imageInputRef} onChange={handleImageChange} accept="image/*" />
                <Input type='file' hidden ref={videoInputRef} onChange={handleVideoChange} accept="video/*" />
                <Box display='flex' alignItems='center' bg='gray.500' borderRadius='md' p={2} cursor='pointer' onClick={() => imageInputRef.current.click()}>
                  <BsFileImageFill size={20} />
                  <Text ml={2}>Image</Text>
                </Box>
                <Box display='flex' alignItems='center' bg='gray.500' borderRadius='md' p={2} cursor='pointer' onClick={() => videoInputRef.current.click()}>
                  <IoMdVideocam size={24} />
                  <Text ml={2}>Video</Text>
                </Box>
              </Flex>
              {previewImage && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <img src={previewImage} alt="Preview" />
                  <Button size='sm' onClick={() => setPreviewImage(null)} position={'absolute'} top={2} right={2}><CloseIcon /></Button>
                </Flex>
              )}
              {previewVideo && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <video width="100%" controls src={previewVideo} />
                  <Button size='sm' onClick={() => setPreviewVideo(null)} position={'absolute'} top={2} right={2}><CloseIcon /></Button>
                </Flex>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={isCreatePostLoading}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;
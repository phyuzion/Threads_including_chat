import React, { useRef, useState } from 'react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
  Text,
  Flex,
  Box,
  useToast,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { BsFileImageFill } from 'react-icons/bs';
import { IoMdVideocam } from 'react-icons/io';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { gql, useMutation } from '@apollo/client';
import { Create_Post } from '../apollo/mutations';
import usePreviewImage from '../hooks/usePreviewImage';
import usePreviewVideo from '../hooks/usePreviewVideo';

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const { handleImageChange, previewImage, setPreviewImage, processedImage } = usePreviewImage(); // webP or JPEG
  const { handleVideoChange, previewVideo, setPreviewVideo } = usePreviewVideo();
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const [isCreatePostLoading, setIsCreatePostLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const CREATE_POST = gql`${Create_Post}`;
  const [CREATE_POST_COMMAND] = useMutation(CREATE_POST);
  const UPLOAD_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`;

  const handleTextChange = (e) => {
    setPostText(e.target.value.slice(0, 500));
  };

  const extractHashtags = (text) => {
    const regex = /#(\w+)/g;
    let matches;
    const hashtags = [];
    let cleanedText = text;

    while ((matches = regex.exec(text)) !== null) {
      hashtags.push(matches[1]);
    }

    cleanedText = cleanedText.replace(regex, '').trim();

    return { cleanedText, hashtags };
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !previewImage && !previewVideo) {
      toast({
        title: 'Content Required',
        description: 'Please provide text, image, or video before posting.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const { cleanedText, hashtags } = extractHashtags(postText);

    console.log('Input Text', cleanedText);
    console.log('Input hashtags', hashtags);

    try {
      setIsCreatePostLoading(true);
      const fileToUpload = previewImage ? processedImage : videoInputRef.current.files[0]; // webP or JPEG

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const user_ = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: user_?.loginUser?.jwtToken ? `Bearer ${user_.loginUser.jwtToken}` : '',
        },
        body: formData,
      });

      const data = await res.json();

      const response = await CREATE_POST_COMMAND({
        variables: {
          text: JSON.stringify(cleanedText),
          imgUrl: previewImage ? data.url : "",
          videoUrl: !previewImage ? data.url : "",
          hashtags: hashtags
        }
      });

      if (response?.data) {
        setPosts([response.data.createPost, ...posts]);
        onClose();
        setPostText('');
        setPreviewImage(null);
        setPreviewVideo(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post.',
        status: 'error',
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
      <Button
        position={'fixed'}
        bottom={10}
        right={10}
        bg={'gray.dark'}
        color={'white'}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={'gray.dark'} borderRadius="md" boxShadow="xl">
          <ModalBody p={6}>
            <VStack spacing={4}>
              <Textarea
                placeholder='Write your post details here'
                value={postText}
                onChange={handleTextChange}
                size='lg'
                resize='none'
                color={'white'}
                maxLength={500}
              />
              <Flex justifyContent='flex-end' width='100%'>
                <Text color='gray.400'>{postText.length}/500</Text>
              </Flex>
              <Flex alignItems={'center'} justifyContent={'center'} gap={2}>
                <Input type='file' hidden ref={imageInputRef} onChange={handleImageChange} accept='image/*' />
                <Input type='file' hidden ref={videoInputRef} onChange={handleVideoChange} accept='video/*' />
                <Box
                  display='flex'
                  alignItems='center'
                  bg='gray.600'
                  borderRadius='md'
                  p={2}
                  cursor='pointer'
                  onClick={() => imageInputRef.current.click()}
                >
                  <BsFileImageFill size={20} color='white' />
                  <Text ml={2} color='white'>
                    Image
                  </Text>
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  bg='gray.600'
                  borderRadius='md'
                  p={2}
                  cursor='pointer'
                  onClick={() => videoInputRef.current.click()}
                >
                  <IoMdVideocam size={24} color='white' />
                  <Text ml={2} color='white'>
                    Video
                  </Text>
                </Box>
              </Flex>
              {previewImage && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <img src={previewImage} alt='Preview' />
                  <Button size='sm' onClick={() => setPreviewImage(null)} position={'absolute'} top={2} right={2}>
                    <CloseIcon />
                  </Button>
                </Flex>
              )}
              {previewVideo && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <video width='100%' controls src={previewVideo} />
                  <Button size='sm' onClick={() => setPreviewVideo(null)} position={'absolute'} top={2} right={2}>
                    <CloseIcon />
                  </Button>
                </Flex>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter bg={'gray.dark'}>
            <Button
              bg={'red.400'}
              color={'white'}
              _hover={{
                bg: 'red.500',
              }}
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              onClick={handleCreatePost}
              isLoading={isCreatePostLoading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;

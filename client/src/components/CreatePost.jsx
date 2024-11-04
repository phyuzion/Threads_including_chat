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
  const { isOpen, onOpen, onClose } = useDisclosure({ preserveScrollBarGap: true });
  const [postText, setPostText] = useState('');
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const { handleImageChange, previewImage, setPreviewImage, processedImage } = usePreviewImage();
  const { handleVideoChange, previewVideo, setPreviewVideo, videoFile } = usePreviewVideo();
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

    try {
      setIsCreatePostLoading(true);
      const fileToUpload = previewImage ? processedImage : videoFile;
      let data = { url: "" };

      if (fileToUpload) {
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

        data = await res.json();
      }

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
        bottom={[4, 6, 10]}
        right={[4, 6, 10]}
        bg={'#48639D'}
        color={'white'}
        leftIcon={<AddIcon />}
        onClick={onOpen}
        borderRadius="full"
        _hover={{ bg: '#3E5377' }}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={'white'} borderRadius="2xl" boxShadow="2xl" p={2}>
          <ModalBody pt={[4, 6, 8]}>
            <VStack spacing={4}>
              {!previewImage && !previewVideo && (
                <Flex justifyContent="center" gap={4} width="100%">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="#f9f9f9"
                    borderRadius="md"
                    p={4}
                    width="50%"
                    cursor="pointer"
                    onClick={() => imageInputRef.current.click()}
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                  >
                    <BsFileImageFill size={30} color="#48639D" />
                    <Text mt={2} color="#48639D">
                      Upload Image
                    </Text>
                    <Input type="file" hidden ref={imageInputRef} onChange={handleImageChange} accept="image/*" />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="#f9f9f9"
                    borderRadius="md"
                    p={4}
                    width="50%"
                    cursor="pointer"
                    onClick={() => videoInputRef.current.click()}
                    boxShadow="sm"
                    _hover={{ boxShadow: "md" }}
                  >
                    <IoMdVideocam size={30} color="#48639D" />
                    <Text mt={2} color="#48639D">
                      Upload Video
                    </Text>
                    <Input type="file" hidden ref={videoInputRef} onChange={handleVideoChange} accept="video/*" />
                  </Box>
                </Flex>
              )}
              {previewImage && (
                <Flex m={1} w={'full'} position={'relative'}>
                  <img src={previewImage} alt='Preview' style={{ borderRadius: '8px', maxHeight: '300px', width: '100%', objectFit: 'cover' }} />
                  <Button size='sm' onClick={() => setPreviewImage(null)} position={'absolute'} top={2} right={2} bg='#a83232' color='white' borderRadius='full'>
                    <CloseIcon />
                  </Button>
                </Flex>
              )}
              {previewVideo && (
                <Flex m={1} w={'full'} position={'relative'}>
                  <video width='100%' controls src={previewVideo} style={{ borderRadius: '8px', maxHeight: '300px' }} />
                  <Button size='sm' onClick={() => setPreviewVideo(null)} position={'absolute'} top={2} right={2} bg='#a83232' color='white' borderRadius='full'>
                    <CloseIcon />
                  </Button>
                </Flex>
              )}
              <Textarea
                placeholder='Write your post details here...'
                value={postText}
                onChange={handleTextChange}
                size='lg'
                resize='none'
                color={'black'}
                bg={'#f9f9f9'}
                borderRadius="md"
                border="1px solid #e0e0e0"
                _focus={{ boxShadow: 'none', bg: '#f1f1f1' }}
                maxLength={200}
              />
              <Flex justifyContent='flex-end' width='100%'>
                <Text color='#aaaaaa'>{postText.length}/200</Text>
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter bg={'white'}>
            <Button
              bg={'#a83232'}
              color={'white'}
              _hover={{
                bg: '#8f2727',
              }}
              mr={3}
              onClick={onClose}
              borderRadius="full"
              width="48%"
            >
              Cancel
            </Button>
            <Button
              bg={'#48639D'}
              color={'white'}
              _hover={{
                bg: '#3E5377',
              }}
              onClick={handleCreatePost}
              isLoading={isCreatePostLoading}
              borderRadius="full"
              width="48%"
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

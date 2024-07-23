import React, { useRef, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
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
  CloseButton,
  Flex,
  FormControl,
  useToast,
} from '@chakra-ui/react';
import usePreviewImage from '../hooks/usePreviewImage';
import { BsFileImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import postsAtom from '../atoms/postsAtom.js';
import { useLocation, useParams } from 'react-router-dom';

import { gql, useMutation } from "@apollo/client";
import { Create_Post } from "../apollo/mutations.js";


const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState('');
  const postMediaRef = useRef();
  const { handleImageChange, previewImage, setPreviewImage } = usePreviewImage();
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  const [isCreatePostLoading, setIsCreatePostLoading] = useState();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const { pathname } = useLocation();
  const CREATE_POST = gql` ${Create_Post}`;
  const [CREATE_POST_COMMAND] = useMutation(CREATE_POST);
  const [file, setFile] = useState()

  const UPLOAD_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImagesChange = (e) => {
    setFile(e.target.files[0])
    handleImageChange(e)
  };
  const handleCreatePost = async () => {

    try {
      setIsCreatePostLoading(true);
      //upload image
      
      const formData = new FormData();
      formData.append('file', file);
      console.log(' File: ',file)
      const user_ = (localStorage.getItem('user') != 'undefined') ? JSON.parse(localStorage.getItem('user')) : null;
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Authorization': user_?.loginUser.jwtToken ? `Bearer ${user_.loginUser.jwtToken}` : "", 
        },
        body: formData,
      });      
      const data = await res.json();
      console.log(' upload response data : ',data)
      // Create Post
      const response = await CREATE_POST_COMMAND({ variables:{text: postText, imgUrl: data.url}})
      if(response?.data){ 
        setIsCreatePostLoading(false);
      }
      if (username === user.username || pathname === '/') {
        //let data_ = response?data?.createPost
        setPosts([response?.data?.createPost, ...posts]);
      }
      onClose();
      setPostText('');
      setPreviewImage('');
    } catch (error) {
      console.log(' create post : ',error)
    }

  };

  return (
    <div>
      <Button
        position={'fixed'}
        bottom={10}
        right={10}
        bg={useColorModeValue('gray.300', 'gray.dark')}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* iss.song need to add rich editor & video viewer, also need to remake video button */}
            <FormControl>
              <Textarea
                placeholder='Write your post details here'
                onChange={handleTextChange}
                value={postText}
                maxLength={500}
              />
              <Text size={'xs'} color={'gray.800'} textAlign={'right'} fontWeight={'bold'} m={1}>
                {postText.length}/500
              </Text>
              {/* <Input type='file' hidden ref={postMediaRef} onChange={handleImageChange} /> */}
              <Input filename={file}  type='file' hidden ref={postMediaRef} onChange={handleImagesChange} />

              <BsFileImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => postMediaRef.current.click()}
              />

              {previewImage && (
                <Flex m={'5px'} w={'full'} position={'relative'}>
                  <img src={previewImage} />
                  <CloseButton onClick={() => setPreviewImage('')} position={'absolute'} top={2} right={2} />
                </Flex>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={2} onClick={handleCreatePost} isLoading={isCreatePostLoading}>
              {/* iss.song AT ONCLICK, noting than you must add something popup */}
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreatePost;

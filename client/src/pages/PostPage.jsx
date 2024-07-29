import React, { useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useDisclosure, Link as ChakraLink } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import getUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetPost } from "../apollo/queries.js";
import { DeletePost } from "../apollo/mutations.js";

const GET_POST = gql`
  ${GetPost}
`;

function PostPage() {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts.find(p => p._id === postId);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile(currentUser?._id);
  const DELETE_POST = gql` ${DeletePost}`;
  const [DELETE_POST_COMMAND] = useMutation(DELETE_POST);

  if (!user && isLoading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );
  }

  if (!currentPost) return <Text>No post found.</Text>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await DELETE_POST_COMMAND({ variables: { postId: currentPost._id } });
      if (response?.data?.deletePost) {
        showToast('Success', 'Post deleted successfully', 'success');
        navigate('/');
      } else if (response.errors) {
        showToast('Error', response.errors[0].message, 'error');
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };

  const handleHashtagClick = (hashtag) => {
    console.log(`Hashtag clicked: ${hashtag}`);
  };

  return (
    <>
      <Flex gap={3} mb={4} pt={5} pb={2}>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex w={'full'} justifyContent={'space-between'}>
            <Flex alignItems={'center'}>
              <Avatar size={'md'} name={user.name} src={user.profilePic} mr={2} />
              <Text fontSize={'sm'} fontWeight={'bold'}>{user.username}</Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                {formatDistanceToNowStrict(new Date(currentPost.createdAt))}
              </Text>
              {currentUser?.loginUser._id === currentPost.postedBy && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{currentPost.text}</Text>
          {currentPost.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image src={currentPost.img} w={'full'} onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}
          {currentPost.video && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <video controls src={currentPost.video} w={'full'} onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}
          <Flex justifyContent={'flex-start'} flexWrap='wrap'>
            <Text fontSize={'sm'}>
              <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test1')}>#test1</ChakraLink>{' '}
              <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test2')}>#test2</ChakraLink>
            </Text>
          </Flex>
          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={currentPost} />
          </Flex>
        </Flex>
      </Flex>
      <Divider my={4} />
      {currentPost.replies?.map((reply) => (
        <Comment key={reply._id} reply={reply} isLastReply={currentPost.replies[currentPost.replies.length - 1] === reply} />
      ))}
    </>
  );
}

export default PostPage;

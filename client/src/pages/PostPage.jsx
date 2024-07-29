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
import { GetPostsByHashtag } from "../apollo/queries.js";

const GET_POSTS_BY_HASHTAG= gql`
  ${GetPostsByHashtag}
`;

const GET_POST = gql`
  ${GetPost}
`;

const DELETE_POST = gql`
  ${DeletePost}
`;

function PostPage() {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts.find(p => p._id === postId);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile(currentUser?._id);

  const [DELETE_POST_COMMAND] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      cache.modify({
        fields: {
          getFeedPosts(existingPosts = [], { readField }) {
            return existingPosts.filter(postRef => readField('_id', postRef) !== postId);
          }
        }
      });
    },
    onCompleted: () => {
      setPosts(posts.filter(p => p._id !== postId));
      showToast('Success', 'Post deleted successfully', 'success');
      navigate('/');
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
    }
  });

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
      await DELETE_POST_COMMAND({ variables: { postId: currentPost._id } });
    } catch (error) {
      console.error('Delete post error:', error);
    }
  };

  const handleHashtagClick = (hashtag) => {
    const { loading, error, data } = useQuery(GET_POSTS_BY_HASHTAG, {
      variables: { hashtag: hashtag, skip: 0, limit :10 },
      onCompleted: (result) => {
        setPosts(result?.getPostsByHashTag);
        navigate('/');
      },
      onError: (error) => {
        console.error('getPostsByHashTag error:', error, ' post:', post);
      },
      fetchPolicy: "network-only",
    });
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
              {currentUser?.loginUser?._id === currentPost.postedBy && (
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
            {currentPost.hashtags?.map((tag) => (
            <ChakraLink color="blue.500" onClick={() => handleHashtagClick(tag)}>tag</ChakraLink>
          ))}
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

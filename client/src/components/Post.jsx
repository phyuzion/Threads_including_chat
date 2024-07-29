import React, { useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Flex, Image, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { gql, useMutation, useQuery } from "@apollo/client";
import { DeletePost } from "../apollo/mutations.js";
import { GetUserProfile } from "../apollo/queries.js";

const GET_USER_PROFILE = gql`
  ${GetUserProfile}
`;

function Post({ post }) {
  const [postedByUser, setPostedByUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const DELETE_POST = gql` ${DeletePost}`;

  const { loading, error, data } = useQuery(GET_USER_PROFILE, {
    variables: { postedBy: post.postedBy },
    onCompleted: (result) => {
      setPostedByUser(result?.getUserProfile);
    },
    onError: (error) => {
      console.error('getUserProfile error:', error, ' post:', post);
    },
    fetchPolicy: "network-only",
  });

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    useMutation(DELETE_POST, {
      variables: { postId: post._id },
      onCompleted: () => {
        showToast('Success', `Post deleted: ${post._id}`, 'success');
      },
      onError: (error) => {
        showToast('Error', error.message, 'error');
      }
    });
  };

  const handleHashtagClick = (hashtag) => {
    console.log(`Hashtag clicked: ${hashtag}`);
  };

  return (
    <Flex gap={3} mb={4} pt={5} pb={2}>
      <Flex flexDirection={'column'} alignItems={'center'}>
        <Link to={`/${postedByUser?.username}`}>
          <Avatar size={'md'} name={postedByUser?.name} src={postedByUser?.profilePic} />
        </Link>
        <Box w='1px' h={'full'} bg={'gray.light'} my={2}></Box>
      </Flex>
      <Flex flex={1} flexDirection={'column'} gap={2}>
        <Flex justifyContent={'space-between'}>
          <Link to={`/${postedByUser?.username}`}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {postedByUser?.username}
              </Text>
              <Image src='verified.png' w={4} h={4} ml={1} />
            </Flex>
          </Link>
          <Flex alignItems={'center'}>
            <Text fontSize={'sm'} color={'gray.light'}>
              {formatDistanceToNowStrict(new Date(post.createdAt))}
            </Text>
            {currentUser?._id === post.postedBy && (
              <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
            )}
          </Flex>
        </Flex>
        <Link to={`/${postedByUser?.username}/post/${post._id}`}>
          <Text fontSize={'sm'}>{post.text}</Text>
          {post.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image src={post.img} w={'full'} onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}
          {post.video && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <video controls src={post.video} width="100%" onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}
        </Link>
        <Box>
          <Text fontSize={'sm'} flexWrap='wrap'>
            <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test1')}>#test1</ChakraLink>{' '}
            <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test2')}>#test2</ChakraLink>
          </Text>
        </Box>
        <Flex gap={3} my={1} alignItems={'center'}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Post;

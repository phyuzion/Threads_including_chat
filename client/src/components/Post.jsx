import React, { useState } from 'react';
import { Avatar, Box, Flex, Image, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import Actions from './Actions';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { gql, useQuery } from "@apollo/client";
import { GetUserProfile } from "../apollo/queries.js";
import { DeleteIcon } from '@chakra-ui/icons';
import useHashtagSearch from '../hooks/useHashtagSearch';

const GET_USER_PROFILE = gql`
  ${GetUserProfile}
`;

function Post({ post, user: propUser, handleDelete }) {
  const [postedByUser, setPostedByUser] = useState(propUser || null);
  const currentUser = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { searchHashtag } = useHashtagSearch();

  useQuery(GET_USER_PROFILE, {
    variables: { postedBy: post.postedBy },
    skip: !!propUser, // if propUser exist.. skip
    onCompleted: (result) => {
      setPostedByUser(result?.getUserProfile);
    },
    onError: (error) => {
      console.error('getUserProfile error:', error, ' post:', post);
    },
    fetchPolicy: "network-only",
  });

  if (!postedByUser) {
    return null;
  }

  return (
    <Box pb={3}>
    <Flex gap={3} mb={0} pt={5} pb={0}>
      <Flex flexDirection={'column'} alignItems={'center'}>
        <Link to={`/${postedByUser.username}`}>
          <Avatar size={'md'} name={postedByUser.name} src={postedByUser.profilePic} />
        </Link>
        <Box w='1px' h={'full'} bg={'gray.500'} my={2}></Box>
      </Flex>
      <Flex flex={1} flexDirection={'column'} gap={2}>
        <Flex justifyContent={'space-between'}>
          <Link to={`/${postedByUser.username}`}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {postedByUser.username}
              </Text>
            </Flex>
          </Link>
          <Flex alignItems={'center'}>
            <Text fontSize={'sm'} color={'gray.500'}>
              {formatDistanceToNowStrict(new Date(post.createdAt))}
            </Text>
            {handleDelete && (
              <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
            )}
          </Flex>
        </Flex>
        <Link to={`/${postedByUser.username}/post/${post._id}`}>
          <Text fontSize={'sm'}>{post.text}</Text>
          {!imgLoaded && post.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image 
                src={post.img} 
                w={'full'} 
                onLoad={() => setImgLoaded(true)} 
                onError={() => setImgLoaded(false)}
                style={{ display: 'none' }}
              />
            </Box>
          )}
          {imgLoaded && post.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image src={post.img} w={'full'} />
            </Box>
          )}
          {!videoLoaded && post.video && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <video 
                controls 
                src={post.video} 
                width="100%" 
                onCanPlay={() => setVideoLoaded(true)} 
                onError={() => setVideoLoaded(false)}
                style={{ display: 'none' }}
              />
            </Box>
          )}
          {videoLoaded && post.video && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <video controls src={post.video} width="100%" />
            </Box>
          )}
        </Link>
        <Box>
          <Text fontSize={'sm'} flexWrap='wrap'>
            {post.hashtags?.map((tag) => (
              <ChakraLink key={tag} color="blue.500" onClick={() => searchHashtag(tag)}>#{tag}</ChakraLink>
            ))}
          </Text>
        </Box>
        <Flex gap={3} my={1} alignItems={'center'}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>

    {post.replies.length > 0 && (
      <Flex direction="column" alignItems="left" mt={1}>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Flex>
            {post.replies.slice(0, 5).map((reply, index) => (
              <Avatar
                key={index}
                size='xs'
                name={reply.username}
                src={reply.userProfilePic}
                ml={index > 0 ? '1px' : '0'}
              />
            ))}
            {post.replies.length > 5 && (
              <Box
                size='xs'
                ml='1px'
                bg='transparent'
                borderRadius='full'
                display='flex'
                alignItems='center'
                justifyContent='center'
                width='24px'
                height='24px'
              >
                ...
              </Box>
            )}
          </Flex>
          <Flex alignItems={'center'}>
            <Text color={'gray.500'} fontSize='sm'>
              {post.replies.length} replies
            </Text>
            <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'} mx={1}></Box>
            <Text color={'gray.500'} fontSize='sm'>
              {post.likes.length} likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    )}
    </Box>
  );
}

export default Post;

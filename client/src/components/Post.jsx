import React, { useState,useRef } from 'react';
import { Avatar, Box, Flex, Image, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link,useNavigate } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import Actions from './Actions';
import { useRecoilState,useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom.js';
import { gql, useQuery,useLazyQuery } from "@apollo/client";
import { GetUserProfile,GetPostsByHashtag } from "../apollo/queries.js";

const GET_USER_PROFILE = gql`
  ${GetUserProfile}
`;

const GET_POSTS_BY_HASHTAG= gql`
  ${GetPostsByHashtag}
`;

function Post({ post }) {
  const [postedByUser, setPostedByUser] = useState(null);
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const hashRef = useRef("");
  const navigate = useNavigate();
  const hashtagClick = (tag) => {
    console.log('hashtagClick tag: ',tag)
    hashRef.current = tag
    console.log('hashtagClick ref: ',hashRef.current)
    handleHashtagClick()
  }

  const [handleHashtagClick,{loading1, error1, datahashtag} ] = useLazyQuery(GET_POSTS_BY_HASHTAG,{
    variables: { hashtag : hashRef.current , skip: 0 ,  limit :10 },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (datahashtag) => {
      console.log('datahashtag:  ',datahashtag)
      if(datahashtag?.getPostsByHashTag) {
        setPosts(datahashtag?.getPostsByHashTag);
        navigate('/');
      }
    },
    onError: (error) => {
      console.error('getUserProfile error:', error, ' post:', post);
    },

  })




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
          {post.hashtags?.map((tag) => (
            <ChakraLink color="blue.500" onClick={() => hashtagClick(tag)}>#{tag}</ChakraLink>
          ))}            
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

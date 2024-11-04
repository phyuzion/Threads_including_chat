import React, { useState } from 'react';
import { Avatar, Box, Flex, Image, Text, Link as ChakraLink, Tag } from '@chakra-ui/react';
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

const Post = React.forwardRef(({ post, user: propUser, handleDelete }, ref) => {
  const [postedByUser, setPostedByUser] = useState(propUser || null);
  const currentUser = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const { searchHashtag } = useHashtagSearch();

  useQuery(GET_USER_PROFILE, {
    variables: { postedBy: post.postedBy },
    skip: !!propUser,
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
    <Box pb={4} ref={ref} bg="#ffffff" borderRadius="lg" boxShadow="sm" mb={6} p={6}>
      <Flex gap={4} mb={4} pt={2}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Link to={`/${postedByUser.username}`}>
            <Avatar size="lg" name={postedByUser.name} src={postedByUser.profilePic} />
          </Link>
          <Box w="1px" h="full" bg="#d3d3d3" my={2}></Box>
        </Flex>
        <Flex flex={1} flexDirection="column" gap={3}>
          <Flex justifyContent="space-between" alignItems="center">
            <Link to={`/${postedByUser.username}`}>
              <Text fontSize="xl" fontWeight="bold">{postedByUser.username}</Text>
            </Link>
            <Flex alignItems="center">
              <Text fontSize="md" color="#888888">
                {formatDistanceToNowStrict(new Date(post.createdAt))}
              </Text>
              {handleDelete && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor="pointer" fontSize="lg" />
              )}
            </Flex>
          </Flex>
          <Link to={`/${postedByUser.username}/post/${post._id}`}>
            <Text fontSize="lg" mb={2}>{post.text}</Text>
            {!imgLoaded && post.img && (
              <Box borderRadius="lg" overflow="hidden" bg="#f5f5f5">
                <Image 
                  src={post.img} 
                  w="full" 
                  onLoad={() => setImgLoaded(true)} 
                  onError={() => setImgLoaded(false)}
                  display="none"
                />
              </Box>
            )}
            {imgLoaded && post.img && (
              <Box borderRadius="lg" overflow="hidden" border="1px solid #e5e5e5">
                <Image src={post.img} w="full" />
              </Box>
            )}
            {!videoLoaded && post.video && (
              <Box borderRadius="lg" overflow="hidden" bg="#f5f5f5">
                <video 
                  controls 
                  src={post.video} 
                  width="100%" 
                  onCanPlay={() => setVideoLoaded(true)} 
                  onError={() => setVideoLoaded(false)}
                  display="none"
                />
              </Box>
            )}
            {videoLoaded && post.video && (
              <Box borderRadius="lg" overflow="hidden" border="1px solid #e5e5e5">
                <video controls src={post.video} width="100%" />
              </Box>
            )}
          </Link>
          <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
            {post.hashtags?.map((tag) => (
              <Tag
                size="lg"
                key={tag}
                colorScheme="blue"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="md"
                cursor="pointer"
                onClick={() => searchHashtag(tag)}
              >
                #{tag}
              </Tag>
            ))}
          </Box>
          <Flex gap={3} mt={2} mb={1} alignItems="center"> {/* 공백을 줄이기 위해 margin 값 조정 */}
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>

      {post.replies.length > 0 && (
        <Flex direction="column" alignItems="flex-start" mt={4}>
          <Flex justifyContent="space-between" w="full">
            <Flex>
              {post.replies.slice(0, 5).map((reply, index) => (
                <Avatar
                  key={index}
                  size="sm"
                  name={reply.username}
                  src={reply.userProfilePic}
                  ml={index > 0 ? '1px' : '0'}
                />
              ))}
              {post.replies.length > 5 && (
                <Box
                  size="sm"
                  ml="1px"
                  bg="transparent"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="24px"
                  height="24px"
                  fontSize="sm"
                  color="#888888"
                >
                  +{post.replies.length - 5}
                </Box>
              )}
            </Flex>
            <Flex alignItems="center">
              <Text color="#888888" fontSize="sm">
                {post.replies.length} replies
              </Text>
              <Box w={1} h={1} borderRadius="full" bg="#d3d3d3" mx={2}></Box>
              <Text color="#888888" fontSize="sm">
                {post.likes.length} likes
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
});

export default Post;

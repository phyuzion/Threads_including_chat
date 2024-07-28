import { Box, Flex, Link, Text, Avatar, Image } from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Actions from './Actions';

function UserPost({ postTitle, postImg, postVideo, likes, replies }) {
  return (
    <Link to={'/mark/post/1'}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={'column'} alignItems={'center'}>
          <Avatar size={'md'} name={'Mark Zuckerberg'} src='/zuck-avatar.png' />
          <Box w='1px' h={'full'} bg={'gray.light'} my={2}></Box>
        </Flex>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex justifyContent={'space-between'}>
            <Flex w={'full'} alignItems={'center'}>
              <Text fontSize={'sm'} fontWeight={'bold'}>
                markzuck
              </Text>
              <Image src='verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                23hr
              </Text>

              <BsThreeDotsVertical />
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{postTitle}</Text>
          {postImg && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid gray.light'}
            >
              <Image src={postImg} w={'full'} onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}
          {postVideo && (
            <Box
              borderRadius={6}
              overflow={'hidden'}
              border={'1px solid gray.light'}
            >
              <video controls src={postVideo} width="100%" onError={(e) => e.target.style.display = 'none'} />
            </Box>
          )}

          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={{ postTitle, postImg, postVideo, likes, replies }} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;

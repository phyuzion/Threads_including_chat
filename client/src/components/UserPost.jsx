import { Box, Flex, Link as ChakraLink, Text, Avatar, Image } from '@chakra-ui/react';
import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Actions from './Actions';

function UserPost({ postTitle, postImg, postVideo, likes, replies }) {
  const handleHashtagClick = (hashtag) => {
    console.log(`Hashtag clicked: ${hashtag}`);
  };

  return (
    <Link to={'/mark/post/1'}>
      <Flex gap={3} mb={4} pt={5} pb={2}>
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
          <Flex justifyContent={'flex-start'} flexWrap='wrap'>
            <Text fontSize={'sm'}>
              <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test1')}>#test1</ChakraLink>{' '}
              <ChakraLink color="blue.500" onClick={() => handleHashtagClick('#test2')}>#test2</ChakraLink>
            </Text>
          </Flex>
          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={{ postTitle, postImg, postVideo, likes, replies }} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;

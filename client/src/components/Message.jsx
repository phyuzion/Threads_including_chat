import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All, BsQuestion } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

const Message = ({ message, otherUser }) => {
  const currentUser = useRecoilValue(userAtom);
  const [imgLoaded, setImageLoaded] = useState(false);

  const isCurrentUser = currentUser?.loginUser?._id === message.sender;

  return (
    <Flex
      direction="column"
      alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
      m={2}
      maxW="70%"
    >
      {/* 메시지 정보 */}
      <Flex alignItems="center" justifyContent="space-between" mb={1}>
        <Flex alignItems="center" gap={2}>
          <Avatar size="xs" src={isCurrentUser ? currentUser?.loginUser?.profilePic : otherUser?.profilePic} />
          <Text fontSize="xs" fontWeight="bold" color="#333333">
            {isCurrentUser ? currentUser?.loginUser.username : otherUser?.username}
          </Text>
        </Flex>
        {isCurrentUser && (
          <Box color={message?.seen ? '#48639D' : '#CCCCCC'}>
            {message?.seen ? <BsCheck2All size={14} /> : <BsQuestion size={14} />}
          </Box>
        )}
      </Flex>

      {/* 메시지 본문 */}
      <Flex
        direction="column"
        bg={isCurrentUser ? '#48639D' : '#F1F1F1'}
        borderRadius="lg"
        p={3}
        maxW="100%"
        boxShadow="sm"
      >
        {message.text && (
          <Text color={isCurrentUser ? 'white' : '#333333'}>{message.text}</Text>
        )}
        
        {/* 이미지가 로드되기 전까지 Skeleton을 표시하고, 로드되면 NavLink로 이미지 표시 */}
        {message.img && !imgLoaded && (
          <Flex w="200px" mt={2}>
            <Image
              src={message.img}
              hidden
              onLoad={() => setImageLoaded(true)}
              alt="Message Media"
              borderRadius="md"
            />
            <Skeleton w="200px" h="200px" borderRadius="md" />
          </Flex>
        )}
        {message.img && imgLoaded && (
          <NavLink target="_blank" to={message.img}>
            <Flex w="200px" mt={2}>
              <Image src={message.img} alt="Message Media" borderRadius="md" />
            </Flex>
          </NavLink>
        )}
      </Flex>
    </Flex>
  );
};

export default Message;

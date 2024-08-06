import { Avatar, Box, Flex, Image, Skeleton, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

const Message = ({ message }) => {
  const currentConversation = useRecoilValue(currentConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const [imgLoaded, setImageLoaded] = useState(false);

  const isCurrentUser = currentUser._id === message.sender;

  return (
    <Flex
      direction={'column'}
      alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
      m={1}
      maxW={'80%'}
    >
      <Flex alignItems={'center'} gap={2} mb={1}>
        <Avatar size={'xs'} src={isCurrentUser ? currentUser.profilePic : currentConversation.userProfilePic} />
        <Text fontSize={'xs'} fontWeight={700}>
          {isCurrentUser ? currentUser.username : currentConversation.username}
        </Text>
      </Flex>
      <Flex
        direction={'column'}
        bg={isCurrentUser ? 'green.800' : 'gray.500'}
        borderRadius={'md'}
        p={2}
      >
        {message.text && (
          <Text color={'white'}>{message.text}</Text>
        )}
        {message.img && !imgLoaded && (
          <Flex w={'200px'} mt={2}>
            <Image
              src={message.img}
              hidden
              onLoad={() => setImageLoaded(true)}
              alt='Message Media'
              borderRadius={4}
            />
            <Skeleton w={'200px'} h={'200px'} borderRadius={4} />
          </Flex>
        )}
        {message.img && imgLoaded && (
          <NavLink target={'_blank'} to={message?.img}>
            <Flex w={'200px'} mt={2}>
              <Image src={message.img} alt='Message Media' borderRadius={4} />
            </Flex>
          </NavLink>
        )}
        {isCurrentUser && (
          <Box alignSelf={'flex-end'} ml={1} color={message?.seen ? 'blue.400' : ''}>
            <BsCheck2All size={12} />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Message;

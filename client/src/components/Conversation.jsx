import {
  Avatar,
  AvatarBadge,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import { BsFillImageFill } from 'react-icons/bs';

const Conversation = ({ conversation, isOnline, onClick }) => {
  const otherUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  return (
    <Flex
      gap={3}
      alignItems="center"
      p={3}
      onClick={onClick}
      borderRadius="md"
      _hover={{ bg: "#F5F5F5" }}
      cursor="pointer"
    >
      <Avatar
        src={otherUser.profilePic}
        size="md"
      >
        {isOnline && <AvatarBadge bg="#28A745" boxSize="1em" />}
      </Avatar>
      <Stack spacing={1}>
        <Text fontWeight="bold" color="#333333">
          {otherUser.username}
        </Text>
        <Text fontSize="sm" color="#666666" display="flex" alignItems="center" gap={1}>
          {lastMessage?.text
            ? lastMessage.text.length > 20
              ? lastMessage.text.substring(0, 20) + '...'
              : lastMessage.text
            : lastMessage?.sender && (
                <>
                  <BsFillImageFill size={14} color="#888888" />
                  <Text as="span" color="#888888">Sent A Photo</Text>
                </>
              )}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

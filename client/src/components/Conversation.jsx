import {
  Avatar,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';

const Conversation = ({ conversation, isOnline, onClick }) => {
  const otherUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  return (
    <Flex
      gap={3}
      alignItems={'center'}
      p={1}
      onClick={onClick}
    >
      <Avatar
        src={otherUser.profilePic}
        size={{
          base: 'xs',
          sm: 'sm',
          md: 'md',
        }}
      >
        {isOnline && <AvatarBadge bg={'green.500'} boxSize={'1em'} />}
      </Avatar>
      <Stack direction={'column'} fontSize={'sm'}>
        <Text fontWeight={700} display={'flex'} alignItems={'center'} gap={1}>
          {otherUser.username}
        </Text>
        <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
          {lastMessage.text
          ? lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + '...'
            : lastMessage.text
          : lastMessage.sender && (
              <>
                <BsFillImageFill size={12} />
                Sent A Photo
              </>
            )}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;

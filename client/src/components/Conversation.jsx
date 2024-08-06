import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { BsCheck2All, BsFillImageFill, BsFolder } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import userAtom from '../atoms/userAtom';

const Conversation = ({ conversation, isOnline }) => {
  const otherUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  const currentUser = useRecoilValue(userAtom);
  const [currentConversation, setCurrentConversation] = useRecoilState(currentConversationAtom);
  const colorMode = useColorMode();

  return (
    <Flex
      gap={3}
      alignItems={'center'}
      p={1}
      onClick={() =>
        setCurrentConversation({
          _id: conversation._id,
          mock: conversation.mock,
          userId: otherUser._id,
          username: otherUser.username,
          userProfilePic: otherUser.profilePic,
        })
      }
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

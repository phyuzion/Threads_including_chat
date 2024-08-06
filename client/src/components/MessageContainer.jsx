import {
  Avatar,
  Divider,
  Flex,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentConversationAtom } from '../atoms/convAtoms';
import useShowToast from '../hooks/useShowToast';
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '../context/SocketContext';
import userAtom from '../atoms/userAtom';
import messageNotificationSound from '../assets/sounds/message.mp3';
import { gql, useLazyQuery } from '@apollo/client';
import { GetMessages } from '../apollo/queries';
import { ArrowBackIcon } from '@chakra-ui/icons';

const GET_MESSAGES = gql`
  ${GetMessages}
`;

const MessageContainer = () => {
  const currentConversation = useRecoilValue(currentConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const setCurrentConversation = useSetRecoilState(currentConversationAtom);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  const isOnline = onlineUsers?.includes(currentConversation.userId);

  const latestMessageRef = useRef(null);

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      console.log('MessageContainer newMessage: ', newMessage);
      setMessages((prevMessages) => {
        return [...prevMessages, newMessage];
      });

      if (!document.hasFocus()) {
        const sound = new Audio(messageNotificationSound);
        sound.play();
      }
    });

    return () => socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    const lastMessageFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== currentUser._id;

    if (lastMessageFromOtherUser) {
      socket.emit('markMessagesAsSeen', {
        conversationId: currentConversation._id,
        userId: currentConversation.userId,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      console.log('MessageContainer messagesSeen');
      if (conversationId === currentConversation._id) {
        setMessages((prevMessages) => {
          return prevMessages.map((message) => {
            if (message?.sender === currentUser._id) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
        });
      }
    });
  }, [socket, currentUser._id, messages, currentConversation]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [queryMessages, { loading, error, data }] = useLazyQuery(GET_MESSAGES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getMessages) {
        setMessages(data?.getMessages);
      }
    },
    onError: (error) => {
      showToast('Error', error, 'error');
    },
  });

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (currentConversation.mock) return;
        queryMessages({ variables: { otherUserId: currentConversation.userId } });
      } catch (err) {
        console.log(err);
        showToast('Error', err.message, 'error');
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, currentConversation._id, currentConversation.mock]);

  // for chat message's unique key. ( will tell to Sujith for set right unique key)
  let keyNumber = 0;

  return (
    <Flex
      flex={70}
      bg={useColorModeValue('gray.200', 'gray.dark')}
      borderRadius={'md'}
      p={2}
      direction={'column'}
      height="90vh"
    >
      {/* Header */}
      <Flex
        alignItems={'center'}
        p={2}
        gap={2}
        w={'full'}
        position="sticky"
        top={0}
        bg={useColorModeValue('gray.200', 'gray.dark')}
        zIndex={1}
      >
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => {
            setCurrentConversation({});
            navigate('/chat');
          }}
        />
        <Avatar
          src={currentConversation.userProfilePic}
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
        />
        <Stack gap={1}>
          <Text fontWeight={700} display={'flex'} alignItems={'center'} gap={1}>
            {currentConversation.username}
          </Text>
          {isOnline ? (
            <Text fontWeight={400} fontSize={'xs'} color={'green.400'}>
              Online
            </Text>
          ) : (
            <Text fontWeight={400} fontSize={'xs'} color={'gray'}>
              Offline
            </Text>
          )}
        </Stack>
      </Flex>
      <Divider />

      {/* Body */}
      <Flex
        flexDirection={'column'}
        gap={2}
        overflowY={'auto'}
        flex={1}
        my={4}
        p={1}
      >
        {loadingMessages
          ? [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={'center'}
                p={1}
                borderRadius={'md'}
                alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
              >
                {i % 2 === 0 && <SkeletonCircle size={7} />}
                <Flex flexDir={'column'} gap={2}>
                  <Skeleton h='8px' w='250px' />
                  <Skeleton h='8px' w='250px' />
                  <Skeleton h='8px' w='250px' />
                </Flex>
                {i % 2 !== 0 && <SkeletonCircle size={7} />}
              </Flex>
            ))
          : messages?.map((message) => {
              keyNumber++; // for unique key
              return (
                <Flex
                  key={keyNumber}  // added unique key prop
                  direction={'column'}
                  ref={messages?.length - 1 === messages?.indexOf(message) ? latestMessageRef : null}
                >
                  <Message message={message} />
                </Flex>
              );
            })}
      </Flex>

      {/* Footer */}
      <Flex
        position="sticky"
        bottom={0}
        bg={useColorModeValue('gray.200', 'gray.dark')}
        zIndex={1}
        width="100%"
      >
        <MessageInput setMessages={setMessages} />
      </Flex>
    </Flex>
  );
};

export default MessageContainer;

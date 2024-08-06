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
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useShowToast from '../hooks/useShowToast';
import Message from './Message';
import MessageInput from './MessageInput';
import { useSocket } from '../context/SocketContext';
import userAtom from '../atoms/userAtom';
import messageNotificationSound from '../assets/sounds/message.mp3';
import { gql, useLazyQuery } from '@apollo/client';
import { GetMessages } from '../apollo/queries';
import { ArrowBackIcon } from '@chakra-ui/icons';
import getUserProfile from '../hooks/useGetUserProfile';

const GET_MESSAGES = gql`
  ${GetMessages}
`;

const MessageContainer = () => {
  const { username } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  const { user: otherUser, isLoading: loadingUser } = getUserProfile();

  const isOnline = onlineUsers?.includes(otherUser?._id);

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
        conversationId: messages[0]?.conversationId,
        userId: otherUser?._id,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      console.log('MessageContainer messagesSeen');
      if (conversationId === messages[0]?.conversationId) {
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
  }, [socket, currentUser._id, messages, otherUser]);

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
      setLoadingMessages(false);
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
      setLoadingMessages(false);
    },
  });

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (otherUser) {
          queryMessages({ variables: { otherUserId: otherUser._id } });
        }
      } catch (err) {
        console.log(err);
        showToast('Error', err.message, 'error');
      }
    };

    if (otherUser) {
      getMessages();
    }
  }, [showToast, otherUser]);

  if (loadingUser) {
    return (
      <Flex
        flex={70}
        bg={useColorModeValue('gray.200', 'gray.dark')}
        borderRadius={'md'}
        p={2}
        direction={'column'}
        height="90vh"
        justifyContent="center"
        alignItems="center"
      >
        <Text>Loading user profile...</Text>
      </Flex>
    );
  }

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
          onClick={() => navigate('/chat')}
        />
        <Avatar
          src={otherUser?.profilePic}
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
        />
        <Stack gap={1}>
          <Text fontWeight={700} display={'flex'} alignItems={'center'} gap={1}>
            {otherUser?.username}
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
          : messages.map((message, index) => (
              <Flex
                key={index}
                direction={'column'}
                ref={messages.length - 1 === index ? latestMessageRef : null}
              >
                <Message message={message} otherUser={otherUser} />
              </Flex>
            ))}
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

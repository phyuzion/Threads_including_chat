import {
  Avatar,
  Divider,
  Flex,
  IconButton,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Box,
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      if (!document.hasFocus()) {
        const sound = new Audio(messageNotificationSound);
        sound.play();
      }
    });

    return () => socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].sender !== currentUser._id) {
      socket.emit('markMessagesAsSeen', {
        conversationId: messages[0]?.conversationId,
        userId: otherUser?._id,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      if (conversationId === messages[0]?.conversationId) {
        setMessages((prevMessages) =>
          prevMessages.map((message) => (message.sender === currentUser._id ? { ...message, seen: true } : message))
        );
      }
    });
  }, [socket, currentUser._id, messages, otherUser]);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const [queryMessages, { loading }] = useLazyQuery(GET_MESSAGES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getMessages?.length === 0) {
        showToast({
          title: 'Start new chat',
          description: 'Starting a new chat with this user.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        setMessages(data.getMessages);
      }
      setLoadingMessages(false);
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
      setLoadingMessages(false);
    },
  });

  useEffect(() => {
    if (otherUser) {
      setLoadingMessages(true);
      setMessages([]);
      queryMessages({ variables: { otherUserId: otherUser._id } });
    }
  }, [showToast, otherUser]);

  if (loadingUser) {
    return (
      <Flex
        flex={70}
        bg="#FFFFFF"
        borderRadius="md"
        p={4}
        direction="column"
        height="90vh"
        justifyContent="center"
        alignItems="center"
      >
        <Text color="#333333">Loading user profile...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      flex={70}
      bg="#FFFFFF"
      borderRadius="md"
      p={4}
      direction="column"
      height="85vh"
    >
      {/* Header */}
      <Flex alignItems="center" p={4} bg="#F5F5F5" borderRadius="md">
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/chat')}
          bg="#FFFFFF"
          color="#333333"
          _hover={{ bg: '#E0E0E0' }}
          _active={{ bg: '#CCCCCC' }}
          border="1px solid #CCCCCC"
          size="md"
          borderRadius="full"
          mr={3}
        />
        <Avatar src={otherUser?.profilePic} size="md" />
        <Stack spacing={0} ml={3}>
          <Text fontWeight="bold" color="#333333">
            {otherUser?.username}
          </Text>
          <Text fontSize="sm" color={isOnline ? '#28A745' : '#888888'}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </Stack>
      </Flex>

      <Divider my={4} />

      {/* Body */}
      <Box flex="1" overflowY="auto" p={4}>
        {loadingMessages
          ? Array(5)
              .fill()
              .map((_, i) => (
                <Flex
                  key={i}
                  gap={2}
                  alignItems="center"
                  py={2}
                >
                  {i % 2 === 0 && <SkeletonCircle size={8} />}
                  <Flex direction="column" gap={2}>
                    <Skeleton h="8px" w="200px" />
                    <Skeleton h="8px" w="200px" />
                  </Flex>
                  {i % 2 !== 0 && <SkeletonCircle size={8} />}
                </Flex>
              ))
          : messages.map((message, index) => (
              <Flex
                key={index}
                direction="column"
                alignSelf={message.sender === currentUser._id ? 'flex-end' : 'flex-start'}
                ref={messages.length - 1 === index ? latestMessageRef : null}
              >
                <Message message={message} otherUser={otherUser} />
              </Flex>
            ))}
      </Box>

      {/* Footer */}
      <Flex mt={2} borderTop="1px solid #E0E0E0">
        <MessageInput setMessages={setMessages} otherUser={otherUser} />
      </Flex>
    </Flex>
  );
};

export default MessageContainer;

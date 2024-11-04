import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BsSearchHeartFill } from 'react-icons/bs';
import Conversation from '../components/Conversation';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import { gql, useLazyQuery } from '@apollo/client';
import { GetProfileByName, GetConversations } from '../apollo/queries';
import { useNavigate } from 'react-router-dom';

const GET_USER_PROFILE_BY_NAME = gql`
  ${GetProfileByName}
`;
const GET_CONVERSATIONS = gql`
  ${GetConversations}
`;

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchingConversation, setSearchingConversation] = useState(false);

  const currentUser = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      setConversations((prevConversations) => {
        const updatedConversation = prevConversations.map((conversation) => {
          if (newMessage.conversationId === conversation._id) {
            return {
              ...conversation,
              lastMessage: { text: newMessage.text, sender: newMessage.sender, seen: newMessage.seen, img: newMessage.img },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });

    socket?.on('messagesSeen', ({ conversationId }) => {
      setConversations((prevConversations) => {
        const updatedConversation = prevConversations.map((conversation) => {
          if (conversationId === conversation._id) {
            return {
              ...conversation,
              lastMessage: { ...conversation.lastMessage, seen: true },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });
    return () => {
      socket?.off('newMessage');
      socket?.off('messagesSeen');
    };
  }, [socket]);

  const [queryConversations, { loading, error, data }] = useLazyQuery(GET_CONVERSATIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getConversations) {
        setConversations(data?.getConversations);
      }
      setLoadingConversations(false);
    },
    onError: (error) => {
      setLoadingConversations(false);
    },
  });

  const [handleSearch, { loading: loadingSearch }] = useLazyQuery(GET_USER_PROFILE_BY_NAME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getProfileByName?._id.toString() === currentUser?.loginUser?._id) {
        toast({
          title: 'You cannot chat with yourself.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        setSearchText('');
        setSearchingConversation(false);
        return;
      }
      navigate(`/chat/${data?.getProfileByName.username}`);
    },
    onError: () => setSearchingConversation(false),
  });

  useEffect(() => {
    queryConversations();
  }, []);

  const handleConversationSearch = (e) => {
    e.preventDefault();
    setSearchingConversation(true);
    handleSearch({ variables: { username: searchText } });
  };

  return (
    <Box position="relative" p={4} maxW="lg" mx="auto">
      <Flex direction="column" gap={4} mt={6}>
        
        <form onSubmit={handleConversationSearch}>
          <Flex alignItems="center" gap={2}>
            <Input
              placeholder="Search for a user..."
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              borderColor="gray.300"
              _placeholder={{ color: 'gray.500' }}
              _focus={{ borderColor: 'blue.400' }}
            />
            <Button
              size="md"
              type="submit"
              isLoading={searchingConversation}
              bg="blue.400"
              color="white"
              _hover={{ bg: 'blue.500' }}
              borderRadius="md"
            >
              <BsSearchHeartFill />
            </Button>
          </Flex>
        </form>
        {loadingConversations
          ? Array(5)
              .fill()
              .map((_, i) => (
                <Flex key={i} gap={4} alignItems="center" p={2} borderRadius="md">
                  <SkeletonCircle size="10" />
                  <Flex w="full" flexDirection="column" gap={2}>
                    <Skeleton h="10px" w="60%" />
                    <Skeleton h="8px" w="80%" />
                  </Flex>
                </Flex>
              ))
          : conversations.map((conversation) => (
              <Conversation
                isOnline={onlineUsers?.includes(conversation?.participants[0]?._id)}
                key={conversation._id}
                conversation={conversation}
                onClick={() => navigate(`/chat/${conversation.participants[0].username}`)}
              />
            ))}
      </Flex>
    </Box>
  );
};

export default ChatPage;

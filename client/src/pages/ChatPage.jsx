import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
  useToast
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
              lastMessage: { text: newMessage.text, sender: newMessage.sender, seen: newMessage.seen },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });

    socket?.on('messagesSeen', ({ conversationId }) => {
      console.log(conversationId);
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
      console.log('Chat Page: queryConversations ', data?.getConversations);
      if (data?.getConversations) {
        setConversations(data?.getConversations);
      }
      setLoadingConversations(false);
    },
    onError: (error) => {
      console.log(error);
      setLoadingConversations(false);
    },
  });

  const [handleSearch, { loading: loadingSearch, data: searchData }] = useLazyQuery(GET_USER_PROFILE_BY_NAME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('handleSearch data: ', data);
      if (data?.getProfileByName?._id.toString() === currentUser?.loginUser?._id) {
        toast({
          title: "You cannot chat with yourself.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setSearchText(''); // Clear the search input
        setSearchingConversation(false);
        return;
      }
      const searchedUser = data?.getProfileByName;
      navigate(`/chat/${searchedUser.username}`);
    },
    onError: (error) => {
      console.error('handleSearch error:', error);
      setSearchingConversation(false);
    },
  });

  useEffect(() => {
    queryConversations();
  }, []);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    console.log('handleConversationSearch');
    setSearchingConversation(true);
    try {
      handleSearch({ variables: { username: searchText } });
    } catch (error) {
      console.log(error);
      setSearchingConversation(false);
    }
  };

  return (
    <Box position="relative">
      <Flex direction={'column'} gap={[2, 3, 4]} mt={[4, 6, 8]}>
        <Text fontWeight={700} color={useColorModeValue('grey.600', 'grey.400')}>
          Your Conversations
        </Text>
        <form onSubmit={handleConversationSearch}>
          <Flex alignItems={'center'} gap={2}>
            <Input
              placeholder='Search user to start conversation'
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Button size={'md'} type={'submit'} isLoading={searchingConversation}>
              <BsSearchHeartFill />
            </Button>
          </Flex>
        </form>
        {loadingConversations &&
          [0, 1, 2, 3, 4].map((_, i) => (
            <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
              <Box>
                <SkeletonCircle size={'10'} />
              </Box>
              <Flex w={'full'} flexDirection={'column'} gap={3}>
                <Skeleton h={'10px'} w={'80px'} />
                <Skeleton h={'8px'} w={'90%'} />
              </Flex>
            </Flex>
          ))}
        {!loadingConversations &&
          conversations.map((conversation) => (
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

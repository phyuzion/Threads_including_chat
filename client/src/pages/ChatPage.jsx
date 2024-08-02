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
} from '@chakra-ui/react';
import { BsSearchHeartFill } from 'react-icons/bs';
import Conversation from '../components/Conversation';
import { GiConversation } from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, currentConversationAtom } from '../atoms/convAtoms';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import { gql, useLazyQuery } from '@apollo/client';
import { GetProfileByName } from "../apollo/queries.js";
const GET_USER_PROFILE_BY_NAME = gql`
  ${GetProfileByName}
`;
import { GetConversations } from '../apollo/queries';
const GET_CONVERSATIONS = gql`
  ${GetConversations}
`;


const ChatPage = () => {
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [currentConversation, setCurrentConversation] = useRecoilState(currentConversationAtom);
  const currentUser = useRecoilValue(userAtom);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchingConversation, setSearchingConversation] = useState();

  //const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

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
    return () => socket?.off('newMessage');
  }, [socket]);
  
  const [queryConversations, { loading, error, data }] = useLazyQuery(GET_CONVERSATIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getConversations) {
        setConversations(data?.getConversations);
      }
    },
    onError: (error) => {
      console.log(error)
      //showToast('Error', error, 'error');
    },
  });
  const [handleSearch, { loading_, error_, data_ }] = useLazyQuery(GET_USER_PROFILE_BY_NAME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('handleSearch data: ',data)
      if (data?.getProfileByName?._id.toString() == currentUser._id) {
        //showToast('Error', 'You cannot search for yourself', 'error');
        return;
      }
      const searchedUser = data?.getProfileByName
      if (conversations.find((conversation) => conversation.participants[0]._id === currentUser._id)) {
        setCurrentConversation({
          _id: conversations.find((conversation) => conversation.participants[0]._id === searchedUser._id.toString()),
          userId: searchedUser._id.toString(),
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id.toString(),
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
        lastMessage: {
          text: '',
          sender: '',
        },
      };

      setConversations((prevConv) => {
        return [mockConversation, ...prevConv];
      });      
    },
    onError: (error) => {
      console.error('getPostsByHashTag error:', error);
      //showToast('Error', error.message, 'error');
    },
  });

  useEffect(() => {
    const getConversations = async () => {
      setLoadingConversations(true);
      setCurrentConversation({});
      try {
        console.log('getConversations ')
        queryConversations()
        // const res = await fetch('/api/messages/conversations', {
        //   method: 'GET',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await res.json();
        // if (data.error) {
        //   showToast('Error', data.error, 'error');
        // }

        // setConversations(data);
      } catch (error) {
        console.log('getConversations :',error)
        //showToast('Error', error.message, 'error');
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, []);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    console.log('handleConversationSearch ')
    setSearchingConversation(true);
    try {
      handleSearch({ variables: { username: searchText } });
    } catch (error) {
      console.log(error)
     // showToast('Error', error.message, 'error');
    } finally {
      setSearchingConversation(false);
    }
  };

  return (
    <Box
      position={'absolute'}
      left={'50%'}
      w={{ base: '100%', md: '80%', lg: '950px' }}
      transform={'translateX(-50%)'}
    >
      <Flex direction={{ base: 'column', md: 'row' }} w={{ base: '400px', md: 'full' }} mx={'auto'} gap={4}>
        <Flex direction={'column'} flex={30} gap={2} w={{ sm: '250px', md: 'full' }}>
          <Text fontWeight={700} color={useColorModeValue('grey.600', 'grey.400')}>
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={'center'} gap={2}>
              <Input
                placeholder='Search user to start conversation'
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              ></Input>
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
            conversations?.map((conversation) => (
              <Conversation
                isOnline={onlineUsers?.includes(conversation?.participants[0]?._id)}
                key={conversation._id}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!currentConversation?._id ? (
          <Flex
            flex={70}
            direction={'column'}
            borderRadius={'md'}
            justifyContent={'center'}
            alignItems={'center'}
            p={2}
            height={'400px'}
          >
            <GiConversation size={150} />
            <Text>Select Conversation to start messaging</Text>
          </Flex>
        ) : (
          <MessageContainer />
        )}
      </Flex>
    </Box>
  );
};

export default ChatPage;

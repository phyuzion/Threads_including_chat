import { Box, Button, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { SuggestedUser } from './SuggestedUser';
import { FollowingUser } from './FollowingUser';
import useShowToast from '../hooks/useShowToast';
import { gql, useQuery ,useLazyQuery } from "@apollo/client";
import { GetSuggestedUsers , GetFollows } from "../apollo/queries.js";

const GET_SUGGESTED_USERS = gql`
  ${GetSuggestedUsers}
`;
const GET_FOLLOWS_USERS = gql`
  ${GetFollows}
`;

const SuggestedUsers = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const showToast = useShowToast();

  const [followingUsers , setFollowingUsers] = useState([]);

  const [queryMessages, { loading: loadingUsers, errors, data: followsData }] = useLazyQuery(GET_FOLLOWS_USERS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('getFollows: ', data?.getFollows);
      if (data?.getFollows?.follows) {
        setFollowingUsers(data?.getFollows?.follows);
      }
    },
    onError: (error) => {
      showToast('Error', error, 'error');
    },
  });

  const { loading, error, data, refetch } = useQuery(GET_SUGGESTED_USERS, {
    onCompleted: (data) => {
      console.log('Suggested User: ', data);
      setIsLoading(false);
      queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    },
    onError: (error) => {
      setIsLoading(false);
      showToast('Error', error.message, 'error');
    }
  });

  useEffect(() => {
    if (data) {
      refetch(); // Ensure the list is updated by refetching the data
      queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    }
  }, [data, refetch, queryMessages]);

  const MAX_VISIBLE_USERS = 5;

  const toggleShowMoreSuggested = () => {
    setShowMoreSuggested(!showMoreSuggested);
  };

  const handleFollow = async (userId) => {
    await refetch(); // Ensure the list is updated by refetching the data
    queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    onClose(); // Close the sidebar
    window.location.reload(); // Force reload the page to update UserHeader
  };

  const visibleSuggestedUsers = showMoreSuggested ? data?.getSuggestedUsers : data?.getSuggestedUsers.slice(0, MAX_VISIBLE_USERS);
  console.log('visibleSuggestedUsers: ', visibleSuggestedUsers);

  return (
    <>
      <Text mb={2} fontWeight={'bold'}>
        Following
      </Text>
      <Flex direction={'column'} gap={4}>
        {loadingUsers
          ? [1, 2, 3, 4, 5].map((_, indx) => (
              <Flex key={indx} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                <Box>
                  <SkeletonCircle size={'10'} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={3}>
                  <Skeleton h={'10px'} w={'80px'} />
                  <Skeleton h={'8px'} w={'90%'} />
                </Flex>
              </Flex>
            ))
          : followingUsers.map((user) => (
              <FollowingUser key={user._id} user={user} onClose={onClose} />
            ))}
      </Flex>
      <Box mb={4} /> {/* Placeholder for spacing */}
      <Text mb={2} fontWeight={'bold'}>
        Suggested
      </Text>
      <Flex direction={'column'} gap={4}>
        {isLoading
          ? [1, 2, 3, 4, 5].map((_, indx) => (
              <Flex key={indx} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                <Box>
                  <SkeletonCircle size={'10'} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={3}>
                  <Skeleton h={'10px'} w={'80px'} />
                  <Skeleton h={'8px'} w={'90%'} />
                </Flex>
              </Flex>
            ))
          : visibleSuggestedUsers.map((user) => (
              <SuggestedUser key={user._id} user={user} onFollow={handleFollow} onClose={onClose} />
            ))}
        {!isLoading && data?.getSuggestedUsers.length > MAX_VISIBLE_USERS && (
          <Button onClick={toggleShowMoreSuggested} variant="link" colorScheme="blue">
            {showMoreSuggested ? 'Show Less' : 'More...'}
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SuggestedUsers;

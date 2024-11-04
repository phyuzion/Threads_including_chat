import { Box, Button, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { SuggestedUser } from './SuggestedUser';
import { FollowingUser } from './FollowingUser';
import useShowToast from '../hooks/useShowToast';
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { GetSuggestedUsers, GetFollows } from "../apollo/queries.js";

const GET_SUGGESTED_USERS = gql`${GetSuggestedUsers}`;
const GET_FOLLOWS_USERS = gql`${GetFollows}`;

const SuggestedUsers = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const showToast = useShowToast();

  const [followingUsers, setFollowingUsers] = useState([]);

  const [queryMessages, { loading: loadingUsers, data: followsData }] = useLazyQuery(GET_FOLLOWS_USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => setFollowingUsers(data?.getFollows?.follows || []),
    onError: (error) => showToast('Error', error, 'error'),
  });

  const { loading, error, data, refetch } = useQuery(GET_SUGGESTED_USERS, {
    onCompleted: () => {
      setIsLoading(false);
      queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    },
    onError: (error) => {
      setIsLoading(false);
      showToast('Error', error.message, 'error');
    },
  });

  useEffect(() => {
    if (data) {
      refetch();
      queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    }
  }, [data, refetch, queryMessages]);

  const MAX_VISIBLE_USERS = 5;
  const toggleShowMoreSuggested = () => setShowMoreSuggested(!showMoreSuggested);

  const handleFollow = async (userId) => {
    await refetch();
    queryMessages({ variables: { skip: 0, limit: 10, following: true } });
    onClose();
    window.location.reload();
  };

  const visibleSuggestedUsers = showMoreSuggested ? data?.getSuggestedUsers : data?.getSuggestedUsers.slice(0, MAX_VISIBLE_USERS);

  return (
    <>
      <Text mb={2} fontWeight="bold" color="gray.600">Following</Text>
      <Flex direction="column" gap={3}>
        {loadingUsers
          ? Array(5).fill().map((_, indx) => (
              <Flex key={indx} gap={3} alignItems="center" p={2}>
                <SkeletonCircle size="10" />
                <Flex w="full" direction="column">
                  <Skeleton h="10px" w="80px" />
                  <Skeleton h="8px" w="90%" />
                </Flex>
              </Flex>
            ))
          : followingUsers.map((user) => <FollowingUser key={user._id} user={user} onClose={onClose} />)}
      </Flex>
      <Box mb={4} />
      <Text mb={2} fontWeight="bold" color="gray.600">Suggested</Text>
      <Flex direction="column" gap={3}>
        {isLoading
          ? Array(5).fill().map((_, indx) => (
              <Flex key={indx} gap={3} alignItems="center" p={2}>
                <SkeletonCircle size="10" />
                <Flex w="full" direction="column">
                  <Skeleton h="10px" w="80px" />
                  <Skeleton h="8px" w="90%" />
                </Flex>
              </Flex>
            ))
          : visibleSuggestedUsers.map((user) => (
              <SuggestedUser key={user._id} user={user} onFollow={handleFollow} onClose={onClose} />
            ))}
        {!isLoading && data?.getSuggestedUsers?.length > MAX_VISIBLE_USERS && (
          <Button onClick={toggleShowMoreSuggested} variant="link" colorScheme="blue">
            {showMoreSuggested ? 'Show Less' : 'More...'}
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SuggestedUsers;

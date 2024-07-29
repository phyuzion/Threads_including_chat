import { Box, Button, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { SuggestedUser } from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';
import { gql, useQuery } from "@apollo/client";
import { GetSuggestedUsers } from "../apollo/queries.js";

const GET_SUGGESTED_USERS = gql`
  ${GetSuggestedUsers}
`;

const SuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [showMoreSuggested, setShowMoreSuggested] = useState(false);
  const showToast = useShowToast();
  const { loading, error, data } = useQuery(GET_SUGGESTED_USERS, {
    onCompleted: (data) => {
      setIsLoading(false);
      setSuggestedUsers(data.getSuggestedUsers);
    },
    onError: (error) => {
      setIsLoading(false);
      showToast('Error', error.message, 'error');
    }
  });

  const MAX_VISIBLE_USERS = 5;

  const toggleShowMoreSuggested = () => {
    setShowMoreSuggested(!showMoreSuggested);
  };

  const visibleSuggestedUsers = showMoreSuggested ? suggestedUsers : suggestedUsers.slice(0, MAX_VISIBLE_USERS);

  return (
    <>
      <Text mb={2} fontWeight={'bold'}>
        Following Users
      </Text>
      <Flex direction={'column'} gap={4}>
        {/* Placeholder for Follow Users */}
        {loading
          ? [1, 2, 3, 4, 5].map((_, indx) => {
              return (
                <Flex key={indx} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                  <Box>
                    <SkeletonCircle size={'10'} />
                  </Box>
                  <Flex w={'full'} flexDirection={'column'} gap={3}>
                    <Skeleton h={'10px'} w={'80px'} />
                    <Skeleton h={'8px'} w={'90%'} />
                  </Flex>
                </Flex>
              );
            })
          : null}
      </Flex>
      <Box mb={4} /> {/* Placeholder for spacing */}
      <Text mb={2} fontWeight={'bold'}>
        Suggested Users
      </Text>
      <Flex direction={'column'} gap={4}>
        {loading
          ? [1, 2, 3, 4, 5].map((_, indx) => {
              return (
                <Flex key={indx} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'}>
                  <Box>
                    <SkeletonCircle size={'10'} />
                  </Box>
                  <Flex w={'full'} flexDirection={'column'} gap={3}>
                    <Skeleton h={'10px'} w={'80px'} />
                    <Skeleton h={'8px'} w={'90%'} />
                  </Flex>
                </Flex>
              );
            })
          : visibleSuggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
        {!loading && suggestedUsers.length > MAX_VISIBLE_USERS && (
          <Button onClick={toggleShowMoreSuggested} variant="link" colorScheme="blue">
            {showMoreSuggested ? 'Show Less' : 'More...'}
          </Button>
        )}
      </Flex>
    </>
  );
};

export default SuggestedUsers;

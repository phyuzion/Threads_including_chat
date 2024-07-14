import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
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
  const showToast = useShowToast();
  const {  loading, error,data } =  useQuery(GET_SUGGESTED_USERS,{
    onCompleted,
    onError
  });

  function onCompleted(data) {
    console.log('SuggestedUsers data returned : ',data)
    setIsLoading(false)
    setSuggestedUsers(data.getSuggestedUsers)
  }

  function onError(error) {
    setIsLoading(false)
    //console.log('error ', error)
  }

  // useEffect(() => {
  //   const fetchSuggestedUsers = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch('/api/users/suggested', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       const data = await res.json();
  //       if (data.error) {
  //         showToast('Error', data.error, 'error');
  //         return;
  //       }

  //        setSuggestedUsers([]);
  //     } catch (error) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSuggestedUsers();
  // }, []);

  return (
    <>
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
          : suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
      </Flex>
    </>
  );
};

export default SuggestedUsers;

import { gql, useQuery ,useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Text, Box, Button } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import { GetFeedPosts, GetLatestPost } from "../apollo/queries.js";

//import { GetFeedPosts, GetLatestPosts } from "../apollo/queries.js";

const GET_FEED_POST = gql`
  ${GetFeedPosts}
`;

const GET_LATEST_POST = gql`
  ${GetLatestPost}
`;

//const GET_LATEST_POST = gql`
//  ${GetLatestPosts}
//`;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);

  const [queryType, setQueryType] = useState('FEED');

  // const { loading, error, data } = useQuery(GET_FEED_POST, {
  //   variables: { skip: 0 , limit: 10 },
  //   onCompleted: (data) => {
  //     setPosts(data.getFeedPosts);
  //   },
  //   onError: (error) => {
  //     console.error('Error fetching feed posts:', error);
  //   }
  // });


  
  const [ refetch,{loading, error, data} ] = useLazyQuery(
    queryType == 'FEED' ? GET_FEED_POST : GET_LATEST_POST,
    {
      variables: { skip: 0 , limit: 10 },
      onCompleted: (data) => {
        setPosts(queryType === 'FEED' ? data?.getFeedPosts : data?.getLatestPosts);
      },
      onError: (error) => {
        console.error(`Error fetching ${queryType.toLowerCase()} posts:`, error);
      }
    }
  );

  useEffect(() => {
    refetch();
  }, []);
  
  useEffect(() => {
    refetch();
  }, [queryType, refetch]);

  
  const handleQueryChange = () => {
    const newQueryType = queryType === 'LATEST' ? 'FEED' : 'LATEST';
    console.log('newQueryType: ',newQueryType)
    setQueryType(newQueryType);
    setPosts([]); // Reset posts to ensure the loading state is shown
  };

  return (
    <Box position="relative">
      {loading ? (
        <Flex justifyContent={'center'} gap={[2, 3, 4]} mt={[4, 6, 8]}>
          <Spinner size={'xl'} />
        </Flex>
      ) : (!posts || posts.length === 0) ? (
        <Flex justifyContent={'center'} gap={[2, 3, 4]} mt={[10, 15, 20]}>
          <Text fontSize={['md', 'lg', 'xl']}>You must follow someone</Text>
        </Flex>
      ) : (
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })
      )}
      <Box mb={20}></Box> {/* Add space at the bottom */}
      <Button
        position={'fixed'}
        bottom={[4, 6, 10]}
        left={[4, 6, 10]}
        bg={'gray.dark'}
        color={'white'}
        rightIcon={<ViewIcon />}
        onClick={handleQueryChange}
      >
        {queryType === 'LATEST' ? 'FEEDS' : 'LATEST'}
      </Button>
    </Box>
  );
};

export default HomePage;

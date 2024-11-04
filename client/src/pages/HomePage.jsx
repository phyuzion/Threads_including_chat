import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Flex, Spinner, Text, Box, Button } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import { GetFeedPosts, GetLatestPost } from "../apollo/queries.js";

const GET_FEED_POST = gql`
  ${GetFeedPosts}
`;

const GET_LATEST_POST = gql`
  ${GetLatestPost}
`;

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [queryType, setQueryType] = useState('LATEST');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const [refetch, { loading, data }] = useLazyQuery(
    queryType === 'FEED' ? GET_FEED_POST : GET_LATEST_POST,
    {
      variables: { skip, limit: 10 },
      onCompleted: (data) => {
        const newPosts = queryType === 'FEED' ? data?.getFeedPosts : data?.getLatestPosts;
        
        if (newPosts.length < 10) {
          setHasMore(false); 
        }

        setPosts((prevPosts) => {
          const allPosts = [...prevPosts, ...newPosts];
          const uniquePosts = Array.from(new Set(allPosts.map(post => post._id)))
            .map(id => allPosts.find(post => post._id === id));
          return uniquePosts;
        });
      },
      onError: (error) => {
        console.error(`Error fetching ${queryType.toLowerCase()} posts:`, error);
      },
    }
  );

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setSkip((prevSkip) => prevSkip + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setSkip(0);
    setPosts([]);
    setHasMore(true);
    refetch();
  }, [queryType]);

  useEffect(() => {
    if (skip > 0) {
      refetch();
    }
  }, [skip]);

  const handleQueryChange = () => {
    const newQueryType = queryType === 'LATEST' ? 'FEED' : 'LATEST';
    setQueryType(newQueryType);
  };

  return (
    <Box position="relative" bg="white" minH="100vh" p={4}>
      {loading && skip === 0 ? (
          <Flex justifyContent={'center'} mt={[4, 6, 8]}>
          <Spinner size="xl" color="gray.500" />
        </Flex>
      ) : (!posts || posts.length === 0) ? (
        <Flex justifyContent={'center'} mt={[10, 15, 20]}>
          <Text fontSize="lg" color="gray.500">You must follow someone to see posts.</Text>
        </Flex>
      ) : (
        <Flex direction="column" gap={6} px={[2, 4, 6]}>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return <Post ref={lastPostElementRef} key={post._id} post={post} />;
            } else {
              return <Post key={post._id} post={post} />;
            }
          })}
        </Flex>
      )}
      <Button
        position="fixed"
        bottom={[4, 6, 8]}
        left={[4, 6, 8]}
        bg="#48639D"
        color="white"
        rightIcon={<ViewIcon />}
        onClick={handleQueryChange}
        _hover={{ bg: "#d0d3da" }}
        borderRadius="full"
        px={6} // 버튼이 완전히 둥글게 보이도록 패딩을 추가
      >
        {queryType === 'LATEST' ? 'LATEST' : 'FEED'}
      </Button>
    </Box>
  );
};

export default HomePage;

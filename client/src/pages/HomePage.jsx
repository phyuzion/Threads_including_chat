import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from 'react';
import { useToast, Flex, Spinner, Box } from '@chakra-ui/react';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import useShowToast from '../hooks/useShowToast';
import SuggestedUsers from '../components/SuggestedUsers';
import { GetFeedPosts } from "../apollo/queries";


//useMutation(LOGOUT, { onCompleted, onError });

const GET_FEED_POST = gql`
  ${GetFeedPosts}
`;

const HomePage = () => {
  //const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(true);
  const { loading, error, data } =  useQuery(GET_FEED_POST,{
    onCompleted,
    onError
  });
  //console.log(' data returned : ',data)
  function onCompleted(data) {
    // const parsedData = JSON.parse(data)
    console.log(' data returned : ',data.getFeedPosts[0])
    setIsLoading(false)
    setPosts(data.getFeedPosts)
  }

  function onError(error) {
    setIsLoading(false)
    console.log('error ', error)
  }
  //const {data} = useQuery(GET_FEED_POST);
  // const [result] = useQuery({
  //   query: FILMS_QUERY,
  // });
  // useEffect(() => {
  //   try{
  //     const { data, loading, error } = useQuery(GET_FEED_POST);
  //     if(data){
  //       setPosts(data);
  //       setIsLoading(false);        
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }finally {
  //     setIsLoading(false);
  //   }

  // }, []);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {isLoading ? (
          <Flex justifyContent={'center'}>
            <Spinner size={'xl'} />
          </Flex>
        ) : (!posts || posts.length == 0) ? (
          <Flex justifyContent={'center'} mt={20}>
            <h1>You must follow someone to view posts</h1>
          </Flex>
        ) : (
          posts.map((post) => {
            return <Post key={post._id} post={post} />;
          })
        )}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;

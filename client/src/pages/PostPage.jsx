import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import getUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { gql, useMutation,useQuery } from "@apollo/client";
import { GetPost } from "../apollo/queries.js";
import { DeletePost } from "../apollo/mutations.js";

const GET_POST = gql`
  ${GetPost}
`;


function PostPage() {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  console.log(' PostPage currentUser: ',currentUser)
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts[0];
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile();
  console.log(' PostPage postId: ',postId)
  console.log(' PostPage user: ',user)
  const DELETE_POST = gql` ${DeletePost}`;
  const [DELETE_POST_COMMAND] = useMutation(DELETE_POST);
  const { loading , error , data }= useQuery(GET_POST,{
    variables: {postId: postId},
    onCompleted: (result) => {
      console.log('getUserProfile result: ',result?.getPost)
      setPosts([result?.getPost]);
      
    },
    onError: (error) => {
      console.log('getPost error : ',error)
      return;
    },
    fetchPolicy: "network-only",
  })



  const handleDelete = async (e) => {
    try {
      if (!window.confirm('Are you sure you want to delete this post')) return;

      const response = await DELETE_POST_COMMAND({ variables:{postId: currentPost._id}})
      if(response?.data?.deletePost){ 
        navigate(`/${user.username}`);
      }

      if (response?.data?.error) {
        console.log('Error: ',response?.data?.error)
        return;
      }
    } catch (error) {
      console.log('Error: ',error.message)
    }
  };
  console.log('Post Page user: ',user,' isLoading: ',isLoading)
  if (!user && isLoading)
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'} />
      </Flex>
    );

  if (!currentPost) return null;
  console.log(' PostPage : ',currentPost)
  return (
    <>
      <Flex gap={3} mb={4} py={5}>
        <Flex flex={1} flexDirection={'column'} gap={2}>
          <Flex w={'full'} justifyContent={'space-between'}>
            <Flex alignItems={'center'}>
              <Avatar size={'md'} name={user.name} src={user.profilePic} mr={2} />
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {user.username}
              </Text>
              <Image src='/verified.png' w={4} h={4} ml={1} />
            </Flex>
            <Flex alignItems={'center'}>
              <Text fontSize={'sm'} color={'gray.light'}>
                {formatDistanceToNowStrict(new Date(currentPost.createdAt))}
              </Text>
              {console.log(' Post page : currentUser?._id : ',currentUser?._id, ' currentPost.postedBy: ',currentPost.postedBy)}
              {currentUser?.loginUser._id == currentPost.postedBy && (
                <DeleteIcon onClick={handleDelete} ml={2} cursor={'pointer'} />
              )}
            </Flex>
          </Flex>
          <Text fontSize={'sm'}>{currentPost.text}</Text>
          {currentPost.img && (
            <Box borderRadius={6} overflow={'hidden'} border={'1px solid gray.light'}>
              <Image src={currentPost.img} w={'full'} />
            </Box>
          )}

          <Flex gap={3} my={1} alignItems={'center'}>
            <Actions post={currentPost} />
          </Flex>

          <Divider my={4} />
          <Flex justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'2xl'}>👋</Text>
              <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
            </Flex>
            <Button>Get</Button>
          </Flex>
        </Flex>
      </Flex>

      <Divider my={4} />

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          isLastReply={currentPost.replies[currentPost.replies.length - 1] == reply}
        />
      ))}
    </>
  );
}

export default PostPage;

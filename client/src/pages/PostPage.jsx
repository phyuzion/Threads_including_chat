import React from 'react';
import { Flex, Spinner, Text, Divider, Box } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import Comment from '../components/Comment';
import getUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { gql, useMutation } from "@apollo/client";
import { DeletePost } from "../apollo/mutations.js";
import Post from '../components/Post';

const DELETE_POST = gql`
  ${DeletePost}
`;

function PostPage() {
  const { postId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentPost = posts.find(p => p._id === postId);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { user, isLoading } = getUserProfile(currentUser?._id);

  const [DELETE_POST_COMMAND] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      cache.modify({
        fields: {
          getFeedPosts(existingPosts = [], { readField }) {
            return existingPosts.filter(postRef => readField('_id', postRef) !== postId);
          }
        }
      });
    },
    onCompleted: () => {
      setPosts(posts.filter(p => p._id !== postId));
      showToast('Success', 'Post deleted successfully', 'success');
      navigate('/');
    },
    onError: (error) => {
      showToast('Error', error.message, 'error');
    }
  });

  if (!user && isLoading) {
    return (
      <Flex justifyContent={'center'} mt={8}>
        <Spinner size={'xl'} color="#48639D" />
      </Flex>
    );
  }

  if (!currentPost) return <Text textAlign="center" mt={4}>No post found.</Text>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await DELETE_POST_COMMAND({ variables: { postId: currentPost._id } });
    } catch (error) {
      console.error('Delete post error:', error);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm">
      <Post
        post={currentPost}
        user={user}
        handleDelete={currentUser?.loginUser?._id === currentPost.postedBy ? handleDelete : undefined}
      />
      <Divider my={4} borderColor="#e0e0e0" />
      
      {currentPost.replies?.length > 0 ? (
        currentPost.replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            isLastReply={currentPost.replies[currentPost.replies.length - 1] === reply}
          />
        ))
      ) : (
        <Text textAlign="center" fontSize="sm" color="gray.600" mt={4}>
          No comments yet.
        </Text>
      )}
    </Box>
  );
}

export default PostPage;

import React from 'react';
import Post from './Post';

function UserPost({ post }) {
  return (
    <Post post={post} user={post.postedByUser} />
  );
}

export default UserPost;

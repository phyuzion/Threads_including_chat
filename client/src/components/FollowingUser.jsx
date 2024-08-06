import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow';

export const FollowingUser = ({ user, onClose }) => {
  return (
    <Flex gap={2} justifyContent={'space-between'} alignItems={'center'} onClick={onClose}>
      <Flex as={Link} to={`/${user.username}`} gap={2}>
        <Avatar size={'sm'} src={user.profilePic} />
        <Flex direction={'column'} fontSize="sm">
          <Text fontWeight={400}>{user.username}</Text>
          <Text fontSize="xs">{user.name}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FollowingUser;

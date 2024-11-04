import { Avatar, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';
import useHandleFollowUnFollow from '../hooks/useHandleFollowUnFollow';

export const SuggestedUser = ({ user, onFollow, onClose }) => {
  const { following, isFlwBtnLoading, handleFollowUnFollow } = useHandleFollowUnFollow(user);

  const handleFollowClick = async () => {
    await handleFollowUnFollow();
    if (!following) {
      onFollow(user._id);
    }
    onClose();
  };

  return (
    <Flex gap={3} justifyContent="space-between" alignItems="center" p={2} borderBottom="1px solid #e2e8f0">
      <Flex as={Link} to={`/${user.username}`} gap={3} alignItems="center" onClick={onClose}>
        <Avatar size="sm" src={user.profilePic} />
        <Flex direction="column" fontSize="sm">
          <Text fontWeight="bold" color="gray.700">{user.username}</Text>
          <Text fontSize="xs" color="gray.500">{user.name}</Text>
        </Flex>
      </Flex>
      {!following && (
        <Button
          size="xs"
          color="white"
          bg="#3182CE"
          onClick={handleFollowClick}
          isLoading={isFlwBtnLoading}
          _hover={{ bg: "#63B3ED" }}
        >
          Follow
        </Button>
      )}
    </Flex>
  );
};

export default SuggestedUser;

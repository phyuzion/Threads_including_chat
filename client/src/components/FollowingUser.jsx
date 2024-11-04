import { Avatar, Flex, Text, Box } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

export const FollowingUser = ({ user, onClose }) => {
  return (
    <Flex
      gap={3}
      justifyContent="space-between"
      alignItems="center"
      p={3}
      borderBottom="1px solid #e2e8f0"
      _hover={{ bg: '#f7f7f7' }}
      borderRadius="md"
      onClick={onClose}
    >
      <Flex as={Link} to={`/${user.username}`} alignItems="center" gap={3} flex="1">
        <Avatar size="md" src={user.profilePic} />
        <Flex direction="column" fontSize="sm">
          <Text fontWeight="bold" color="gray.700">
            {user.username}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user.name}
          </Text>
        </Flex>
      </Flex>
      <Box>
        {/* 여기에 다른 요소나 아이콘을 추가할 수 있습니다. */}
      </Box>
    </Flex>
  );
};

export default FollowingUser;

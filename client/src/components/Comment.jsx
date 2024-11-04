import { Avatar, Divider, Flex, Text, Box } from '@chakra-ui/react';
import React from 'react';

function Comment({ reply, isLastReply }) {
  return (
    <Box py={2}>
      <Flex gap={3} alignItems="flex-start">
        {/* 사용자 프로필 이미지 */}
        <Avatar size="sm" src={reply.userProfilePic} />
        
        {/* 댓글 본문 */}
        <Flex direction="column" flex="1">
          <Text fontSize="sm" fontWeight="bold" color="gray.700">
            {reply.username}
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            {reply.text}
          </Text>
        </Flex>
      </Flex>
      
      {/* 구분선 */}
      {!isLastReply && (
        <Divider my={2} borderColor="gray.200" />
      )}
    </Box>
  );
}

export default Comment;

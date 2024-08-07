import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom } from '../atoms/convAtoms';
import usePreviewImage from '../hooks/usePreviewImage';
import { BsFillImageFill } from 'react-icons/bs';
import { Send_Message } from '../apollo/mutations';
import { gql, useMutation } from '@apollo/client';

const MessageInput = ({ setMessages, otherUser }) => {
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const setConversations = useSetRecoilState(conversationsAtom);
  
  const { handleImageChange, previewImage, setPreviewImage, processedImage } = usePreviewImage(); // webP or JPEG
  
  const messageMediaRef = useRef();
  const { onClose } = useDisclosure();
  const showToast = useShowToast();

  const SEND_MESSAGE_ = gql`${Send_Message}`;
  const [SEND_MESSAGE_COMMAND] = useMutation(SEND_MESSAGE_);
  const MESSAGE_IMG_URL = `${import.meta.env.VITE_MEDIA_SERVER_URL}`;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !previewImage) return;
    if (isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      let data;
      if (previewImage) {
        const fileToUpload = processedImage;

        if (!fileToUpload) {
          throw new Error('No file to upload');
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);

        const user_ = JSON.parse(localStorage.getItem('user') || '{}');
        const res = await fetch(MESSAGE_IMG_URL, {
          method: 'POST',
          headers: {
            Authorization: user_?.loginUser?.jwtToken ? `Bearer ${user_.loginUser.jwtToken}` : '',
          },
          body: formData,
        });
        
        data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to upload image');
        }
      }

      console.log('handleSendMessage : ', messageText);
      const response = await SEND_MESSAGE_COMMAND({
        variables: {
          receiverId: otherUser._id,
          text: messageText,
          img: previewImage ? data.url : '',
        },
      });

      console.log('response: ', response);
      const result = response?.data?.sendMessage;

      setConversations((prevConv) => {
        return prevConv.map((conv) => {
          if (conv.participants.includes(otherUser._id)) {
            return {
              ...conv,
              lastMessage: { text: messageText, sender: result?.sender },
            };
          }
          return conv;
        });
      });

      setMessageText('');
      setPreviewImage('');
      setMessages((prevState) => [...prevState, result]);
    } catch (error) {
      showToast('Error', error.message, 'error');
      console.error('Send message error:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <Flex gap={2} align={'center'} width="100%">
      <form onSubmit={handleSendMessage} style={{ flex: 95, width: '100%' }}>
        <InputGroup width="100%">
          <Input
            placeholder='Type Your Message...'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement>
            {isSendingMessage ? (
              <Spinner size={'sm'} />
            ) : (
              <IoSendSharp onClick={handleSendMessage} cursor={'pointer'} />
            )}
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex flex={5} cursor={'pointer'}>
        <Input type={'file'} hidden ref={messageMediaRef} onChange={handleImageChange} accept='image/*' />
        <BsFillImageFill onClick={() => messageMediaRef.current.click()} size={20} />
      </Flex>

      <Modal
        isOpen={!!previewImage}
        onClose={() => {
          onClose();
          setPreviewImage('');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selected Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex w={'full'}>
              <Image src={previewImage} alt='Message Media' />
            </Flex>
            <Flex justifyContent={'flex-end'} my={2}>
              {isSendingMessage ? (
                <Spinner size={'md'} />
              ) : (
                <IoSendSharp size={24} cursor={'pointer'} onClick={handleSendMessage} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;

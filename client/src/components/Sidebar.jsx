import React from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import SuggestedUsers from './SuggestedUsers';

function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<FaUsers />}
        colorScheme="teal"
        onClick={onOpen}
        aria-label="Open Suggested Users"
        position="fixed"
        bottom="20px"
        right="20px"
        zIndex="tooltip"
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Suggested Users</DrawerHeader>
          <DrawerBody>
            <SuggestedUsers />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;

import React from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import SuggestedUsers from './SuggestedUsers';

function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        transform="translate(50%, -50%) rotate(-90deg)"
        position={'fixed'}
        top={'40%'}
        right={6}
        bg={'gray.dark'}
        color={'white'}
        leftIcon={<FaUsers />}
        onClick={onOpen}
        borderBottomLeftRadius={'0px'}
        borderBottomEndRadius={'0px'}
        height={12}
      >
        Follow
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent
          backgroundColor={'gray.dark'}
          maxW={'250px'}
          h={'80%'} // Height set to 80% of the viewport
          mt={'10%'} // Margin top to center vertically with 10% margin at top and bottom
          mb={'10%'} // Margin bottom to center vertically with 10% margin at top and bottom
          borderTopLeftRadius={'20px'} // Rounded top-left corner
          borderBottomLeftRadius={'20px'} // Rounded bottom-left corner
        >
          <DrawerCloseButton />
          <DrawerBody>
            <SuggestedUsers />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;

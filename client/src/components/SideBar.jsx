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
  const { isOpen, onOpen, onClose } = useDisclosure({ preserveScrollBarGap: true, motionPreset: 'none' });
  const btnRef = React.useRef();

  return (
    <>
      <Button
        transform="translate(50%, -50%) rotate(-90deg)"
        position={'fixed'}
        top={['30%', '35%', '40%']}
        right={[2, 4, 6]}
        bg={'gray.dark'}
        color={'white'}
        leftIcon={<FaUsers />}
        onClick={onOpen}
        borderBottomLeftRadius={'0px'}
        borderBottomEndRadius={'0px'}
        height={[8, 10, 12]}
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
          maxW={['200px', '250px']}
          h={'80%'}
          mt={'10%'}
          mb={'10%'}
          borderTopLeftRadius={'20px'}
          borderBottomLeftRadius={'20px'}
        >
          <DrawerCloseButton />
          <DrawerBody>
            <SuggestedUsers onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;

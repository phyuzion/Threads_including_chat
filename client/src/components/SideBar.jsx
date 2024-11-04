import React from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FaUsers } from 'react-icons/fa';
import SuggestedUsers from './SuggestedUsers';

function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure({ preserveScrollBarGap: true });
  const btnRef = React.useRef();

  return (
    <>
      <Button
        transform="translate(50%, -50%) rotate(-90deg)"
        position={'fixed'}
        top={['30%', '35%', '40%']}
        right={[2, 4, 6]}
        bg="#2D3748"
        color="white"
        leftIcon={<FaUsers />}
        onClick={onOpen}
        borderBottomLeftRadius="0"
        borderBottomEndRadius="0"
        height={[8, 10, 12]}
        _hover={{ bg: "#4A5568" }}
      >
        Follow
      </Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent bg="white" maxW={['280px', '320px']} h="80%" mt="10%" mb="10%" borderTopLeftRadius="lg" borderBottomLeftRadius="lg">
          <DrawerCloseButton color="gray.600" />
          <DrawerBody py={4}>
            <SuggestedUsers onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;

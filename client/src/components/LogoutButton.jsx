import { Button, useToast } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { FiLogOut } from 'react-icons/fi';
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { logoutUser } from "../apollo/mutations";

const LOGOUT_USER = gql`${logoutUser}`;

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const toast = useToast();
  const client = useApolloClient();
  
  const [LOGOUT_USER_COMMAND] = useMutation(LOGOUT_USER, {
    onCompleted: async (data) => {
      console.log('LOGOUT_USER onCompleted: ', data);
      localStorage.removeItem('user');
      setUser(null);
      await client.clearStore(); // Clear Apollo Client cache
      await client.resetStore(); // Reset Apollo Client cache
      toast({ title: 'Successfully Logged out', description: '', status: 'success', duration: 3000, isClosable: true });
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, status: 'error', duration: 3000, isClosable: true });
    }
  });

  const handleLogout = async () => {
    try {
      await LOGOUT_USER_COMMAND();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button pos={'fixed'} top={'20px'} right={'30px'} onClick={handleLogout}>
      <FiLogOut />
    </Button>
  );
};

export default LogoutButton;

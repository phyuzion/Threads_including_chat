import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { gql, useMutation } from "@apollo/client";
import { logoutUser } from "../apollo/mutations";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const LOGOUT_USER = gql` ${logoutUser}`;
  const logout = async () => {
    try {
      const response =  useMutation(LOGOUT_USER, {variables:{ },
        onCompleted: (data) => {
          console.log(' LOGOUT_USER onCompleted : ')
          setIsLoading(false);
          toast({title: 'Successfully Logged out',description: '',status: 'success',duration: 3000,isClosable: true});          
        },
        onError: (error) => {
          setIsLoading(false);
          toast({ title: 'Error', description: error, status: 'error', duration: 3000,isClosable: true });
        } 
    })
      if(response?.data){
        localStorage.removeItem('user');
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return logout;
};

export default useLogout;

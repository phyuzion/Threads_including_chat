import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { gql, useMutation } from "@apollo/client";
import { logoutUser } from "../apollo/mutations";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const LOGOUT_USER = gql` ${logoutUser}`;
  const [LOGOUT_USER_COMMAND] = useMutation(LOGOUT_USER);
  const logout = async () => {
    try {
      console.log('logout.... ')
      const response = await LOGOUT_USER_COMMAND({})
      if(response?.data){
        console.log(' data : ',response.data)
        localStorage.removeItem('user');
        setUser(null);
        //localStorage.setItem('token', JSON.stringify(data.jwtToken));
      } else {
        localStorage.removeItem('user');
        setUser(null);       
      }
    } catch (error) {
      localStorage.removeItem('user');
      setUser(null);   
    }
  };

  return logout;
};

export default useLogout;

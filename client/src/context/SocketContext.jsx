import { createContext, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import io from 'socket.io-client';
const SOCKET_URL = `${import.meta.env.VITE_MEDIA_SOCKET_URL}`;
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState();

  useEffect(() => {
    console.log('SocketContextProvider!!! ')
    const socket = io(SOCKET_URL, {
      query: {
        userId: user?._id,
      },
    });
    console.log('socket : ',socket)
    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    setSocket(socket);

    return () => socket && socket.close();
  }, [user?._id]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

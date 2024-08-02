import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/theme-utils';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';

import { ApolloProvider } from '@apollo/client';
import setupApolloClient from './apollo/apolloindex.js'

//const client = setupApolloClient();
const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'WhiteAlpha.900')(props),
      bg: mode('white', 'transparent')(props),
      backgroundImage: "url('/ess-bg.png')", // 배경 이미지 추가
      backgroundSize: '100% auto', // 이미지 사이즈 조정
      backgroundPosition: 'center top', // 이미지 위치 조정
      backgroundRepeat: 'repeat', // 이미지 반복 없음
      backgroundAttachment: 'fixed'
    },
  }),
};
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e',
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ApolloProvider client={setupApolloClient()}>
  <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <SocketContextProvider>
          <App />
        </SocketContextProvider>

      </ChakraProvider>
    </BrowserRouter>
  </RecoilRoot>
  </ApolloProvider>
  // </React.StrictMode>
);

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
      bg: mode('gray.100', '#101010')(props),
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

        {/* <SocketContextProvider> */}
          <App />
        {/* </SocketContextProvider> */}

      </ChakraProvider>
    </BrowserRouter>
  </RecoilRoot>
  </ApolloProvider>
  // </React.StrictMode>
);

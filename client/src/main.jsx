import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';
import { SocketContextProvider } from './context/SocketContext.jsx';
import { ApolloProvider } from '@apollo/client';
import setupApolloClient from './apollo/apolloindex.js';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

const theme = extendTheme({
    styles: {
        global: {
            "body": {
                backgroundColor: "#f9f9f9", // 라이트 모드 배경색
                color: "#333",              // 기본 텍스트 색상
                fontFamily: "'Inter', sans-serif", // 기본 폰트 설정
                margin: 0,
                padding: 0,
            },
            "::-webkit-scrollbar": {
                width: "7px",
            },
            "::-webkit-scrollbar-track": {
                backgroundColor: "#f9f9f9",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: "#bbb",
                borderRadius: "4px",
            },
        },
    },
    config: {
        initialColorMode: 'light',  // 라이트 모드로 강제 설정
        useSystemColorMode: false,  // 시스템 색상 모드 사용 안 함
    },
    colors: {
        gray: {
            light: '#616161',
            dark: '#1e1e1e',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
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
);

import React, { createContext, useContext, useState } from 'react';
import { loadProgram } from "../utils/SolanaLoader";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  // Solana 상태
  const [wallet, setWallet] = useState(null);
  const [program, setProgram] = useState(null);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    setThemeSettings((prev) => !prev);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    setThemeSettings((prev) => !prev);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  // 지갑 연결
  const connectWallet = async (walletAdapter) => {
    try {
      if (!walletAdapter.ready) {
        throw new Error("Phantom Wallet 브라우저 확장이 설치되지 않았습니다.");
      }
      await walletAdapter.connect();

      const { provider, program } = await loadProgram(walletAdapter); // Alchemy 사용
      setWallet(walletAdapter);
      setProgram(program);
      console.log("Wallet connected:", walletAdapter.publicKey.toString());
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // 지갑 해제
  const disconnectWallet = async () => {
    if (wallet) {
      await wallet.disconnect();
      setWallet(null);
      setProgram(null);
      console.log("Wallet disconnected.");
    }
  };

  return (
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

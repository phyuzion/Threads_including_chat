import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { RiNotification3Line } from 'react-icons/ri';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useStateContext } from '../contexts/ContextProvider';

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";



const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter" >
    <button
      type='button'
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray hover:drop-shadow-xl">
      <span style={{ background: dotColor }} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
      {icon}
    </button>
  </TooltipComponent>
)


const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
    connectWallet, // 여기서 가져옴
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }
  }, [screenSize])



  const handleWalletConnect = async () => {
    try {
      const phantomWallet = new PhantomWalletAdapter();
      await connectWallet(phantomWallet);
      alert("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert(error.message);
    }
  };

  return (
    <nav className='flex justify-between p-2 md:mx-6 relative'>

      {/* Sidebar toggle button */}
      <NavButton
        title="Menu"
        customFunc={() => setActiveMenu((prev) => !prev)}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />

      {/* Right side buttons */}
      <div className='flex'>
        

        <NavButton
          title="Notifications"
          dotColor="#03C9D7"
          customFunc={handleWalletConnect} // 버튼 클릭 시 지갑 연결
          color={currentColor}
          icon={<RiNotification3Line />}
        />

      </div>
    </nav>
  )
};

export default Navbar;

import React, { useContext, useState } from 'react';
import SideBar from '../Components/SideBar';
import ChatContainer from '../Components/ChatContainer';
import RightSideBar from '../Components/RightSideBar';
import { ChatContext } from '../../context/ChatContext';

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext);

  return (
    <div className="flex w-full h-screen sm:px-[15%] sm:py-[5%] backdrop-blur-md">
      <div className="rounded-2xl overflow-hidden h-full w-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] border-2 border-gray-700 backdrop-blur-xl">
        {/* Ensure all child columns stretch & scroll correctly */}
        <div className="h-full min-h-0">
          <SideBar  />
        </div>
        <div className="h-full min-h-0">
          <ChatContainer />
        </div>
        <div className="h-full min-h-0">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

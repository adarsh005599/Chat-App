import React, { useEffect, useRef, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const scrollEnd = useRef();
  const [isTyping, setIsTyping] = useState(true);
  const [input, setInput] = useState('');

  const { messages = [], selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authuser, onlineUser } = useContext(AuthContext);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsTyping(false), 3000);
    return () => clearTimeout(timeout);
  }, [messages]);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-4 text-white h-full bg-[#1e1b2e] w-full"
      >
        <motion.img
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          src={assets.logo_icon}
          className="w-16"
        />
        <p className="text-lg font-medium text-gray-300">Chat anytime, anywhere</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full w-full bg-[#1e1b2e] relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-600 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              className="w-8 h-8 rounded-full object-cover"
            />
            {onlineUser.includes(selectedUser._id) && (
              <>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white animate-pulse"></span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500"></span>
              </>
            )}
          </div>
          <p className="text-lg font-medium text-white">{selectedUser.fullName}</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.img
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            className="md:hidden w-5 cursor-pointer"
          />
          <motion.img
            whileHover={{ rotate: 20 }}
            src={assets.help_icon}
            className="max-md:hidden w-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Messages Body */}
      <motion.div
        layout
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex items-end gap-2 ${
                msg.senderId !== authuser._id ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.image ? (
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={msg.image}
                  alt="img"
                  className="max-w-[200px] border border-gray-700 rounded-lg mb-8"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] text-sm rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                    msg.senderId === authuser._id ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs opacity-80">
                <img
                  src={
                    msg.senderId === authuser._id
                      ? authuser.profilePic || assets.avatar_icon
                      : selectedUser?.profilePic || assets.avatar_icon
                  }
                  className="w-7 rounded-full"
                />
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2 justify-start"
            >
              <div className="p-2 px-4 max-w-[150px] text-sm font-light rounded-lg mb-8 bg-gray-500/30 text-white flex items-center gap-1">
                {[0, 0.2, 0.4].map((delay, idx) => (
                  <motion.span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-400">
                <img src={assets.profile_martin} className="w-7 rounded-full" />
                <p className="text-gray-500">typing...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollEnd}></div>
        <p className="text-gray-400 text-sm text-center mt-12">
          Start chatting with {selectedUser.fullName}
        </p>
      </motion.div>

      {/* Input Box */}
      <div className="sticky bottom-0 bg-[#1e1b2e] px-4 py-3 flex items-center gap-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-4 py-2 rounded-full hover:bg-gray-100/20 transition">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 bg-transparent text-sm p-2 text-white placeholder-gray-400 outline-none"
            type="text"
            placeholder="Send a message!!"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpg"
            hidden
          />
          <label htmlFor="image">
            <motion.img
              whileHover={{ scale: 1.2 }}
              src={assets.gallery_icon}
              className="w-5 cursor-pointer mr-2"
            />
          </label>
        </div>
        <motion.img
          whileTap={{ scale: 0.9, rotate: -10 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
        />
      </div>
    </motion.div>
  );
};

export default ChatContainer;

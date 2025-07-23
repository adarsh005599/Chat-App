import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const SideBar = () => {
  const {
    users,
    getUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  } = useContext(ChatContext);

  const { logout, onlineUser } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className={`h-full max-h-screen overflow-y-auto p-4 text-white border-r border-gray-700 bg-[#1c1a2e] w-full md:w-72 max-md:absolute max-md:z-40 max-md:left-0 transition-all duration-300 ${
        selectedUser ? 'max-md:-translate-x-full' : 'max-md:translate-x-0'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-6 relative">
        <img src={assets.logo} className="w-24 object-contain" alt="logo" />
        <div className="relative">
          <img
            src={assets.menu_icon}
            className="h-5 cursor-pointer"
            alt="menu"
            onClick={() => setShowMenu(!showMenu)}
          />
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-36 p-3 rounded-md bg-[#282142] border border-gray-600 text-gray-100 z-30"
              >
                <p
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm hover:underline"
                >
                  Edit Profile
                </p>
                <p
                  onClick={() => {
                    navigate('/privacy');
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm hover:underline mt-1"
                >
                  Privacy Center
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p
                  onClick={() => {
                    logout();
                    localStorage.removeItem('token');
                    navigate('/login');
                    setShowMenu(false);
                  }}
                  className="text-sm cursor-pointer hover:underline"
                >
                  Logout
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#283142] rounded-full flex items-center gap-2 py-2 px-4 mb-4">
        <img src={assets.search_icon} className="w-3" alt="search" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search user"
          className="bg-transparent text-white text-xs outline-none placeholder-[#c8c8c8] flex-1"
        />
      </div>

      {/* User List */}
      <div className="flex flex-col gap-2">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user._id || index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center gap-3 p-3 hover:bg-[#2f2946] rounded-lg cursor-pointer"
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              className="w-9 h-9 rounded-full object-cover"
              alt="avatar"
            />
            <div className="flex flex-col">
              <p className="font-medium text-sm truncate w-40">{user.fullName}</p>
              <span
                className={`text-xs ${
                  onlineUser.includes(user._id)
                    ? 'text-green-400'
                    : 'text-gray-400'
                }`}
              >
                {onlineUser.includes(user._id) ? 'Online' : 'Offline'}
              </span>
            </div>

            {unseenMessages[user._id] > 0 && (
              <div className="absolute top-3 right-3 h-5 w-5 flex items-center justify-center text-xs rounded-full bg-violet-500/60">
                {unseenMessages[user._id]}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;

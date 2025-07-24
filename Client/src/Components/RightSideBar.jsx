import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSideBar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUser } = useContext(AuthContext);
  const [messageImages, setMessageImages] = useState([]);
  const [activeTab, setActiveTab] = useState('default'); // 'default' | 'profile' | 'privacy' | 'notifications'

  // Extract images from messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const images = messages.filter(msg => msg.image).map(msg => msg.image);
      setMessageImages(images);
    } else {
      setMessageImages([]);
    }
  }, [messages]);

  const renderBackButton = () => (
    <button
      onClick={() => setActiveTab('default')}
      className="text-sm text-blue-400 hover:underline mt-2 self-start"
    >
      ← Back
    </button>
  );

  return (
    selectedUser && (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.4 }}
        className="text-white h-full w-full px-5 py-6 overflow-y-auto border-l border-gray-700 md:flex flex-col gap-6"
      >
        {/* Conditional Content Rendering */}
        {activeTab === 'default' && (
          <>
            {/* Profile Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.img
                src={selectedUser?.profilePic || assets.avatar_icon}
                className="w-20 h-20 rounded-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <h2 className="text-lg font-semibold">{selectedUser.fullName}</h2>
              {onlineUser.includes(selectedUser._id) && (
                <p className="text-sm px-14 mx-auto text-gray-400 text-center">
                  {selectedUser.bio}
                </p>
              )}
            </motion.div>

            <hr className="border-gray-600" />

            {/* Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="flex flex-col gap-4 mt-4"
            >
              <motion.button
                onClick={() => setActiveTab('profile')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#2a2640] px-4 py-2 rounded-lg hover:bg-[#39325a] transition text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                View Profile
              </motion.button>

              <motion.button
                onClick={() => setActiveTab('privacy')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#2a2640] px-4 py-2 rounded-lg hover:bg-[#39325a] transition text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Privacy Settings
              </motion.button>

              <motion.button
                onClick={() => setActiveTab('notifications')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#2a2640] px-4 py-2 rounded-lg hover:bg-[#39325a] transition text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Notifications
              </motion.button>

              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Logout
              </motion.button>
            </motion.div>

            {/* Media Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-5 text-xs"
            >
              <p className="flex items-center justify-center text-sm mb-4 text-gray-400">Media</p>
              <motion.div
                className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {messageImages.length > 0 ? (
                  messageImages.map((url, index) => (
                    <motion.div
                      key={index}
                      onClick={() => window.open(url, "_blank")}
                      className="cursor-pointer rounded"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={url} className="h-full w-full object-cover rounded-md" />
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-2 text-center">No media available</p>
                )}
              </motion.div>
            </motion.div>
          </>
        )}

        {/* View Profile Tab */}
        {activeTab === 'profile' && (
          <div className="flex flex-col items-center gap-3">
            {renderBackButton()}
            <img src={selectedUser?.profilePic || assets.avatar_icon} className="w-24 h-24 rounded-full" />
            <h2 className="text-xl font-semibold">{selectedUser.fullName}</h2>
            <p className="text-sm text-gray-400 text-center">{selectedUser.bio}</p>
            <p className="text-xs mt-2 text-gray-500">Email: {selectedUser.email || 'Not available'}</p>
            <p className="text-xs text-gray-500">Joined: {selectedUser.createdAt?.slice(0, 10)}</p>
          </div>
        )}

        {/* Privacy Settings Tab */}
        {activeTab === 'privacy' && (
          <div className="flex flex-col gap-4">
            {renderBackButton()}
            <h2 className="text-xl font-semibold">Privacy Settings</h2>
            <ul className="text-sm text-gray-300 list-disc pl-5">
              <li>Hide online status</li>
              <li>Block user</li>
              <li>Enable/Disable read receipts</li>
              <li>Two-factor authentication</li>
            </ul>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="flex flex-col gap-4">
            {renderBackButton()}
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            <ul className="text-sm text-gray-300 list-disc pl-5">
              <li>Sound alerts</li>
              <li>Vibration (mobile)</li>
              <li>Desktop push notifications</li>
              <li>Mute this chat</li>
            </ul>
          </div>
        )}
      </motion.div>
    )
  );
};

export default RightSideBar;

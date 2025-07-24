import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authuser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authuser.fullName);
  const [bio, setBio] = useState(authuser.bio);
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
    return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () =>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio})
      navigate('/')
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl backdrop-blur-sm border-4 border-gray-700 text-white flex flex-col sm:flex-row p-6 rounded-2xl items-center gap-8 bg-black/50"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full sm:w-1/2"
        >
          <h3 className="text-xl font-semibold mb-2 text-center sm:text-left">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer">
            <input
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
              onChange={(e) => setSelectedImg(e.target.files[0])}
            />
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon}
              alt="avatar"
              className={`w-14 h-14 object-cover ${selectedImg ? 'rounded-full' : ''}`}
            />
            <span className="text-sm sm:text-base">Upload profile image</span>
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent"
          />

          <textarea
            rows={4}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write profile bio"
            className="p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-violet-700 text-white font-semibold p-3 rounded-full text-lg shadow-md"
          >
            Save
          </motion.button>
        </form>

        <motion.img
          src={ authuser?.profilePic || assets.logo_icon}
          alt="logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`w-32 sm:w-44 aspect-square rounded-full  ${selectedImg ? 'rounded-full' : ''}`}
        />
      </motion.div>
    </div>
  );
};

export default ProfilePage;

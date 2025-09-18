import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState('signUp');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === 'signUp' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currentState==="signUp" ? "signup" : "login" , {fullName, email, password, bio})
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center flex-col md:flex-row gap-10 px-6 py-10 bg-black/80 backdrop-blur-sm">
      
      {/* Logo */}
      <motion.img
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        src={"/login-img1.png"}
        className="w-40 sm:w-48 md:w-56"
      />

      {/* Form */}
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white/10 border border-white/20 text-white rounded-2xl px-6 py-8 shadow-xl backdrop-blur-md flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold capitalize">{currentState}</h2>
          {isDataSubmitted && (
            <motion.img
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer hover:rotate-180 transition-transform duration-300"
            />
          )}
        </div>

        <AnimatePresence>
          {currentState === 'signUp' && !isDataSubmitted && (
            <motion.input
              key="fullname"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-2 px-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
          )}
        </AnimatePresence>

        {!isDataSubmitted && (
          <>
            <motion.input
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 px-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />

            <motion.input
              key="password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 px-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />

            {currentState === 'signUp' && (
              <motion.textarea
                key="bio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                placeholder="Bio (optional)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="p-2 px-3 rounded-lg bg-white/20 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            )}
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
        >
          Continue
        </motion.button>

        <p className="text-sm text-gray-300 text-center">
          {currentState === 'signUp' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() =>
              setCurrentState(currentState === 'signUp' ? 'login' : 'signUp')
            }
            className="text-violet-400 underline cursor-pointer hover:text-violet-300"
          >
            {currentState === 'signUp' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginPage;

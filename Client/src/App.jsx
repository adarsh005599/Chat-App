import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import  LoginPage from './Pages/LoginPage'
import ProfilePage from './Pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'


const App = () => {

  const {authuser} = useContext(AuthContext)


  return (
  <div className="bg-[url('/bgimage.svg')] bg-contain">
4


      <Toaster/>

      <Routes>
      <Route path='/' element={authuser ? <HomePage/>: <Navigate to="/login"/>}/>
      <Route path='/login' element={!authuser ? <LoginPage/>: <Navigate to="/"/>}/>
      <Route path='/profile' element={authuser ? <ProfilePage/> : <Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

<<<<<<< HEAD
=======

>>>>>>> 6b3e2581685a15c7dac295aa8b6f0a001bbdded8
export default App


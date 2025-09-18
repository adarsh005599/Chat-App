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
<<<<<<< HEAD
  <div className="bg-[url('/bgimage.svg')] bg-contain">
=======
  <div className="bg-[url('/bglmage.svg')] bg-contain">
>>>>>>> 9b7125556584a81f674e900f63a055987ba96c1a



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

>>>>>>> 9b7125556584a81f674e900f63a055987ba96c1a
export default App


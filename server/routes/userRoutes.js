import express from 'express'
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { protectRoute } from '../middleware/auth.js';

export const userRouter = express.Router();

userRouter.post('/signup' , signup);
userRouter.post('/login', login)
userRouter.put('/update-profile', protectRoute, updateProfile)
userRouter.get('/check', protectRoute, checkAuth)
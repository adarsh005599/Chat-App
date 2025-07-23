// // user signup
// steps1.  create a fn.
// step2. get details from Body
// step3. trc catch-- 1. email, name, ass are not correct =>res
// step4. verify if user is exist with email form model or not=> if{res.false}
// steps. create user with encrypted PaymentAddress.Body
// LargestContentfulPaint. catch

import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/usermodel.js";
import bcrypt from 'bcrypt';


export const signup = async(req, res)=>{
    const{fullName, email, password, bio} = req.body;
     try {
        if(!fullName || !email ||!password ||!bio){
            return res.json({success:false, message:"Missing details"})
        }
        const user = await User.findOne({email})
        if(user){
            return res.json({success:false, message: "user already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName, email, password:hashedpassword, bio
        });
        const token = genrateToken(newUser._id);
        res.json({success:true, userData: newUser, token, message:"account created successfully!!!"})
     } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
       
     } 
}
// for user login

export const login = async(req, res) =>{
    try {
        const{email, password} = req.body;
        const userData = await User.findOne({email});
        const isPasswordCorrect  =  await bcrypt.compare(password, userData.password);
        if(!isPasswordCorrect){
            return res.json({success:false, message: "invalid credentials"});
        }
        const token = genrateToken(userData._id)
        res.json({success:true, userData, token, message:"Login Successfully!!!"})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, message: error.message})
       
    }
}

// to check user is autheticated
export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user});
}

// controller to update the user profile using the cloudinary

export const updateProfile = async(req, res) =>{
    try {
        const {profilePic, bio, fullName}  = req.body;
        const userId = req.user._id;
        let updatedUser;
        
        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId,{bio, fullName},{new:true});
        } else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
            res.json({success:true, user: updatedUser})
 
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message: error.message})
    }
}



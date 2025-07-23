import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{type:String, lowercase:true, required: true, unique:true},
    fullName:{type: String, require: true},
    password:{type: String, required: true, minlength:6},
    profilePic:{type:String, default:""},
    bio:{type:String},

}, {timestamps:true});
const User = mongoose.model("User", userSchema)
export default User;
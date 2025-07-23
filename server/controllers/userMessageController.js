import User from '../models/usermodel.js';
import Message from '../models/userMessage.js';
import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from '../server.js';

// get all users except the lodded in user
// get all users except the logged-in user
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fix: User.find not User()
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // unseen message counter
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    // Get online userIds from socket map
    const onlineUserIds = Object.keys(userSocketMap);

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
      onlineUsers: onlineUserIds,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// get all message from selected user


export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // sort by time (oldest first)

    // Mark all messages from selected user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ success: true, message: messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


 // api to mark message as seen  using message id

export const markMessageAsSeen = async (req,res)=>{
    try {
        const {id} =  req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
    }
}
// send message to user
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "receiverId is required" });
    }

    let imageUrl = null;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // Emit the new message to the receiver's socket if online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.error("Send message error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io"; // ✅ correct import
import { connetdb } from './lib/db.js';
import { userRouter } from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

const app  = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
});

// store online users
export const userSocketMap = {};  //{userId, socketId}
// socket.io connection hendler
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Conected", userId);
    if(userId) userSocketMap[userId] = socket.id;

    // emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on("disconnect", () =>{
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


// midll
app.use(express.json ({limit: "4mb"}))
app.use(cors())

// routes setup
app.use("/api/status", (req,res)=>res.send("server is Live now!!"));
app.use('/api/auth', userRouter)
app.use("/api/messages", messageRouter)

//connect to db
await connetdb();

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log("server is running on PORT: " + PORT));



export default server;

// import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { server } from './index.js';
const socketServer = server.listen(8000,()=>{
    console.log("server listeng on port 8000")
})

import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { MessageModel } from './models/Message.js';
import { UserModel } from './models/User.js';


const io = new Server(socketServer,{
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
  }
})


io.use(async (socket,next)=>{
    try{
        const token = socket.handshake.query.token;
        jwt.verify(token,"asxdsdv",(err,payload)=>{
            if(err){
                console.log(err,"error")
                return json({message:"you must login first"})
            }else{
                console.log(payload,"payload")
                socket.existingUserId= payload.id
            next();
        }
            
        })
    }catch(e){

    }
})

io.on('connection',(socket) =>{
    console.log("connected to socket ",socket.existingUserId);

    socket.on('disconnect', ()=>{
        console.log("disconnected from socket")
    })
    socket.on("joinRoom",async ({chatroomId})=>{
        socket.join(chatroomId);
        const prevMessages = await MessageModel.findById({chatroomId: ObjectId(chatroomId)});
        console.log(prevMessages,"previous messages")
        console.log("user joined the room: "+chatroomId);
    })

    socket.on("leaveRoom",({chatroomId})=>{
        socket.leave(chatroomId);
        console.log("user left the room: "+chatroomId);
    })
    socket.on("chatroomMessage",async ({chatroomId,message})=>{
        if(message.trim().length>0){
            console.log(socket.existingUserId,'socket.existingUserId')
            const user = await UserModel.findOne({_id:socket.existingUserId})
            console.log(user,"user")
            const _message = new MessageModel({
                chatroomId,
                userId:socket.existingUserId,
                message,
            })
            io.to(chatroomId).emit("newMessage",{
                message,
                name:user.name,
                userId:socket.existingUserId,
            })
            await _message.save();
        }
    })
})
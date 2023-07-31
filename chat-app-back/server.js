// import mongoose from 'mongoose';
import { server } from './index.js';

import { isOverLimit } from "./utils/index.js";

const socketServer = server.listen(8000,()=>{
    console.log("server listeng on port 8000")
})

import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { MessageModel } from './models/Message.js';
import { UserModel } from './models/User.js';


import { createClient } from 'redis';
// redis connection
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();


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


io.on('connection',async (socket) =>{
    console.log("connected to socket ",socket.existingUserId);
    
    socket.on('disconnect', ()=>{
        console.log("disconnected from socket")
    })
    socket.on("joinRoom",async ({chatroomId})=>{
        socket.join(chatroomId);
        console.log("user joined the room: "+chatroomId);

        // retrieving the message from redis
        const messagesLen = await client.LLEN("messages");
        
        // displaying last 10 messages from redis
        const existingMessage = await client.LRANGE("messages", `${messagesLen-10}`, "-1");

        // emitting the retrieved message to client
        let data =[];
        existingMessage.map(x => {
                const usernameMessage = x.split(":");
                const redisUserId = usernameMessage[0];
                const redisUsername = usernameMessage[1];
                const redisMessage = usernameMessage[2];
                data.push({
                    userId: redisUserId,
                    username: redisUsername,
                    userMessage: redisMessage
                })
            });
            socket.emit("prevMessage", data);
    })

    socket.on("leaveRoom",({chatroomId})=>{
        socket.leave(chatroomId);
        console.log("user left the room: "+chatroomId);
    })
    
    socket.on("chatroomMessage", async ({chatroomId,message})=>{
        if(message.trim().length>0){
            let checkLimit = await isOverLimit(client,socket.existingUserId);
            if(checkLimit){
                console.log("out of limit")
                socket.emit("limitExceeded",{
                    error:"too many messages try again later",
                })
            }

            const user = await UserModel.findOne({_id:socket.existingUserId})

            if(!checkLimit){
                console.log("in limit")
                // save messages into redis as array which contains userId, username, message
                client.RPUSH("messages",`${user.id}:${user.name}:${message}`);
                console.log(message,"messages")
                // save messages in mongodb
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
        }
    })
})
import { ChatRoomModel } from '../models/ChatRoom.js';

export const createChatroom = async (req,res) =>{
    const { name } = req.body;
    console.log("from create chat room")
    try{
        if(!name){
            throw "chat room name is required"
        }
    
        const chatroomExists = await ChatRoomModel.findOne({name:name});
        if(chatroomExists){
            throw `chatroom ${chatroomExists.name} already exists`
        }
    
        const chatroom = new ChatRoomModel({name});
        await chatroom.save();
        return res.status(200).send({message:`chatroom successfully created`})
    }catch(e){
        return e;
    }
    
}

export const getAllChatrooms = async (req, res) =>{
    console.log("from chatrooms")
    console.log(req._id)
    const chatroom = await ChatRoomModel.find({})
    res.json(chatroom)
}
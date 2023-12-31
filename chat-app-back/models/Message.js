import mongoose from 'mongoose';
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    chatroomId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'chatroom'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    message:{
        type:String,
        required:'message is required'
    }
},{timestamps:true});

export const MessageModel = mongoose.model('message',MessageSchema);
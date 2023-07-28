import mongoose from 'mongoose';
const Schema = mongoose.Schema

const ChatRoomSchema = new Schema({
    name:{
        type:String,
        required:true,
    }
},{timestamps:true});

export const ChatRoomModel = mongoose.model('chat',ChatRoomSchema);
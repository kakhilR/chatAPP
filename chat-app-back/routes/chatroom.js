import express from 'express';
import { createChatroom, getAllChatrooms } from '../controllers/chatroomController.js';
import { userAuth } from '../middlewares/index.js';

const routes = express.Router();

routes.get('/chat-rooms',userAuth, getAllChatrooms);
routes.post('/create-chat-room',userAuth, createChatroom)



export const chatroomRoutes = routes;
import cors from 'cors';
import express from 'express';
import { databaseConnection } from './models/connection.js';
import { chatroomRoutes } from './routes/chatRoom.js';
import { userRoutes } from './routes/user.js';
const app = express();

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors());

await databaseConnection();

// app.use('/',(req,res)=>{
//     res.send("hello")
// })

app.use('/api',userRoutes);
app.use('/api',chatroomRoutes);

export const server = app;
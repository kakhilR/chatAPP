import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { userAuth } from '../middlewares/index.js';

const routes = express.Router();

routes.post('/register', registerUser);
routes.post('/login', loginUser)
const test = ()=>{
    console.log("test validation");
}

routes.get('/test',userAuth,test)

export const userRoutes = routes;
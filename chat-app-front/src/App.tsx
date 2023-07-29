import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Chatroom from './pages/Chatroom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

interface AppProps{
  [key:string]: any;
}

const App : React.FC<AppProps> = () => {
  const [socket, setSocket] = useState(null);

  const setupSocket = ()=>{
    const token = localStorage.getItem("token");
    if(token!==null && !socket){
      const _socket:any = io("http://localhost:8000",{
        query:{
          token:token
        }
      })

      _socket.on("disconnect",()=>{
        setSocket(null);
        setTimeout(setupSocket,3000);
      })

      _socket.on("connect",()=>{
        console.log("socket connected")
      });

      setSocket(_socket);
    }
  }

  useEffect(()=>{
    setupSocket();
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={ <Login setupSocket={setupSocket}/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard socket={socket}/>} />
        <Route path='/chat-room/:id' element={<Chatroom socket={socket}/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

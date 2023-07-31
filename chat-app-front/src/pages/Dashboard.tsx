import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { toast, TypeOptions } from 'react-toastify';

interface DashboardProps{
    [key:string]: any;
}

const Dashboard: React.FC<DashboardProps> = (props)=>{
    const createChatroomRef:any = React.createRef();
    
    const [chatrooms,setChatrooms] = useState([]);

    const notify = (text: string, type: TypeOptions) =>
    toast(text, {
      type,
    });

    console.log("Bearer "+localStorage.getItem('token')," token")
    const saveChatroom = ()=>{
        const name = createChatroomRef.current.value;
        axios.post('http://localhost:8000/api/create-chat-room',{
            headers: {
                Authorization: "Bearer "+localStorage.getItem('token'),
            },
            name
        }).then((res)=>{
            if(res.data.message==='chatroom successfully created'){
                getChatrooms();
                notify("chatrooms successfully created",res.data.message)
            }else{
                
                window.alert('Error creating chatroom')
            }
        }).catch(e=>{
            console.log(e,"error from catch")
        })
    }

    const getChatrooms = () =>{
        axios.get('http://localhost:8000/api/chat-rooms',{
            headers: {
                Authorization:"Bearer "+localStorage.getItem('token'),
            },
        }).then((res)=>{
            setChatrooms(res.data);
        }).catch(err=>{
            console.log(err);
            // setTimeout(getChatrooms,3000);
        })
    }

    useEffect(()=>{
        getChatrooms();
    },[]);

    console.log(chatrooms,"chat-rooms")
    return <div className="card">
    <div className="classHeader">Chat Rooms</div>
    <div className="cardBody">
        <div className="inputGroup">
        <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" placeholder="enter chat room name" ref={createChatroomRef}/>
        </div>
        <button onClick={saveChatroom}>Create Chatroom</button>
        <div className="chatrooms">
            {chatrooms ? chatrooms.map((chatroom:any)=>{
                return (<div key={chatroom._id} className="chatroom">
                    <div>{chatroom.name}</div>
                    <Link to={"/chat-room/"+chatroom._id}>
                    <div className="join" >Join</div>
                    </Link>
                </div>)
            }) :null}
        </div>
    </div>
</div>
}

export default Dashboard

{/* <div key={chatroom._id} className="chatroom">
<div>{chatroom.name}</div>
<Link to={"/chat-room"+chatroom._id}>
<div className="join">Join</div>
</Link>
</div> */}
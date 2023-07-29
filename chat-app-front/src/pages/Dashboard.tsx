import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface DashboardProps{
    [key:string]: any;
}
console.log("Bearer "+localStorage.getItem('token'))
const Dashboard: React.FC<DashboardProps> = (props)=>{
    // const createChatroomRef:any = createRef();
    // const name = createChatroomRef.current.value;
    
    const [chatrooms,setChatrooms] = useState([]);

    const saveChatroom = ()=>{
        axios.post('http://localhost:8000/api/create-chat-room',{
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer "+localStorage.getItem('token'),
            },
            name
        }).then((res)=>{
            if(res.data.message==='chatroom successfully created'){
                // getChatrooms();
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
            setTimeout(getChatrooms,3000);
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
            <input type="text" name="chatroom" id="chatroom" placeholder="enter chat room name"/>
        </div>
        <button onClick={saveChatroom}>Create Chatroom</button>
        <div className="chatrooms">
            {chatrooms ? chatrooms.map((chatroom:any)=>{
                return (<div key={chatroom._id} className="chatroom">
                    <div>{chatroom.name}</div>
                    <Link to={"/chat-room/"+chatroom._id}>
                    <div className="join">Join</div>
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
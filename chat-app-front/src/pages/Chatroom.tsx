import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
interface ChatroomProps{
    [key:string]: any;
}

const Chatroom: React.FC<ChatroomProps> = ({socket})=>{
    const params = useParams();
    const chatroomId = params.id;
    console.log(chatroomId,"from chatroom")
    const [messages,setMessages]:any = useState([])
    const [userId,setUserId] = useState();

    const messageRef:any = useRef();

    const sendMessage = () =>{
        if(socket){
            socket.emit("chatroomMessage",{
                chatroomId,
                message:messageRef.current.value,
            })

            messageRef.current.value = "";
        }
    }

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            const payload = JSON.parse(atob(token.split(".")[1]))
            setUserId(payload.id);
        }
        if(socket){
            socket.on("newMessage",(message:any)=>{
                setMessages([...messages,message])
            })
        }
    },[messages])

    useEffect(()=>{
        if(socket){
            socket.emit("joinRoom",{
                chatroomId,
            })
        }

        return ()=>{
            if(socket){
                socket.emit("leaveRoom",{
                    chatroomId,
                })
            }
        }
    },[])
    
    return (
        <div className="chatroomPage">
            <div className="chatroomSection">
                <div className="cardHeader">Chatroom Name</div>
                <div className="chatroomContent">
                    {messages ? messages.map((message:any)=>{
                       return ( <div key ={chatroomId} className="message">
                                <span className={userId === message.userId ? "ownMessage":"otherMessage"}>
                                    {message.name}:
                                </span>
                                {message.message}
                            </div>)
                    }):null }
                    <div className="chatroomActions">
                        <div>
                            <input type="text" name="message" placeholder="type your message" ref ={messageRef}/>
                        </div>
                        <div>
                            <button className="join" onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatroom;
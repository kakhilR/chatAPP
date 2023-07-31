import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, TypeOptions } from 'react-toastify';
interface ChatroomProps{
    [key:string]: any;
}

const Chatroom: React.FC<ChatroomProps> = ({socket})=>{
    const params = useParams();
    const chatroomId = params.id;
    console.log(chatroomId,"from chatroom")
    const [messages,setMessages]:any = useState([])
    const [userId,setUserId] = useState();
    const [prevMessages,setPrevMessages]: any = useState([]);

    const messageRef:any = useRef();

    const notify = (text: string, type: TypeOptions) => toast(text, {
        position:'top-right',
        type,
    });

    useEffect(()=>{
        if(socket){
            socket.on("limitExceeded",async (error: any)=>{
                console.log("Limit exceeded", error);
                await notify(error,"error");
                window.alert("Limit exceeded");
            })
        }
    },[])
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
            socket.on("prevMessage",(clientMessage:any)=>{
                console.log("prevMessage",clientMessage)
                setPrevMessages(clientMessage);
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
                <div className="cardHeader">Chatroom</div>

                <div className="chatroomContent">
                {prevMessages &&
                    prevMessages.map((m:any) => (
                        <div style={{ display: "flex" }} key={m.userId}>
                            
                        <span style={{ marginLeft:"0.5rem", marginRight:"0.3rem" }} className={userId === m.userId ? "ownMessage":"otherMessage"}>
                            {m.username}:
                        </span>
                        {m.userMessage}
                        </div>
                    ))}
                    {messages ? messages.map((message:any)=>{
                        return ( <div key ={chatroomId} className="message">
                                <span className={userId === message.userId ? "ownMessage":"otherMessage"}>
                                    {message.name}:
                                </span>
                                {message.message}
                            </div>)
                    }):null }
                </div>
            </div>
            <div className="chatroomActions">
                        <div>
                            <input type="text" name="message" placeholder="type your message" ref ={messageRef}/>
                        </div>
                        <div>
                            <button className="join" onClick={sendMessage}>Send</button>
                        </div>
                    </div>
        </div>
    )
}

export default Chatroom;
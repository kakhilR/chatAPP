import axios from "axios";
import React, { createRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, TypeOptions } from 'react-toastify';

interface LoginProps{
    [key:string]: any;
}


const Login: React.FC<LoginProps> = (props)=>{
    const emailRef:any = createRef();
    const passwordRef:any = createRef();
    const history = useNavigate ();

    const notify = (text: string, type: TypeOptions) => toast(text, {
        position:'top-right',
        type,
    });

    const loginUser=()=>{
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post('http://localhost:8000/api/login',{
            email, password
        }).then(res=>{
            console.log(res)
            if(res.data._message==='user validation failed'){
                console.log(res,"validation failed")
                notify(res.data.message, "error")
            }else{
                notify(res.data.message,"success")
                console.log(res,"res")
                localStorage.setItem('token',res.data.data.token)
                history('/dashboard')
                props.setupSocket();
                
            }
        }).catch(err=>{
            console.log(err,"err")
            notify(err.message,"success")
        })
    }
    return <div className="card">
        <div className="classHeader">Login</div>
        <div className="cardBody">
            <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="abc@example.com" ref={emailRef}/>
            </div>
            <div className="inputGroup">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="your password" ref={passwordRef}/>
            </div>
            <button onClick={loginUser}>Login</button>
        </div>
    </div>
}

export default Login
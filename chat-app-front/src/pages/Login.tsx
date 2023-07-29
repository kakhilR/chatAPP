import axios from "axios";
import React, { createRef } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps{
    [key:string]: any;
}

const Login: React.FC<LoginProps> = (props)=>{
    const emailRef:any = createRef();
    const passwordRef:any = createRef();
    const history = useNavigate ();
    const loginUser=()=>{
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios.post('http://localhost:8000/api/login',{
            email, password
        }).then(res=>{
            console.log(res)
            if(res.data._message==='user validation failed'){
                window.alert('please check all the fields and retry')
            }else{
                localStorage.setItem('token',res.data.data.token)
                window.alert(`message:${res.data.message}`);
                history('/dashboard')
                props.setupSocket();
                
            }
        }).catch(err=>{
            console.log(err)
            window.alert(`errors:${err.data.errors}`);
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
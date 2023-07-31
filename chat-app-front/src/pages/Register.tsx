import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, TypeOptions } from 'react-toastify';

interface RegisterProps {
    [key:string]: any;
}

const Register: React.FC<RegisterProps> = (props)=>{
    const nameRef:any = React.createRef();
    const emailRef:any = React.createRef();
    const passwordRef:any = React.createRef();
    const history = useNavigate ();
    
    const saveUser=()=>{
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const notify = (text: string, type: TypeOptions) => toast(text, {
            position:'top-right',
            type,
        });

        axios.post('http://localhost:8000/api/register',{
            name, email, password
        }).then(res=>{
            console.log(res)
            if(res.data._message==='user validation failed'){
                notify(res.data.message,"error")
            }else{
                notify(res.data.message,"success")
                history('/login')
            }
        }).catch(err=>{
            console.log(err)
            notify(err.message,"success")
        })
    }
    return <div className="card">
    <div className="classHeader">Register</div>
    <div className="cardBody">
    <div className="inputGroup">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" placeholder="Enter your name" ref={nameRef}/>
        </div>
        <div className="inputGroup">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder="abc@example.com" ref={emailRef}/>
        </div>
        <div className="inputGroup">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" placeholder="your password" ref={passwordRef}/>
        </div>
        <button onClick ={saveUser}>Register</button>
    </div>
</div>
}

export default Register
import React from 'react';
import { useNavigate } from "react-router-dom";

interface HomeProps {
    [key:string]: any;
}

const Home: React.FC<HomeProps> =()=>{

    const history = useNavigate();
    React.useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token==null) {
            history('/login')
        }else{
            history('/dashboard')
        }
    })
    return <div>Home</div>;
}

export default Home;
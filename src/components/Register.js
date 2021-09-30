import React from 'react';
import "./Register.css"
import { useState,useRef } from 'react';
import {Cancel, Room}from '@material-ui/icons';
import axios from 'axios';
const Register = ({setShowRegister}) => {


 const [success,setSuccess] = useState(false)
 const [error,setError] = useState(false)
 const nameRef = useRef()
 const emailRef = useRef()
 const passwordRef = useRef()



const handleSubmit =async (e) =>{
    e.preventDefault();
    const newUser  ={
        username : nameRef.current.value,
      email : emailRef.current.value,
        password : passwordRef.current.value
    };
        try{
            await axios.post("/users/register",newUser);
            setError(false);
            setSuccess(true);
        

        }catch(err){
            setError(true)
        }

        
}


    return (
        <div className="registerContainer">
            <div className="logo">
                <Room/>
               LamaPin
            </div>
            <form onSubmit ={handleSubmit}>

          <input type="text" placeholder ="username" ref={nameRef}></input>
         <input type = "email" placeholder ="example@gmail.com" ref={emailRef}></input>

         <input type="password" placeholder ="enter your password" ref={passwordRef}></input>
    <button className="registerBtn">Register</button>

{success && 

    <span className="success">Register complete.You can LogIn now</span>
}
 {error &&   <span className="failure">Something went wrongI</span>}
            </form>

    <Cancel className="registerCancel" onClick={()=>setShowRegister(false)} />
        </div>
    );
};

export default Register;
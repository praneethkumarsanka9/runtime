import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";

function Register(){
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message, setMessage] = useState("");
    async function handle(e){
        e.preventDefault();
        try{
            const result = await axios.post("http://localhost:3000/register",{username,email,password});
            console.log(result.data.message);
            setMessage(result.data.message);
            setUsername("");
            setEmail("");
            setPassword("");

        }catch(err){
            console.log(err.response.data);
        }
    }

    return(
        <div>
           <form onSubmit={handle}>
            <input
               type="text"
               placeholder="Username"
               value = {username}
               onChange={(e)=>setUsername(e.target.value)}
            />
            <br/> <br/>
            <input
               type="email"
               placeholder="Email"
               value = {email}
               onChange={(e)=>setEmail(e.target.value)}
            />
            <br/> <br/>
            <input
               type="password"
               placeholder="Password"
               value = {password}
               onChange={(e)=>setPassword(e.target.value)}
            />
            <br/> <br/>
            <button type="submit">
                Register
            </button>
        </form>
        <Link to="/login">
            Already have an account? Login
        </Link>
        <h4>{message}</h4>
        </div>
    )
}

export default Register;
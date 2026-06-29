import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register(){
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    async function handle(e){
        e.preventDefault();
        try{
            const result = await axios.post("http://localhost:3000/register",{username,email,password});
            setUsername("");
            setEmail("");
            setPassword("");
            setMessage(result.data.message);
            console.log("success");
            setTimeout(() => {
                navigate("/login");
            },2000);
        }catch(err){
            setUsername("");
            setEmail("");
            setPassword("");
            console.log(err.response.data);
            setMessage(err.response.data.message);
        }
    }

    return(
        
        <div id="box">
               <div id="contents">
                  <div id="matter">
                    <img id="logo" src={logo} alt="Logo" />
                    <form onSubmit={handle}>
                  <div>
                    <label>Username</label>
                    <input
                  type="text"
                  placeholder=""
                  className="input"
                  value = {username}
                  onChange={(e)=>setUsername(e.target.value)}
                  />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                    type="email"
                    placeholder=""
                    className="input"
                    value = {email}
                    onChange={(e)=>setEmail(e.target.value)}
                  />
                  </div>
        
                  <div>
                    <label>Password</label>
                    <input
                     type="password"
                     placeholder=""
                     className="input"
                     value={password}
                     onChange={(e)=>setPassword(e.target.value)}
                  />
                  </div>
                  <br/><br/>
                  <h5 id="msg">{message}</h5>
                  <button type="submit" id="btn">
                    Register
                  </button>
               </form>
               <Link to="/login" id="link">
                  Already have an account? Login
               </Link>
                  </div>
               </div>
               </div>
    )
}

export default Register;
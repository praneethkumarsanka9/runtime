import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.jpg.jpeg";
function Login(){
    const[email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[message,setMessage] = useState("");
    const navigate = useNavigate();

    async function handle(e){
      e.preventDefault();
      try{
         const res = await axios.post("http://localhost:3000/login",{email,password});
         localStorage.setItem("token",res.data.token);
         navigate("/problems",{replace: true});
      }catch(err){
        console.log(err.response.data);
        setMessage(err.response.data.message);
        setEmail("");
        setPassword("");
      }
    }

    return(
       <div id="box">
       <div id="contents">
          <div id="matter">
            <img id="logo" src={logo} alt="Logo" />
            <form onSubmit={handle}>
          <div id="em">
            <label>Email</label>
            <input
             type="email"
             placeholder=""
             value={email}
             className="input"
             onChange={(e)=>setEmail(e.target.value)}
          />
          </div>
          

          <div id="pa">
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
            Login
          </button>
       </form>
       <Link to="/register" id="link">
           Don't have an account? Register
       </Link>
          </div>
       </div>
       </div>
    );
}
export default Login;
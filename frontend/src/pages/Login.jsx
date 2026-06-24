import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Login(){
    const[email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[message,setMessage] = useState("");
    const navigate = useNavigate();

    async function handle(e){
      e.preventDefault();
      try{
         const res = await axios.post("http://localhost:3000/login",{email,password});
         navigate("/register",{replace: true});
      }catch(err){
        console.log(err.response.data);
      }
    }

    return(
       <div>
          <form onSubmit={handle}>
          <input
             type="email"
             placeholder="Email"
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
          />
          <br/><br/>

          <input
             type="password"
             placeholder="Password"
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
          />
          <br/><br/>

          <button type="submit">
            Login
          </button>
       </form>
       <Link to="/register">
           Don't have an account? Register
       </Link>
       <h6>{message}</h6>
       </div>
    );
}
export default Login;
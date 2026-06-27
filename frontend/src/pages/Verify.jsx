import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

function Verify(){
    const { token } = useParams();
    const [message , setMessage] = useState("Verifying...");
    const called = useRef(false);

    useEffect(()=>{
        if (called.current) return;
        called.current = true;

        verifyUser();
    },[]); 
    
    async function verifyUser(){
        try{
            const res = await axios.get(
                `http://localhost:3000/verify/${token}`
            );
            setMessage(res.data.message);
        }catch(err){
            setMessage(err.response.data.message);
        }
    }

    return(
        <div id="box">
            <div>
                <h2>{message}</h2>
            </div>
        </div>
    );
}

export default Verify;
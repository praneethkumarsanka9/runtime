import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import "./ProblemDetail.css"
import logo from "../assets/logo.png";
import CodeEditor from "../compnents/CodeEditor";

function ProblemDetail(){
    const { id } = useParams();
    const [problem,setProblem] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblem();
    },[]);

    async function fetchProblem(){
        try{
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `http://localhost:3000/problems/${id}`,{
                    headers:{
                        Authorization: token
                    }
                }
            );

            setProblem(res.data);

        }catch(err){
            console.log(err.response?.data);
        }finally{
            setTimeout(() => {
                setLoading(false);
            }, 3500);
        }
    }

    if (loading) {
    return (
        <div className="loader-page">
    <div className="runtime-loader">

        <div className="ring-wrapper">
            <div className="loader-ring"></div>
        </div>

        <div className="loader-logo">
            <span>RUNTIME</span>
        </div>

    </div>
</div>
    );
    }   

    return(
        <div>
            <img id="logo-problemDetail" src={logo} alt="Logo" onClick={()=>navigate("/problems")}/>
            <div className="problem-detail-container">
            <h1>{problem.title}</h1>
            <h3>Difficulty: {problem.difficulty}</h3>
            <h2>Description</h2>
            <p>{problem.description}</p>
            <h2>Solve Here</h2>
            <CodeEditor/>
            <div className="editor-actions">
            <button className="run-btn">Run</button>
            <button className="submit-btn">Submit</button>
            </div>
        </div>
        </div>
    );
}

export default ProblemDetail;
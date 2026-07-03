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
    const [input,setInput] = useState("");
    const [output,setOutput] = useState("Click run to execute your code");
    const [code, setCode] = useState(
        `#include <bits/stdc++.h>
using namespace std;
int main(){

    return 0;
}`
    );
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblem();
    },[]);

    async function runCode(){
        try{
            setOutput("Running...")
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:3000/run",{
                code,input
            },{
                headers:{
                    Authorization: token
                }
            });

            setOutput(res.data.output);
        }catch(err){
            console.log(err.response?.data);
            setOutput("Something went wrong");
        }
    }

    async function submitCode(){
        setOutput("Evaluating your code...");
        const problemId = id;
        try{
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:3000/submit",{
                problemId,code
            },{
                headers:{
                    Authorization: token
                }
            });
            alert(res.data.verdict);
            setOutput(res.data.verdict);
        }catch(err){
            console.log(err.response?.data);
            setOutput("Something went wrong");
        }
    }

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
            <div className="problem-header">
                <img id="logo-problemDetail" src={logo} alt="Logo" onClick={()=>navigate("/problems")}/>
                <button id="back-problemDetail" onClick={()=>navigate("/problems")}>Back</button>
            </div>
            <div className="problem-detail-container">
            <h1>{problem.title}</h1>
            <h3>Difficulty: {problem.difficulty}</h3>
            <h2>Description</h2>
            <p>{problem.description}</p>
            <h2>Solve Here</h2>
            <CodeEditor code={code} setCode = {setCode}/>
            <h3 className="section-title">Input:</h3>
            <textarea
                className="custom-input"
                placeholder="input here..."
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
            <div className="editor-actions">
            <button className="run-btn" onClick={runCode}>Run</button>
            <button className="submit-btn" onClick={submitCode}>Submit</button>
            </div>
            <h3 className="section-title">Output:</h3>
            <div className="output-box">
                <pre>{output}</pre>
            </div>
        </div>
        </div>
    )
}

export default ProblemDetail;
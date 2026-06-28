import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";


function ProblemDetail(){
    const { id } = useParams();
    const [problem,setProblem] = useState("");

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
        }
    }

    if(!problem){
        return <h3>Loading...</h3>
    }    

    return(
        <div>
            <h1>{problem.title}</h1>
            <p>{problem.description}</p>
            <h3>Difficulty: {problem.difficulty}</h3>
        </div>
    );
}

export default ProblemDetail;
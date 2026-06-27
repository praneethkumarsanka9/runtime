import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Problems.css";
function Problems(){
    const [problems,setProblems] = useState([]);
    const navigate = useNavigate();

    function logout(){
        localStorage.removeItem("token");
        navigate("/login");
    }
    
    useEffect(()=>{
        fetchProblems();
    },[]);
 
    async function fetchProblems(){
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "http://localhost:3000/problems",{
                    headers:{
                        Authorization: `${token}`
                    }
                }
            );
            setProblems(res.data);
        }catch(err){
            console.log(err.response?.data);
        }
    }

    return(
        <div className="problem-container">
            <h1>
                Problems
            </h1>
            {
                problems.map((problem) => (
                    <div key={problem._id} className="problem-card"
                    onClick={() => navigate(`/problems/${problem._id}`)}>
                        <h2>{problem.title}</h2>
                        <p>{problem.difficulty}</p>
                    </div>
                ))
            }
            <button className="logout-btn" onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Problems;
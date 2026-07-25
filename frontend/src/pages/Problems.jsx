import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Problems.css";
import logo from "../assets/logo.png";
import "./Loader.css"
function Problems(){
    const [problems,setProblems] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [complete, setComplete] = useState([]);
    const solved = complete.length;
    const total = problems.length;
    const percent = total === 0? 0 : (solved/total)*100;
    const [role,setRole] = useState("");
    const API_URL = "http://15.206.166.192/api";

    function logout(){
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function markDone(id){
        try{
            await axios.post(`${API_URL}/complete`,
                {id},
            {
                withCredentials: true
            }
            )
            setComplete(prev => {
                if(prev.includes(id)){
                    return prev;
                }
                return [...prev, id];
            });
        }catch(err){
            console.log(err.response?.data);
        }
    }

    useEffect(()=>{
        fetchProblems();
    },[]);
 
    async function fetchProblems(){
        try{
            const res = await axios.get(
                `${API_URL}/problems`,
            {
                withCredentials: true
            }
            );
            setProblems(res.data.problems);
            setComplete(res.data.completed);
            setRole(res.data.role);
        }catch(err){
            console.log(err.response?.data);
        }finally{
            setTimeout(()=>{
               setLoading(false); 
            },3500);
        }
    }

    async function deleteProblem(id){
        try{
            await axios.delete(`${API_URL}/problems/${id}`,
            {
                withCredentials: true
            });
            setProblems(prev => prev.filter(p => p._id !== id));
            setComplete(prev => prev.filter(pid => pid !== id));
        }catch(err){
            console.log(err.response?.data);
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
            <img id="logo-problemDetail" src={logo} alt="Logo"/>
            <div className="problem-container">
            <div className="progress-container">
                <h3>Your Progress</h3>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{width: `${percent}%`}}
                    ></div>
                </div>
                <p>{complete.length} / {problems.length} Problems solved</p>
            </div>
            <h1>
                Problems
            </h1>
            {
                problems.map((problem) => (
                    <div key={problem._id} className="problem-card" onClick={() => navigate(`/problems/${problem._id}`)}>
                        <div className="problem-info">
                            <h2>{problem.title}</h2>
                            <p>{problem.difficulty}</p>
                        </div>
                        <div>
                        {role === "admin" &&(
                            <button className="pending-btn" id="edit-btn" onClick={(e)=>{
                                e.stopPropagation();
                                navigate(`/edit-problem/${problem._id}`)
                            }}>
                                Edit
                            </button>
                        )}
                        {role === "admin" &&(
                            <button className="pending-btn" id="delete-btn" onClick={(e)=>{
                                e.stopPropagation();
                                deleteProblem(problem._id);
                            }}>
                                Delete
                            </button>
                        )}
                        <button
                            className={complete.includes(problem._id) ? "done-btn" : "pending-btn"}
                            onClick={(e)=>{
                                e.stopPropagation();
                                markDone(problem._id);
                            }}
                        >
                        {complete.includes(problem._id)
                            ? "Completed"
                            : "Mark Done"}
                        </button>
                        </div>

                    </div>
                ))
            }
            <div className="bottom-buttons">
            {role === "admin" &&(
                <button
                    className="add-problem-btn"
                    onClick={() => navigate("/add-problem")}
                >
                    Add Problem
                </button>
            )}
            <button className="logout-btn" onClick={logout}>
                Logout
            </button>
            </div>
        </div>
        </div>
    );
}

export default Problems;
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditProblem(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [title,setTitle] = useState("");
    const [difficulty,setDifficulty] = useState("");
    const [description, setDescription] = useState("");
    const [testcases, setTestcases] = useState("");
    const API_URL = "http://15.206.166.192/api";
    async function getProblem(){
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${API_URL}/problems/${id}`,{
                    headers:{
                        Authorization: token
                    }
                }
            );
            setTitle(res.data.title);
            setDifficulty(res.data.difficulty);
            setDescription(res.data.description);
            setTestcases(JSON.stringify(res.data.testcases, null, 2));
        }catch(err){
            console.log(err.response?.data);
        }
    }
    async function editData(){
        try{
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_URL}/problems/${id}`,
                {
                    title,
                    difficulty,
                    description,
                    testcases: JSON.parse(testcases)
                },
                {
                    headers:{
                        Authorization: token
                    }
                }
            );
            alert("Problem Edited");
            navigate("/problems");
        }catch(err){
            console.log(err.response?.data);
        }
    }
useEffect(() => {
    getProblem();
}, [id]);
return (
    <div className="add-problem-container">
        <h1>Edit Problem</h1>
        <input
            type="text"
            placeholder={title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
        >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
        </select>

        <textarea
            placeholder={description}
            rows="8"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />

        <textarea
            placeholder={testcases}
            rows="10"
            value={testcases}
            onChange={(e) => setTestcases(e.target.value)}
        />

        <button onClick={editData}>
            Save Changes
        </button>
    </div>
);
}

export default EditProblem;
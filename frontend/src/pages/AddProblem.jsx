import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProblem.css";

function AddProblem(){
    const navigate = useNavigate();

    const [title,setTitle] = useState("");
    const [difficulty,setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [testcases, setTestcases] = useState("");
    const API_URL = "http://15.206.166.192/api";

    async function addProblem(){
        try{
            await axios.post(
                `${API_URL}/problems`,
                {
                    title,
                    difficulty,
                    description,
                    testcases: JSON.parse(testcases)
                },
                {
                    withCredentials: true
                }
            );

            alert("Problem Added");
            navigate("/problems");
        }catch(err){
            console.log(err.response?.data);
        }
    }


return (
    <div className="add-problem-container">
        <h1>Add Problem</h1>
        <input
            type="text"
            placeholder="Title"
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
            placeholder="Description"
            rows="8"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />

        <textarea
            placeholder={`[
  {
    "input": "1 2",
    "output": "3"
  }
]`}
            rows="10"
            value={testcases}
            onChange={(e) => setTestcases(e.target.value)}
        />

        <button onClick={addProblem}>
            Add Problem
        </button>
    </div>
);
}

export default AddProblem;
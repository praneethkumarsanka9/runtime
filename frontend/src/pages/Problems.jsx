import { useNavigate } from "react-router-dom";
function Problems(){
    const navigate = useNavigate();

    function logout(){
        localStorage.removeItem("token");
        navigate("/login");
    }

    return(
        <div>
            <h4>
                Problems Page
            </h4>
            <button onClick={logout}>
                Logout
            </button>
        </div>
    );
}

export default Problems;
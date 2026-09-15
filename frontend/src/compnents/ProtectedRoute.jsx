import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({children}){
    const [loading,setLoading] = useState(true);
    const [authenticated,setAuthenticated] = useState(false);
    const API_URL = "http://65.0.93.233/api";

    useEffect(()=>{
        async function checkAuth(){
            try{
                await axios.get(`${API_URL}/auth/me`,{
                    withCredentials: true
                });

                setAuthenticated(true);
            }catch(err){
                setAuthenticated(false);
            }finally{
                setLoading(false);
            }
        }

        checkAuth();
    },[]);

    const msg = "Loading :)";

    if(loading){
        return <div>{msg}</div>;
    }

    if(!authenticated){
        return <Navigate to="/login" replace/>
    }

    return children;
}

export default ProtectedRoute;
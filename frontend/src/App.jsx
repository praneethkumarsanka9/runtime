import React from "react";
import { Route,Routes } from "react-router-dom";
import Login from "./pages/Login";
import Problems from "./pages/Problems";
import Register from "./pages/Register";
import ProtectedRoute from "./compnents/ProtectedRoute";

function App(){
    return (
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/Problems" element={
          <ProtectedRoute>
              <Problems/>
          </ProtectedRoute>
          }/>
      </Routes>
    )
}

export default App;
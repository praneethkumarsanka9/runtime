import React from "react";
import { Route,Routes } from "react-router-dom";
import Login from "./pages/Login";
import Problems from "./pages/Problems";
import Register from "./pages/Register";
import Verify from "./pages/Verify"
import ProtectedRoute from "./compnents/ProtectedRoute";
import ProblemDetail from "./pages/ProblemDetail";
import AddProblem from "./pages/AddProblem";
import EditProblem from "./pages/EditProblem";

function App(){
    return (
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/problems" element={
          <ProtectedRoute>
              <Problems/>
          </ProtectedRoute>
          }/>
        <Route path="/problems/:id" element={
          <ProtectedRoute>
               <ProblemDetail/>
          </ProtectedRoute>
        }/>
        <Route path="/add-problem" element={
          <ProtectedRoute>
               <AddProblem/>
          </ProtectedRoute>
        }/>
        <Route path="/edit-problem/:id" element={
          <ProtectedRoute>
               <EditProblem/>
          </ProtectedRoute>
        }/>
      </Routes>
    )
}

export default App;
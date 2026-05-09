import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/forms/Login";
import { Signup } from "./components/forms/Signup";
import { Home } from "./components/pages/Home";
import { ProjectDetail } from "./components/pages/ProjectDetail";

const Protected = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <Protected>
              <ProjectDetail />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

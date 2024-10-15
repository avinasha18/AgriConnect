
import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setAuthToken } from "./hooks/globalAuth";
import RouteManagement from "./components/RouteManagement";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css'
function App() {
  const islogin = useSelector((state) => state.auth.token);
  setAuthToken(islogin);


  return (
    <Routes>
      <Route
        path="/signup"
        element={!islogin && <SignUp /> }
      />
      <Route
        path="/login"
        element={!islogin && <Login /> }
      />
      <Route path="/*" element={<RouteManagement islogin={islogin} />} />
    </Routes>
  );
}

export default App;

import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setAuthToken } from "./hooks/globalAuth";
import RouteManagement from "./components/RouteManagement";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';

function App() {
  const isLogin = useSelector((state) => state.auth.token);
  setAuthToken(isLogin);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!isLogin ? <SignUp /> : <p>Already logged in</p>}
      />
      <Route
        path="/login"
        element={!isLogin ? <Login /> : <p>Already logged in</p>}
      />
      <Route path="/*" element={<RouteManagement isLogin={isLogin} />} />
    </Routes>
  );
}

export default App;

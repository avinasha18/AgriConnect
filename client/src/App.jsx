// In App.js or wherever you initialize your app:
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { setAuthToken } from "./hooks/globalAuth";
import RouteManagement from "./components/RouteManagement";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';
import { setLoginState } from './hooks/authSlice'; // Assuming you have a Redux action for this

function App() {
  const islogin = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      dispatch(setLoginState(token));  // Dispatch Redux action to update auth state
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path="/signup"
        element={!islogin ? <SignUp /> : <p>Already logged in</p>}
      />
      <Route
        path="/login"
        element={!islogin ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route path="/*" element={<RouteManagement islogin={islogin} />} />
    </Routes>
  );
}

export default App;

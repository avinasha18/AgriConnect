import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { setAuthToken } from "./hooks/globalAuth";
import RouteManagement from "./components/RouteManagement";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';
import { LanguageProvider } from "./hooks/languageContext";

function App() {
  // State for token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Function to update the token in both localStorage and state
  const handleTokenChange = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setToken(newToken);
  };

  // Monitor localStorage token changes and update the token state
  useEffect(() => {
    setAuthToken(token);  // Set auth token for API requests
  }, [token]);

  return (
    <LanguageProvider>
      <Routes>
        <Route
          path="/signup"
          element={!token ? <SignUp onTokenChange={handleTokenChange} /> : <p>Already logged in</p>}
        />
        <Route
          path="/login"
          element={!token ? <Login onTokenChange={handleTokenChange} /> : <p>Already logged in</p>}
        />
        <Route path="/*" element={<RouteManagement isLogin={token} />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;

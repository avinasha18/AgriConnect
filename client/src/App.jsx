
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import './App.css'
import CropDiseaseDetection from "./components/DiseasePrediction";
import CropYieldPrediction from "./components/YieldPrediction";
import CropRecommendationSystem from "./components/RecommendationSystem";
function App() {
  return (
    <Router>
      <div className="App">
      <div className="AppGlass">
        <Sidebar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/disease' element={<CropDiseaseDetection/>} />
          <Route path='/yield' element={<CropYieldPrediction/>} />
          <Route path="/recommendation" element={<CropRecommendationSystem/>} />
        </Routes>
      </div>
    </div>
    </Router>
  );
}

export default App;

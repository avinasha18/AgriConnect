import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import Home from "../Home";
import CropDiseaseDetection from "../DiseasePrediction";
import CropYieldPrediction from "../YieldPrediction";
import CropRecommendationSystem from "../RecommendationSystem";
import Dashboard from "../Dashboard";
import VoiceRecognition from "./VoiceRecognition";
import Profile from "../Profile";
import MyCrops from "../MyCrops";

const RouteManagement = ({  }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const isLogin = token
    const ProtectedRoute = ({ children, nextPath }) => {
        if (!isLogin) {
            return <Navigate to={`/login?nextpath=${nextPath}`} replace />;
        }
        return children;
    };

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full h-full">
                    <Routes>
                        <Route path='/recommendation' element={<CropRecommendationSystem />} />
                        <Route path='/disease' element={<CropDiseaseDetection />} />
                        <Route path='/yield' element={<CropYieldPrediction />} />
                        <Route path='/crops' element={<MyCrops />} />

                        <Route
                            path='/dashboard'
                            element={
                                <ProtectedRoute nextPath={location.pathname}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/profile'
                            element={
                                <ProtectedRoute nextPath={location.pathname}>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/home'
                            element={
                                <ProtectedRoute isLogin={!!token} nextPath={location.pathname}>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='/' element={<Navigate to='/dashboard' replace />} />
                    </Routes>
                </div>
                <VoiceRecognition />
            </div>
        </div>
    );
}

export default RouteManagement;

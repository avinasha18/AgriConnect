import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from '../Sidebar';
import Home from "../Home";
import CropDiseaseDetection from "../DiseasePrediction";
import CropYieldPrediction from "../YieldPrediction";
import CropRecommendationSystem from "../RecommendationSystem";
import Dashboard from "../Dashboard";
import { useSelector } from 'react-redux';

const RouteManagement = () => {
    const location = useLocation();
    const token = useSelector((state) => state.auth.token);

    const ProtectedRoute = ({ isLogin, children, nextPath }) => {
        if (!isLogin) {
            return <Navigate to={`/login?nextpath=${nextPath}`} replace />;
        }
        return children;
    };

    return (
        <div className="App py-10">
            <div className="AppGlass flex">
                <Sidebar />
                <div className="w-full h-full">
                <Routes>
                    <Route path='/recommendation' element={<CropRecommendationSystem />} />
                    <Route path='/disease' element={<CropDiseaseDetection />} />
                    <Route path='/yield' element={<CropYieldPrediction />} />
                    <Route
                        path='/dashboard'
                        element={
                            <ProtectedRoute isLogin={!!token} nextPath={location.pathname}>
                                <Dashboard />
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
            </div>
        </div>
    );
}

export default RouteManagement;

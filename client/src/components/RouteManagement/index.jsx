import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from '../Sidebar';
import Home from "../Home";
import CropDiseaseDetection from "../DiseasePrediction";
import CropYieldPrediction from "../YieldPrediction";
import CropRecommendationSystem from "../RecommendationSystem";
import Dashboard from "../Dashboard";

// Mock isLogin state to demonstrate authentication logic
const isLogin = true; // Replace this with actual authentication check

const RouteManagement = () => {
    const location = useLocation();

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
                <Routes>
                    {/* Public Routes */}
                    <Route path='/recommendation' element={<CropRecommendationSystem />} />
                    <Route path='/disease' element={<CropDiseaseDetection />} />
                    <Route path='/yield' element={<CropYieldPrediction />} />

                    {/* Protected Routes */}
                    <Route
                        path='/dashboard'
                        element={
                            <ProtectedRoute isLogin={isLogin} nextPath={location.pathname}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect root to Dashboard */}
                    <Route path='/' element={<Navigate to='/dashboard' replace />} />
                </Routes>
            </div>
        </div>
    );
}

export default RouteManagement;

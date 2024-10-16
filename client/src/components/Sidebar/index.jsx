import React, { useState, useEffect } from "react";
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
} from '@iconscout/react-unicons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';

const SidebarIcon = ({ icon: Icon, active, text, to, expanded }) => (
  <Link to={to}>
    <div className={`p-3 rounded-full flex items-center ${active ? 'bg-green-100' : 'hover:bg-gray-100'} transition-all duration-300 ease-in-out`}>
      <Icon size={24} className={active ? 'text-green-600' : 'text-gray-600'} />
      {expanded && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  </Link>
);

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/recommendation') {
      setActiveTab('recommendation');
    } else if (path === '/disease') {
      setActiveTab('disease');
    } else if (path === '/price') {
      setActiveTab('price');
    } else if (path === '/yield') {
      setActiveTab('yield');
    }
  }, [location]);

  return (
    <div className={`bg-white shadow-md flex flex-col items-center py-8 space-y-8 transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'}`}>
      {/* Sidebar Logo */}
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl animate-pulse">
        {expanded ? 'Agri Connect' : 'AC'}
      </div>
      
      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-center w-full mt-4">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-green-600 transition-all duration-300 ease-in-out">
          {expanded ? '<' : '>'}
        </button>
      </div>
      
      {/* Sidebar Items */}
      <SidebarIcon to='/dashboard' icon={UilEstate} active={activeTab === 'dashboard'} text="Dashboard" expanded={expanded} />
      <SidebarIcon to='/recommendation' icon={UilClipboardAlt} active={activeTab === 'recommendation'} text="Recommendation" expanded={expanded} />
      <SidebarIcon to='/disease' icon={UilUsersAlt} active={activeTab === 'disease'} text="Crop Disease" expanded={expanded} />
      <SidebarIcon to='/price' icon={UilPackage} active={activeTab === 'price'} text="Market Price" expanded={expanded} />
      <SidebarIcon to='/yield' icon={UilChart} active={activeTab === 'yield'} text="Yield Prediction" expanded={expanded} />
      
      {/* Logout Button */}
      <div className="mt-auto">
        <div onClick={handleLogout} className="p-3 rounded-full flex items-center cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out">
          <UilSignOutAlt size={24} className="text-gray-600" />
          {expanded && <span className="ml-3 text-gray-600">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

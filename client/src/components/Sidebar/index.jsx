import React, { useState, useEffect } from "react";
import {
  UilUserCircle,
  UilApps,
  
  UilLightbulbAlt,
  UilStethoscope,
  UilMoneyBill,
  UilAnalytics,
  UilSignOutAlt,
} from '@iconscout/react-unicons';
import { FaSeedling } from "react-icons/fa";

import { MdArrowBackIosNew } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { useLanguage } from './../../hooks/languageContext';
import { useDispatch } from "react-redux";
import {logout} from '../../hooks/authSlice'
const SidebarIcon = ({ icon: Icon, active, text, to, expanded }) => (
  <Link to={to}>
    <div className={`p-3 rounded-xl flex items-center ${active ? 'bg-green-100' : 'hover:bg-gray-100'} transition-all duration-300 ease-in-out`}>
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
  const { language } = useLanguage();
  const dispatch = useDispatch()

  const texts = {
    en: {
      profile: 'Profile',
      dashboard: 'Dashboard',
      crops : 'My Crops',
      recommendation: 'Recommendation',
      disease: 'Crop Disease',
      price: 'Market Price',
      yield: 'Yield Prediction',
      logout: 'Logout',
    },
    hi: {
      profile: 'प्रोफ़ाइल',
      dashboard: 'डैशबोर्ड',
      crops: 'मेरी फसलें',
      recommendation: 'सिफारिश',
      disease: 'फसल रोग',
      price: 'बाजार मूल्य',
      yield: 'उपज पूर्वानुमान',
      logout: 'लॉगआउट',
    },
    te: {
      profile: 'ప్రొఫైల్',
      dashboard: 'డాష్‌బోర్డ్',
      crops: 'నా పంటలు',
      recommendation: 'సిఫార్సు',
      disease: 'పంట రోగం',
      price: 'మార్కెట్ ధర',
      yield: 'ఉత్పత్తి అంచనా',
      logout: 'లాగ్ అవుట్',
    },
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    dispatch(clearToken);
    dispatch(logout)
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
    } else if (path === '/yield' || path === '/yield-predict') {
      setActiveTab('yield');
    } else if (path === '/profile') {
      setActiveTab('profile');
    }
    else if(path === '/crops'){
      setActiveTab('crops')
    }
  }, [location]);

  return (
    <div className={`bg-white border border-r-2 overflow-y-auto shadow-md flex flex-col px-3 py-8 space-y-5 transition-all duration-300 ease-in-out ${expanded ? 'w-[340px]' : 'w-20'}`}>
      {/* Sidebar Logo */}
      <div className={`flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ease-in-out ${expanded ? 'w-46 h-12 bg-green-500 px-4 rounded-2xl' : 'w-12 h-12 bg-green-500 rounded-full animate-pulse'}`}>
        {expanded ? 'Agri Connect' : 'AC'}
      </div>

      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-center w-full mt-4">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-green-600 transition-all duration-300 ease-in-out">
          {expanded ? <MdArrowBackIosNew /> : <IoIosArrowForward />}
        </button>
      </div>

      {/* Sidebar Items */}
      <SidebarIcon to='/profile' icon={UilUserCircle} active={activeTab === 'profile'} text={texts[language].profile} expanded={expanded} />
      <SidebarIcon to='/crops' icon={FaSeedling} active={activeTab === 'crops'} text={texts[language].crops} expanded={expanded} />
      <SidebarIcon to='/dashboard' icon={UilApps} active={activeTab === 'dashboard'} text={texts[language].dashboard} expanded={expanded} />
      <SidebarIcon to='/recommendation' icon={UilLightbulbAlt} active={activeTab === 'recommendation'} text={texts[language].recommendation} expanded={expanded} />
      <SidebarIcon to='/disease' icon={UilStethoscope} active={activeTab === 'disease'} text={texts[language].disease} expanded={expanded} />
      <SidebarIcon to='/price' icon={UilMoneyBill} active={activeTab === 'price'} text={texts[language].price} expanded={expanded} />
      <SidebarIcon to='/yield' icon={UilAnalytics} active={activeTab === 'yield'} text={texts[language].yield} expanded={expanded} />

      {/* Logout Button */}
      <div className="mt-auto">
        <div onClick={handleLogout} className="p-3 rounded-full flex items-center cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out">
          <UilSignOutAlt size={24} className="text-gray-600" />
          {expanded && <span className="ml-3 text-gray-600">{texts[language].logout}</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

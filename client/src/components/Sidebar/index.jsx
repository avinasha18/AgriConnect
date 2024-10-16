// Sidebar.jsx
import React, { useState } from "react";
import { 
  Cloud, Leaf, DollarSign, 
  Thermometer, Settings, LogOut
} from 'lucide-react';
import './index.css'

const SidebarIcon = ({ icon: Icon, active }) => (
  <div className={`p-3 rounded-full ${active ? 'bg-green-100' : 'hover:bg-gray-100'}`}>
    <Icon size={24} className={active ? 'text-green-600' : 'text-gray-600'} />
  </div>
);

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <div className="w-20 bg-white shadow-md flex flex-col items-center py-8 space-y-8">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
          AC
        </div>
        <SidebarIcon icon={Cloud} active={activeTab === 'dashboard'} />
        <SidebarIcon icon={Leaf} />
        <SidebarIcon icon={DollarSign} />
        <SidebarIcon icon={Thermometer} />
        <SidebarIcon icon={Settings} />
        <div className="mt-auto">
          <SidebarIcon icon={LogOut} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
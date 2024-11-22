import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNavigationBar = () => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Dashboard', icon: '🏠', path: "/dashboard" },
        { name: 'Lead', icon: '📋', path: "/my-leads" },
        { name: 'Level', icon: '🎯', path: "/my-level" },
        { name: 'Earning', icon: '💰', path: "/earning" },
    ];

    return (
        <div className="fixed z-[1000] top-auto left-0 sm:hidden  w-full rounded-t-3xl bg-[#fefefe] shadow-2xl shadow-black flex justify-around items-center py-5" >
            {navItems.map((item) => (
                <div key={item.name} className="flex flex-col items-center"
                    onClick={() => navigate(item.path)}
                >
                    {/* Replace these emoji icons with SVGs if needed */}
                    <span className="text-2xl">{item.icon}</span>
        <span className=" text-sm text-gray-600 mt-1">{item.name}</span>
      </div>
    ))}
  </div>
);
};

export default BottomNavigationBar;
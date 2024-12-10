import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '../assets/icon/SidebarIcon/Dashboard.svg';
import LeadsIcon from '../assets/icon/SidebarIcon/Leads.svg';
import MyLevelIcon from '../assets/icon/SidebarIcon/MyLevel.svg';
import EarningIcon from '../assets/icon/SidebarIcon/Earning.svg';

const BottomNavigationBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const navItems = [
        { name: 'Home', icon: DashboardIcon, path: "/dashboard" },
        { name: 'Lead', icon: LeadsIcon, path: "/my-leads" },
        { name: 'Level', icon: MyLevelIcon, path: "/my-level" },
        { name: 'Earning', icon: EarningIcon, path: "/earning" },
    ];

    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.innerHeight;
            const fullHeight = window.screen.height;
            // Check if the keyboard is visible based on viewport height
            setKeyboardVisible(viewportHeight < fullHeight * 0.85);
        };

        // Attach resize listener
        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        // Cleanup listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isKeyboardVisible) {
        return null; // Hide the navigation bar when the keyboard is open
    }

    return (
        <div className="fixed z-[1000] top-auto left-0 sm:hidden w-full rounded-t-3xl bg-[#fefefe] shadow-2xl shadow-black flex justify-around items-center py-5">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div
                        key={item.name}
                        className="flex flex-col items-center"
                        onClick={() => navigate(item.path)}
                    >
                        <img
                        src={item.icon}
                        alt={item.name}
                        className={`w-6 h-6 transition-transform`}
                        style={{
                            filter: isActive ? 'invert(0%) brightness(40%)' : 'none',
                            }}
                        />
                        <span
                            className={`text-sm mt-1 transition-colors ${
                                isActive ? 'text-[#45484c] font-bold' : 'text-gray-600'
                            }`}
                        >
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default BottomNavigationBar;
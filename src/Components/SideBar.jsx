import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from "../assets/icon/SidebarIcon/Dashboard.svg";
import Documents from "../assets/icon/SidebarIcon/Documents.svg";
import Earning from "../assets/icon/SidebarIcon/Earning.svg";
import Language from "../assets/icon/SidebarIcon/Language.svg";
import Leads from "../assets/icon/SidebarIcon/Leads.svg";
import LogoutIcon from "../assets/icon/SidebarIcon/Logout.svg";
import MyLevel from "../assets/icon/SidebarIcon/MyLevel.svg";
import Mywebsite from "../assets/icon/SidebarIcon/Mywebsite.svg";
import Paymentdetail from "../assets/icon/SidebarIcon/Paymentdetail.svg";
import Setting from "../assets/icon/SidebarIcon/setting.svg";
import Support from "../assets/icon/SidebarIcon/Support.svg";
import Team from "../assets/icon/SidebarIcon/Team.svg";
import Tearm_Condition from "../assets/icon/SidebarIcon/Tearm&Condition.svg";
import Training from "../assets/icon/SidebarIcon/Training.svg";
import ApexLogo from "../assets/icon/SidebarIcon/ApexLogo.svg";
import Share from "../assets/icon/SidebarIcon/Share.svg";
import { useSidebar } from '../ContextApi';

// Firebase imports
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const SideBar = () => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, setIsOpenProfile } = useSidebar();
  const sidebarRef = useRef(null);

  const menuItems = [
    { icon: DashboardIcon, label: "Dashboard", path: "/dashboard" },
    { icon: Leads, label: "My Leads", path: "/my-leads" },
    { icon: Paymentdetail, label: "Payment Detail", path: "/paymentdetail" },
    { icon: Earning, label: "My Earning", path: "/earning" },
    { icon: Documents, label: "My Documents", path: "/documents" },
    { icon: Training, label: "Training", path: "/training" },
    { icon: MyLevel, label: "My Level", path: "/my-level" },
    { icon: Support, label: "Support", path: "/support" },
    { icon: Tearm_Condition, label: "Terms & Conditions", path: "/terms" },
    { icon: Setting, label: "Setting", path: "/settings" },
    { icon: LogoutIcon, label: "Logout", action: 'logout' }, // Special action for Logout
  ];

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigate('/login');
      setIsOpen(false); // Close the sidebar after logout
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="z-[1000]" onClick={() => setIsOpenProfile(false)}>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full md:w-[17%] w-64 bg-white border-r transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-[1000]`}
      >
        <div className="border-r-[0.5px] border-[#DEE2E6] text-[#ADB5BD] h-full flex flex-col">
          <div className="w-fit mx-auto">
            <div className="flex justify-between ml-1 mt-4">
              <img className="w-16" src={ApexLogo} alt="ApexLogo" />
              <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  className="w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 12H4M4 12L10 18M4 12L10 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <ul className="menu-list max-w-fit mt-5">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="menu-item flex items-center py-[.6rem] hover:text-[#063E50] cursor-pointer"
                    onClick={() => {
                      if (item.action === 'logout') {
                        handleLogout();
                      } else {
                        navigate(item.path);
                        setIsOpen(false); // Close the sidebar when an item is clicked
                      }
                    }}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-[1.125rem] mr-2"
                    />
                    <span className="font-medium text-base">{item.label}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/refer-earn')}
                className="flex items-center rounded-lg gap-1 px-3 py-2 bg-[#063E50] font-medium text-base hover:bg-[#055a6a] transition-colors"
              >
                <img src={Share} alt="Share" />
                Refer & Earn
              </button>
            </div>
          </div>
          <div className="mt-auto hidden lg:block">
            <hr className="border-t border-[#ADB5BD] mb-1" />
            <div className="w-fit mx-auto space-y-4 py-2">
              <p className="font-medium text-sm">Apex. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

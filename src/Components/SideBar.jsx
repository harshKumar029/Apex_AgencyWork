import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from "../assets/icon/SidebarIcon/Dashboard.svg";
import Documents from "../assets/icon/SidebarIcon/Documents.svg";
import Earning from "../assets/icon/SidebarIcon/Earning.svg";
import Language from "../assets/icon/SidebarIcon/Language.svg";
import Leads from "../assets/icon/SidebarIcon/Leads.svg";
import Logout from "../assets/icon/SidebarIcon/Logout.svg";
import MyLevel from "../assets/icon/SidebarIcon/MyLevel.svg";
import Mywebsite from "../assets/icon/SidebarIcon/Mywebsite.svg";
import Paymentdetail from "../assets/icon/SidebarIcon/Paymentdetail.svg";
import setting from "../assets/icon/SidebarIcon/setting.svg";
import Support from "../assets/icon/SidebarIcon/Support.svg";
import Team from "../assets/icon/SidebarIcon/Team.svg";
import Tearm_Condition from "../assets/icon/SidebarIcon/Tearm&Condition.svg";
import Training from "../assets/icon/SidebarIcon/Training.svg";
import ApexLogo from "../assets/icon/SidebarIcon/ApexLogo.svg";
import Share from "../assets/icon/SidebarIcon/Share.svg";

const SideBar = () => {
  const navigate = useNavigate(); 

  const menuItems = [
    { icon: Dashboard, label: "Dashboard", path: "/" },
    { icon: Leads, label: "My Leads", path: "/leads" },
    { icon: Team, label: "My Team", path: "/team" },
    { icon: Paymentdetail, label: "Payment Detail", path: "/paymentdetail" },
    { icon: Earning, label: "My Earning", path: "/earning" },
    { icon: Documents, label: "My Documents", path: "/documents" },
    { icon: Training, label: "Training", path: "/training" },
    { icon: MyLevel, label: "My Level", path: "/my-level" },
    { icon: Mywebsite, label: "My Website", path: "/my-website" },
    { icon: Language, label: "Language", path: "/language" },
    { icon: Support, label: "Support", path: "/support" },
    { icon: Tearm_Condition, label: "Terms & Conditions", path: "/terms" },
    { icon: setting, label: "Setting", path: "/settings" },
  ];

  return (
    <div className="border-r-[0.5px] border-[#DEE2E6] text-[#ADB5BD] h-screen w-64 flex flex-col">
      <div className="w-fit mx-auto">
        <img className="ml-1 w-16 mt-1" src={ApexLogo} alt="ApexLogo" />
        <div className="space-y-3">
          <ul className="menu-list max-w-fit mt-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="menu-item flex items-center py-[.4rem] hover:text-[#063E50] cursor-pointer"
                onClick={() => navigate(item.path, { state: { label: item.label } })}
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
          <button className="flex items-center rounded-lg gap-1 px-3 py-2 bg-[#063E50] font-medium text-base">
            <img src={Share} alt="Share" />
            Refer & Earn
          </button>
        </div>
      </div>

      <div className="mt-auto ">
        <hr className='border-t border-[#ADB5BD] mb-1' />
        <div className="w-fit mx-auto space-y-4 py-2">
          <button className="flex items-center rounded-lg px-2 gap-2">
            <img className="w-[1.125rem] mr-2" src={Logout} alt="Logout" />
            Logout
          </button>
          <p className="font-medium text-sm">Apex . All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Dashboard from "../assets/icon/SidebarIcon/Dashboard.svg";
// import Documents from "../assets/icon/SidebarIcon/Documents.svg";
// import Earning from "../assets/icon/SidebarIcon/Earning.svg";
// import Language from "../assets/icon/SidebarIcon/Language.svg";
// import Leads from "../assets/icon/SidebarIcon/Leads.svg";
// import Logout from "../assets/icon/SidebarIcon/Logout.svg";
// import MyLevel from "../assets/icon/SidebarIcon/MyLevel.svg";
// import Mywebsite from "../assets/icon/SidebarIcon/Mywebsite.svg";
// import Paymentdetail from "../assets/icon/SidebarIcon/Paymentdetail.svg";
// import setting from "../assets/icon/SidebarIcon/setting.svg";
// import Support from "../assets/icon/SidebarIcon/Support.svg";
// import Team from "../assets/icon/SidebarIcon/Team.svg";
// import Tearm_Condition from "../assets/icon/SidebarIcon/Tearm&Condition.svg";
// import Training from "../assets/icon/SidebarIcon/Training.svg";
// import ApexLogo from "../assets/icon/SidebarIcon/Apexlogo.svg";
// import Share from "../assets/icon/SidebarIcon/Share.svg";

// const SideBar = () => {
//   const navigate = useNavigate(); 

//   const menuItems = [
//     { icon: Dashboard, label: "Dashboard", path: "/" },
//     { icon: Leads, label: "My Leads", path: "/leads" },
//     // { icon: Team, label: "My Team", path: "/team" },
//     { icon: Paymentdetail, label: "Payment Detail", path: "/paymentdetail" },
//     { icon: Earning, label: "My Earning", path: "/earning" },
//     { icon: Documents, label: "My Documents", path: "/documents" },
//     { icon: Training, label: "Training", path: "/training" },
//     { icon: MyLevel, label: "My Level", path: "/my-level" },
//     // { icon: Mywebsite, label: "My Website", path: "/my-website" },
//     // { icon: Language, label: "Language", path: "/language" },
//     { icon: Support, label: "Support", path: "/support" },
//     { icon: Tearm_Condition, label: "Terms & Conditions", path: "/terms" },
//     { icon: setting, label: "Setting", path: "/settings" },
//   ];

//   return (
//     <div className="border-r-[0.5px] border-[#DEE2E6] text-[#ADB5BD] h-screen w-64 flex flex-col">
//       <div className="w-fit mx-auto">
//         <img className="ml-1 w-16 mt-4" src={ApexLogo} alt="ApexLogo" />
//         <div className="space-y-4">
//           <ul className="menu-list max-w-fit mt-5">
//             {menuItems.map((item, index) => (
//               <li
//                 key={index}
//                 className="menu-item flex items-center py-[.6rem] hover:text-[#063E50] cursor-pointer"
//                 onClick={() => navigate(item.path)}
//               >
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className="w-[1.125rem] mr-2"
//                 />
//                 <span className="font-medium text-base">{item.label}</span>
//               </li>
//             ))}
//           </ul>
//           <button className="flex items-center rounded-lg gap-1 px-3 py-2 bg-[#063E50] font-medium text-base">
//             <img src={Share} alt="Share" />
//             Refer & Earn
//           </button>
//         </div>
//       </div>

//       <div className="mt-auto ">
//         <hr className='border-t border-[#ADB5BD] mb-1' />
//         <div className="w-fit mx-auto space-y-4 py-2">
//           <button className="flex items-center rounded-lg px-2 gap-2">
//             <img className="w-[1.125rem] mr-2" src={Logout} alt="Logout" />
//             Logout
//           </button>
//           <p className="font-medium text-sm">Apex . All rights reserved</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBar;


import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Dashboard, label: "Dashboard", path: "/" },
    { icon: Leads, label: "My Leads", path: "/leads" },
    { icon: Paymentdetail, label: "Payment Detail", path: "/paymentdetail" },
    { icon: Earning, label: "My Earning", path: "/earning" },
    { icon: Documents, label: "My Documents", path: "/documents" },
    { icon: Training, label: "Training", path: "/training" },
    { icon: MyLevel, label: "My Level", path: "/my-level" },
    { icon: Support, label: "Support", path: "/support" },
    { icon: Tearm_Condition, label: "Terms & Conditions", path: "/terms" },
    { icon: setting, label: "Setting", path: "/settings" },
  ];

  return (
    <div className=' z-[1000]'>
      {/* Toggle Button */}
      <button
        className="md:hidden p-6"
        onClick={() => setIsOpen(true)}
      >
        <svg className='w-10' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full md:w-[17%] w-64 bg-white border-r transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="border-r-[0.5px] border-[#DEE2E6] text-[#ADB5BD] h-full flex flex-col">
          <div className="w-fit mx-auto">
            <div className=' flex justify-between ml-1 mt-4 '>
              <img className=" w-16" src={ApexLogo} alt="ApexLogo" />
              {/* Toggle Button */}
              {/* <button
                className="md:hidden p-2"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

              </button> */}
            </div>
            <div className="space-y-4">
              <ul className="menu-list max-w-fit mt-5">
                {menuItems.map((item, index) => (
                  <li
                    key={index}
                    className="menu-item flex items-center py-[.6rem] hover:text-[#063E50] cursor-pointer"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false); // Close the sidebar when an item is clicked
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
      </div>
    </div>
  );
};

export default SideBar;

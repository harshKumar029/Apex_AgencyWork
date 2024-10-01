import React from 'react';
import setting from "../assets/icon/SidebarIcon/setting.svg"
import Notification from "../assets/icon/Notification.svg"
import Userimg from "../assets/img/Userimg.svg"
import Searchbar from './Searchbar';
import { useSidebar } from '../ContextApi';

const Header = ({ title, showSearch = true, children }) => {
    const { setIsOpen } = useSidebar();
    return (
        <div>
            <div className="flex items-center justify-between p-4 px-8 bg-white border-b border-[#DEE2E6]">
                {/* Left Section (Heading) */}
                {/* <div className='md:hidden block'></div> */}
                <button className="md:hidden " onClick={() => setIsOpen(prev => !prev)}>
                    <svg className='w-10' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                <h1 className=" text-2xl sm:text-3xl text-[#343C6A] font-semibold">{title}</h1>

                {/* Right Section (Search, Settings, Notification, Profile) */}
                <div className="flex items-center sm:space-x-10">
                    {/* Search Input */}
                    <div className='hidden sm:block'>
                        {!showSearch && (
                            <Searchbar />
                        )}
                    </div>

                    {/* Settings Icon */}
                    <img
                        src={setting}
                        alt="Settings"
                        className="w-9 h-9 hidden sm:block cursor-pointer bg-[#F8FAFA] p-1 rounded-3xl"
                    />

                    {/* Notification Icon */}
                    {/* <img
                        src={Notification}
                        alt="Notification"
                        className="w-9 h-9 cursor-pointer bg-[#F8FAFA] p-1 rounded-3xl"
                    /> */}

                    {/* Profile Circle */}
                    <img
                        src={Userimg}
                        alt="Profile"
                        className=" w-14 h-14 rounded-full object-cover cursor-pointer"
                    />
                </div>
            </div>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Header;

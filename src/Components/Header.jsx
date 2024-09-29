import React from 'react';
import setting from "../assets/icon/SidebarIcon/setting.svg"
import Notification from "../assets/icon/Notification.svg"
import Userimg from "../assets/img/Userimg.svg"
import Searchbar from './Searchbar';

const Header = ({ title, showSearch = true, children }) => {
    return (
        <div>
            <div className="flex items-center justify-between p-4 px-8 bg-white border-b border-[#DEE2E6]">
                {/* Left Section (Heading) */}
                <div className='md:hidden block'></div>
                <h1 className=" text-3xl text-[#343C6A] font-semibold">{title}</h1>

                {/* Right Section (Search, Settings, Notification, Profile) */}
                <div className="flex items-center space-x-10">
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

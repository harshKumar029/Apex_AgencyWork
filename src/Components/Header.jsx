// src/Components/Header.jsx

import React, { useRef, useEffect } from 'react';
import placeholderImage from "../assets/icon/profile-img.svg"; // Import placeholder image
import Searchbar from './Searchbar';
import { useSidebar } from '../ContextApi';
import { Link } from 'react-router-dom';
import useUserData from '../hooks/useUserData'; // Ensure this hook is correctly implemented and imported

const Header = ({ title, showSearch = true, children }) => {
    const { isOpenProfile, setIsOpenProfile, setIsOpen } = useSidebar();
    const profileRef = useRef(null);

    const { userData, loading, error } = useUserData(); // Fetch user data

    const toggleDropdown = () => {
        setIsOpenProfile(!isOpenProfile);
    };

    const handleCopyUID = () => {
        const uidText = userData.uniqueID;
        navigator.clipboard.writeText(uidText)
            .then(() => {
                alert('UID copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy UID:', err);
            });
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsOpenProfile(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div ref={profileRef}>
            <div className="flex items-center justify-between p-4 sm:px-8 bg-white border-b border-[#DEE2E6]">
                {/* Hamburger Menu for Mobile */}
                <button className="md:hidden" onClick={() => { setIsOpen(prev => !prev); setIsOpenProfile(false); }}>
                    <svg className='w-10' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>

                {/* Page Title */}
                <h1 className="text-2xl sm:text-3xl text-[#343C6A] font-semibold">{title}</h1>

                {/* Right Section (Search, Earning Icon, Profile) */}
                <div className="flex items-center sm:space-x-10">
                    {/* Search Input */}
                    <div className='hidden sm:block'>
                        {showSearch && <Searchbar />}
                    </div>

                    {/* Earning Icon */}
                    <Link to='/earning'>
                        <svg className="w-9 h-9 hidden sm:block cursor-pointer text-[#ADB5BD] bg-[#F8FAFA] p-1 rounded-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 7.99983V4.50048C16 3.66874 16 3.25287 15.8248 2.9973C15.6717 2.77401 15.4346 2.62232 15.1678 2.57691C14.8623 2.52493 14.4847 2.6992 13.7295 3.04775L4.85901 7.14182C4.18551 7.45267 3.84875 7.6081 3.60211 7.84915C3.38406 8.06225 3.21762 8.32238 3.1155 8.60966C3 8.93462 3 9.30551 3 10.0473V14.9998M16.5 14.4998H16.51M3 11.1998L3 17.7998C3 18.9199 3 19.48 3.21799 19.9078C3.40973 20.2841 3.71569 20.5901 4.09202 20.7818C4.51984 20.9998 5.07989 20.9998 6.2 20.9998H17.8C18.9201 20.9998 19.4802 20.9998 19.908 20.7818C20.2843 20.5901 20.5903 20.2841 20.782 19.9078C21 19.48 21 18.9199 21 17.7998V11.1998C21 10.0797 21 9.51967 20.782 9.09185C20.5903 8.71552 20.2843 8.40956 19.908 8.21782C19.4802 7.99983 18.9201 7.99983 17.8 7.99983L6.2 7.99983C5.0799 7.99983 4.51984 7.99983 4.09202 8.21781C3.7157 8.40956 3.40973 8.71552 3.21799 9.09185C3 9.51967 3 10.0797 3 11.1998ZM17 14.4998C17 14.776 16.7761 14.9998 16.5 14.9998C16.2239 14.9998 16 14.776 16 14.4998C16 14.2237 16.2239 13.9998 16.5 13.9998C16.7761 13.9998 17 14.2237 17 14.4998Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <img
                            src={userData.profilePhotoURL || placeholderImage}
                            alt="Profile"
                            onClick={toggleDropdown}
                            className="w-12 h-12 rounded-full object-cover cursor-pointer"
                        />
                        {isOpenProfile && (
                            <div className="absolute right-0 z-50 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <ul>
                                    {/* Fullname and UID */}
                                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-start">
                                        {/* User Icon */}
                                        <svg
                                            className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 015 14V8a4 4 0 014-4h6a4 4 0 014 4v6a4 4 0 01-.121 3.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-semibold">{userData.fullname}</span>
                                            <p className="text-xs text-gray-600 flex items-center">
                                                UID:
                                                <span className="uid-text text-[#063E50] underline mx-1">
                                                    {userData.uniqueID}
                                                </span>
                                                {/* Copy button */}
                                                <button
                                                    type="button"
                                                    className="text-sm text-blue-500 underline hover:text-gray-500 focus:outline-none"
                                                    onClick={handleCopyUID}
                                                >
                                                    Copy
                                                </button>
                                            </p>
                                        </div>
                                    </li>

                                    {/* Mobile Number */}
                                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                                        {/* Phone Icon */}
                                        <svg
                                            className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.586a2 2 0 011.414.586l2.828 2.828a2 2 0 01.586 1.414V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V9a2 2 0 012-2h4z" />
                                        </svg>
                                        <span>{userData.mobile}</span>
                                    </li>

                                    {/* Email Address */}
                                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                                        {/* Email Icon */}
                                        <svg
                                            className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="truncate">{userData.email}</span>
                                    </li>

                                    {/* Go to Apex Dashboard */}
                                    <Link to='/'>
                                        <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                                            {/* Dashboard Icon */}
                                            <svg
                                                className='w-5 h-5 text-gray-600 mr-3 flex-shrink-0'
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M3.41345 10.7445C2.81811 10.513 2.52043 10.3972 2.43353 10.2304C2.35819 10.0858 2.35809 9.91354 2.43326 9.76886C2.51997 9.60195 2.8175 9.48584 3.41258 9.25361L20.3003 2.66327C20.8375 2.45364 21.1061 2.34883 21.2777 2.40616C21.4268 2.45596 21.5437 2.57292 21.5935 2.72197C21.6509 2.8936 21.5461 3.16219 21.3364 3.69937L14.7461 20.5871C14.5139 21.1822 14.3977 21.4797 14.2308 21.5664C14.0862 21.6416 13.9139 21.6415 13.7693 21.5662C13.6025 21.4793 13.4867 21.1816 13.2552 20.5862L10.6271 13.8282C10.5801 13.7074 10.5566 13.647 10.5203 13.5961C10.4881 13.551 10.4487 13.5115 10.4036 13.4794C10.3527 13.4431 10.2923 13.4196 10.1715 13.3726L3.41345 10.7445Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Go to Apex Dashboard
                                        </li>
                                    </Link>

                                    {/* Logged In As (No Icon) */}
                                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer bg-[#eaeaea]">
                                        <div className="flex items-start overflow-hidden">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700">
                                                    Logged In as{' '}
                                                    <span
                                                        className="text-[#063E50] underline block truncate"
                                                        title={userData.email}
                                                    >
                                                        {userData.email}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Header;

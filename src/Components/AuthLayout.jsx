import React from 'react';
import SideBar from './SideBar';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex">
            <div className="fixed h-full w-64">
                <SideBar />
            </div>
            
            <div className="ml-64 w-full"> 
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;

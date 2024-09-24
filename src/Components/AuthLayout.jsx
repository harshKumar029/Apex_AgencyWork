import React from 'react';
import SideBar from './SideBar';
// import TopBar from './TopBar';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex m-auto">
          <SideBar/>
            <div className=" ml-auto w-[95vw]">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
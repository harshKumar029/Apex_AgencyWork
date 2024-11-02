// src/Components/Dashboard/ConfirmationPage.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BlueCheck from '../../assets/icon/BlueCheck.svg';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const customerName = location.state?.customerName || 'Customer';

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className="flex items-center py-4 w-full">
        <div className='flex gap-3'>
          {/* Removed Back Button */}
          <div>
            <h2 className="text-[#343C6A] font-medium text-2xl">Confirmation</h2>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <img src={BlueCheck} alt="tick" className="mx-auto mb-4" />
          <p className="font-medium text-2xl text-[#212529]">
            {customerName}’s details have been successfully captured
          </p>
          <button
            onClick={() => navigate('/my-leads')}
            className="underline font-normal text-[#063E50] text-xl mt-4"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

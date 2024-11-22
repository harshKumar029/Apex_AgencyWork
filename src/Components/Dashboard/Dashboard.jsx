// src/Components/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import SVG icons
import Bank from '../../assets/icon/DashboardIcon/Bank.svg';
import BusinessLoan from '../../assets/icon/DashboardIcon/BusinessLoan.svg';
import CarLoan from '../../assets/icon/DashboardIcon/CarLoan.svg';
import Credit from '../../assets/icon/DashboardIcon/Credit.svg';
import HomeLoan from '../../assets/icon/DashboardIcon/HomeLoan.svg';
import Insurance from '../../assets/icon/DashboardIcon/Insurance.svg';
import Loan from '../../assets/icon/DashboardIcon/Loan.svg';
import LoanAgainstProperty from '../../assets/icon/DashboardIcon/LoanAgainstProperty.svg';
import MagnetCard from '../../assets/icon/DashboardIcon/MagnetCard.svg';

// Firebase imports
import { auth, db } from '../../firebase'; // Ensure the correct path
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store user's full name and uniqueID
  const [fullName, setFullName] = useState('');
  const [uniqueID, setUniqueID] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Card Data with serviceId and icons
  const cardData = [
    { id: 1, serviceId: 'creditCard', title: 'Credit Card', apply: 'Apply now', icon: Credit },
    { id: 2, serviceId: 'personalLoan', title: 'Personal Loan', apply: 'Apply now', icon: Loan },
    { id: 3, serviceId: 'homeLoan', title: 'Home Loan', apply: 'Apply now', icon: HomeLoan },
    { id: 4, serviceId: 'carLoan', title: 'Car Loan', apply: 'Apply now', icon: CarLoan },
    { id: 5, serviceId: 'magnetCard', title: 'Magnet Card', apply: 'Apply now', icon: MagnetCard },
    { id: 6, serviceId: 'insurance', title: 'Insurance', apply: 'Apply now', icon: Insurance },
    { id: 7, serviceId: 'loanAgainstProperty', title: 'Loan Against Property', apply: 'Apply now', icon: LoanAgainstProperty },
    { id: 8, serviceId: 'businessLoan', title: 'Business Loan', apply: 'Apply now', icon: BusinessLoan },
    { id: 9, serviceId: 'bankAccount', title: 'Bank Account', apply: 'Apply now', icon: Bank },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullname || 'User'); // Default to 'User' if fullname not found
            setUniqueID(userData.uniqueID || 'N/A'); // Default to 'N/A' if uniqueID not found
          } else {
            console.warn('No such user document!');
            setFullName('User'); // Default
            setUniqueID('N/A');
          }
        } else {
          console.warn('No authenticated user found!');
          // Optionally, redirect to login if user is not authenticated
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>

{/* Welcome and Info Cards */}
<div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
  {/* Welcome Card */}
  <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
    <div>
      <h4 className="text-[#232323] font-semibold text-2xl">Welcome {fullName}!</h4>
      <p className="text-[#ADB5BD] font-normal text-xl">Explore our all features and services.</p>
    </div>
  </div>

  {/* Info Cards Container */}
  <div className="flex flex-row space-x-4 sm:space-x-10">
    {/* Offer Letter Card */}
    <div className="flex items-center border bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg border-[#DEE2E6] rounded-3xl p-6 w-1/2 sm:w-auto transform transition-transform hover:scale-105">
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-white font-semibold text-2x1 mb-2">Your Offer Letter</h2>
        <button className="bg-white text-blue-600 font-medium py-2 px-4 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200 ease-in-out">
          Download
        </button>
      </div>
    </div>

    {/* ID Card */}
    <div className="flex items-center border bg-gradient-to-r from-green-400 to-teal-500 shadow-lg border-[#DEE2E6] rounded-3xl p-6 w-1/2 sm:w-auto transform transition-transform hover:scale-105">
      <div className="flex flex-col items-center text-center w-full">
        <h2 className="text-white font-semibold text-2x1 mb-2">Your ID Card</h2>
        <button className="bg-white text-green-600 font-medium py-2 px-4 rounded-full shadow-md hover:bg-green-100 transition-all duration-200 ease-in-out">
          Download
        </button>
      </div>
    </div>
  </div>
</div>

      {/* Services Section */}
      <div>
        <div className="flex items-center py-4 w-full">
          <div>
            <h2 className="text-[#343C6A] font-medium text-2xl">Our Services</h2>
            <p className="text-[#495057] font-light text-base">
              Choose from the services below
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cardData.map((card) => (
            <div
              key={card.id}
              className='border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200'
            >
              <div className="flex items-center p-4">
                <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-[#232323] font-semibold text-xl">{card.title}</h2>
                  <p
                    onClick={() => navigate(`/dashboard/selectbank/${card.serviceId}`)}
                    className="text-[#063E50] cursor-pointer font-normal underline text-base hover:text-[#055a6a]"
                  >
                    {card.apply}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
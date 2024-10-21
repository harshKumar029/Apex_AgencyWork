// src/Components/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { auth, db } from '../../firebase'; // Ensure correct path
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store user's full name and uniqueID
  const [fullName, setFullName] = useState('');
  const [uniqueID, setUniqueID] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Optional: loading state
  const [error, setError] = useState(null); // Optional: error state

  // Card Data
  const cardData = [
    { id: 1, title: 'Credit Card', apply: 'Apply now', icon: Credit },
    { id: 2, title: 'Personal Loan', apply: 'Apply now', icon: Loan },
    { id: 3, title: 'Home Loan', apply: 'Apply now', icon: HomeLoan },
    { id: 4, title: 'Car Loan', apply: 'Apply now', icon: CarLoan },
    { id: 5, title: 'Magnet Card', apply: 'Apply now', icon: MagnetCard },
    { id: 6, title: 'Insurance', apply: 'Apply now', icon: Insurance },
    { id: 7, title: 'Loan Against Property', apply: 'Apply now', icon: LoanAgainstProperty },
    { id: 8, title: 'Business Loan', apply: 'Apply now', icon: BusinessLoan },
    { id: 9, title: 'Bank Account', apply: 'Apply now', icon: Bank },
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
        <p>Loading...</p>
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
    <div className='w-[95%] m-auto my-5'>

      {/* Row of Cards */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        {/* Card 1 - Full width on mobile, flex-grow to prevent excess space on desktop */}
        <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
          <div>
            <h2 className="text-[#232323] font-semibold text-3xl">Welcome {fullName}!</h2>
            <p className="text-[#ADB5BD] font-normal text-xl">Explore our all features and services.</p>
          </div>
        </div>

        {/* Container for Cards 2, 3, and 4 */}
        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0">
          {/* Card 2 */}
          <div className="hidden sm:flex items-end sm:items-center justify-end rounded-3xl p-4 w-full sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-base">Your Unique ID</h2>
              <p className="text-[#063E50] font-normal underline text-xs">{uniqueID}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-base">Your Offer Letter</h2>
              <p className="text-[#063E50] font-normal underline text-xs">Download</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-base">Your ID Card</h2>
              <p className="text-[#063E50] font-normal underline text-xs">Download</p>
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
            <div key={card.id} className='border border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200'>
              <div className="flex items-center p-4">
                <img src={card.icon} alt={`${card.title} Icon`} className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-[#232323] font-semibold text-xl">{card.title}</h2>
                  <p
                    onClick={() => navigate('/Dashboard/selectbank')}
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
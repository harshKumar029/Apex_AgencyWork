// src/Components/Dashboard/SelectBankAcc.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Import SVG icons
import AMRECIANEXPRES from '../../assets/icon/DashboardIcon/BankIcon/AMRECIANEXPRES.svg';
import AUBank from '../../assets/icon/DashboardIcon/BankIcon/AUBank.svg';
import AXISBANK from '../../assets/icon/DashboardIcon/BankIcon/AXISBANK.svg';
import BOB from '../../assets/icon/DashboardIcon/BankIcon/BOB.svg';
import HDFC from '../../assets/icon/DashboardIcon/BankIcon/HDFC.svg';
import hsbc from '../../assets/icon/DashboardIcon/BankIcon/hsbc.svg';
import ICICI from '../../assets/icon/DashboardIcon/BankIcon/ICICI.svg';
import IDFCBANK from '../../assets/icon/DashboardIcon/BankIcon/IDFCBANK.svg';
import INDBANK from '../../assets/icon/DashboardIcon/BankIcon/INDBANK.svg';
import kotakmahindrabank from '../../assets/icon/DashboardIcon/BankIcon/kotakmahindrabank.svg';
import RBL from '../../assets/icon/DashboardIcon/BankIcon/RBL.svg';
import SBIBANK from '../../assets/icon/DashboardIcon/BankIcon/SBIBANK.svg';
import STANDARDCHARTERED from '../../assets/icon/DashboardIcon/BankIcon/STANDARDCHARTERED.svg';
import YESBANK from '../../assets/icon/DashboardIcon/BankIcon/YESBANK.svg';

// Firebase imports
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const SelectBankAcc = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams(); 

  const [availableBanks, setAvailableBanks] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [error, setError] = useState(null);
  const [earningsData, setEarningsData] = useState(null);

  // For popup
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  
  // We'll determine if the service is a Credit Card by checking its name
  const [isCreditCardService, setIsCreditCardService] = useState(false);

  const bankData = [
    { id: 1, bankId: 'hdfcBank', title: 'HDFC Bank', choose: 'Choose', icon: HDFC },
    { id: 2, bankId: 'idfcFirstBank', title: 'IDFC First Bank', choose: 'Choose', icon: IDFCBANK },
    { id: 3, bankId: 'yesBank', title: 'Yes Bank', choose: 'Choose', icon: YESBANK },
    { id: 4, bankId: 'indusBank', title: 'IndusInd Bank', choose: 'Choose', icon: INDBANK },
    { id: 5, bankId: 'sbiBank', title: 'State Bank Of India', choose: 'Choose', icon: SBIBANK },
    { id: 6, bankId: 'standardChartered', title: 'Standard Chartered', choose: 'Choose', icon: STANDARDCHARTERED },
    { id: 7, bankId: 'auBank', title: 'AU Bank', choose: 'Choose', icon: AUBank },
    { id: 8, bankId: 'americanExpress', title: 'American Express', choose: 'Choose', icon: AMRECIANEXPRES },
    { id: 9, bankId: 'iciciBank', title: 'ICICI Bank', choose: 'Choose', icon: ICICI },
    { id: 10, bankId: 'hsbcBank', title: 'HSBC Bank', choose: 'Choose', icon: hsbc },
    { id: 11, bankId: 'axisBank', title: 'AXIS Bank', choose: 'Choose', icon: AXISBANK },
    { id: 12, bankId: 'kotakMahindraBank', title: 'Kotak Mahindra Bank', choose: 'Choose', icon: kotakmahindrabank },
    { id: 13, bankId: 'bobBank', title: 'BOB Bank', choose: 'Choose', icon: BOB },
    { id: 14, bankId: 'rblBank', title: 'RBL Bank', choose: 'Choose', icon: RBL },
  ];

  useEffect(() => {
    const fetchAvailableBanks = async () => {
      try {
        // Fetch service data
        const serviceDocRef = doc(db, 'services', serviceId);
        const serviceDoc = await getDoc(serviceDocRef);

        if (!serviceDoc.exists()) {
          setError('Service not found.');
          return;
        }

        const serviceData = serviceDoc.data();
        const banksOfferingService = serviceData.banks || [];
        setServiceName(serviceData.name);

        // Check if this service is "Credit Card"
        const lowerCaseServiceName = (serviceData.name || '').toLowerCase();
        if (lowerCaseServiceName.includes('credit card')) {
          setIsCreditCardService(true);
        }

        const filteredBanks = bankData.filter((bank) =>
          banksOfferingService.includes(bank.bankId)
        );
        setAvailableBanks(filteredBanks);

        // Fetch earnings data
        const earningsDocRef = doc(db, 'earnings', serviceId);
        const earningsDoc = await getDoc(earningsDocRef);
        if (earningsDoc.exists()) {
          setEarningsData(earningsDoc.data());
        }
      } catch (error) {
        console.error('Error fetching available banks:', error);
        setError('Failed to load banks.');
      }
    };

    fetchAvailableBanks();
  }, [serviceId]);

  // Handle bank selection
  const handleBankSelect = (bank) => {
    // If it's a Credit Card service, show popup to choose Full or Partial
    if (isCreditCardService) {
      setSelectedBank(bank);
      setShowPopup(true);
    } else {
      // For non-credit card services, go directly
      navigate(`/dashboard/selectbank/${serviceId}/leaddetails/${bank.bankId}`);
    }
  };

  // Handle upload type in popup
  const handleUploadType = (type) => {
    setShowPopup(false);
    if (!selectedBank) return;
    // Navigate with uploadType as a query param
    navigate(`/dashboard/selectbank/${serviceId}/leaddetails/${selectedBank.bankId}?uploadType=${type}`);
  };

  if (error) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className="flex items-center py-4 w-full">
        <div className='flex gap-3'>
          <div>
            <svg onClick={() => navigate(-1)} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z" fill="#495057" />
            </svg>
          </div>
          <div>
            <h2 className="text-[#343C6A] font-medium text-2xl">Select your Bank</h2>
            <p className="text-[#495057] font-light text-base">
              Choose from the banks offering {serviceName}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {availableBanks.map((bank) => (
          <div 
            key={bank.id} 
            className='border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200'
          >
            <div className="flex items-center px-4 pl-8 py-4">
              <img src={bank.icon} alt={`${bank.title} Icon`} className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-[#232323] font-semibold text-xl">{bank.title}</h2>
                {earningsData && earningsData[bank.bankId] !== undefined && (
                  <p className="text-[#495057] font-normal text-sm mt-1">
                    You will earn upto: ₹{earningsData[bank.bankId]}
                  </p>
                )}
                <p
                  onClick={() => handleBankSelect(bank)}
                  className="text-[#063E50] cursor-pointer font-normal underline text-base mt-2"
                >
                  {bank.choose}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for Credit Card service */}
      {showPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setShowPopup(false)} // clicking outside closes the popup
        >
          <div 
            className="bg-white w-11/12 sm:w-96 p-6 rounded-xl relative"
            onClick={(e) => e.stopPropagation()} // prevent popup close on content click
          >
            <h2 className="text-xl font-semibold text-center text-[#343C6A]">Lead Upload Type</h2>
            <p className="mt-2 text-center text-[#495057]">
              Please select how you want to upload the lead
            </p>
            <div className="flex flex-col sm:flex-row justify-center mt-6 gap-3">
              <button
                onClick={() => handleUploadType('full')}
                className="bg-[#063E50] text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Full Lead Upload
              </button>
              <button
                onClick={() => handleUploadType('partial')}
                className="bg-[#0f8092] text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Partial Lead Upload
              </button>
            </div>

            <button 
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectBankAcc;
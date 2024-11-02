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
import { db } from '../../firebase'; // Ensure the correct path
import { doc, getDoc } from 'firebase/firestore';

const SelectBankAcc = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams(); // Get serviceId from URL parameters

  const [availableBanks, setAvailableBanks] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [error, setError] = useState(null);

  // Data array for the banks with bankId matching Firestore IDs
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
        // Fetch the service document to get the list of banks that offer this service
        const serviceDocRef = doc(db, 'services', serviceId);
        const serviceDoc = await getDoc(serviceDocRef);

        if (serviceDoc.exists()) {
          const serviceData = serviceDoc.data();
          const banksOfferingService = serviceData.banks; // Array of bank IDs
          setServiceName(serviceData.name);

          // Filter the bankData array to only include banks that offer this service
          const filteredBanks = bankData.filter((bank) =>
            banksOfferingService.includes(bank.bankId)
          );

          setAvailableBanks(filteredBanks);
        } else {
          console.log('Service not found');
          setError('Service not found.');
        }
      } catch (error) {
        console.error('Error fetching available banks:', error);
        setError('Failed to load banks.');
      }
    };

    fetchAvailableBanks();
  }, [serviceId]);

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
          <div key={bank.id} className='border bg-white_custom border-[#DEE2E6] rounded-3xl'>
            <div className="flex items-center px-4 pl-8 py-4">
              <img src={bank.icon} alt={`${bank.title} Icon`} className="w-16 h-16 mr-4" />
              <div>
                <h2 className="text-[#232323] font-semibold text-xl">{bank.title}</h2>
                <p
                  onClick={() => navigate(`/dashboard/selectbank/${serviceId}/leaddetails/${bank.bankId}`)}
                  className="text-[#063E50] cursor-pointer font-normal underline text-base"
                >
                  {bank.choose}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectBankAcc;

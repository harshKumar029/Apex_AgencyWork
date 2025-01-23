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
import { auth, db } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

import IDCardModal from './IDCardModal'; 
import { jsPDF } from 'jspdf';

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store user's basic info
  const [fullName, setFullName] = useState('');
  const [uniqueID, setUniqueID] = useState('');
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Additional user details for ID card
  const [profilePhotoURL, setProfilePhotoURL] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // User account creation date
  const [createdAt, setCreatedAt] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false); // ID Card modal

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
        if (!user) {
          console.warn('No authenticated user found!');
          navigate('/login');
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullname || 'User');
          setUniqueID(userData.uniqueID || 'N/A');
          setMobile(userData.mobile || '');
          setCreatedAt(userData.createdAt || null);

          // Fetch profile details from the subcollection
          const profileDetailsRef = doc(db, 'users', user.uid, 'Details&Documents', 'ProfileDetails');
          const profileDoc = await getDoc(profileDetailsRef);
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            setProfilePhotoURL(profileData.profilePhotoURL || '');
            setAddress(profileData.address || '');
            setCity(profileData.city || '');
            setCountry(profileData.country || '');
            setPostalCode(profileData.postalCode || '');
          }

        } else {
          console.warn('No such user document!');
          setFullName('User');
          setUniqueID('N/A');
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

  const handleIDCardClick = () => {
    setIsModalOpen(true);
  };

  const handleOfferLetterClick = () => {
    // Format the creation date
    let displayDate = '';
    if (createdAt && createdAt.toDate) {
      const dateObj = createdAt.toDate();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      displayDate = dateObj.toLocaleDateString(undefined, options);
    } else {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      displayDate = now.toLocaleDateString(undefined, options);
    }

    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Draw a colored header background
    // Set a fill color (6,62,80) as the header background
    doc.setFillColor(6, 62, 80);
    // Draw a rectangle: x=0, y=0, width=pageWidth, height=100pt
    doc.rect(0, 0, pageWidth, 100, 'F');

    // Add header text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); 
    doc.text("APEX SUPPORT AND SERVICES", pageWidth / 2, 50, { align: 'center' });

    // Sub-header text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text("D35 Noida sector 2 near Red FM building 201301", pageWidth / 2, 70, { align: 'center' });

    let y = 120;

    // Date in the top-right corner below header
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Date: ${displayDate}`, pageWidth - 60, y, { align: 'right' });
    y += 40;

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Offer Letter for Finesse Advisory Specialist", pageWidth / 2, y, { align: 'center' });
    y += 40;

    // Body text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0);
    const leftMargin = 60;
    const wrapWidth = pageWidth - 120; // margin on both sides

    const lines = [
      `Dear ${fullName},`,
      "",
      "We are pleased to extend this offer to collaborate with APEX SUPPORT AND SERVICES as a Finesse Advisory Specialist. Your role will empower you to transform aspirations into achievements by guiding individuals towards acquiring the credit card solutions that best meet their financial goals, all while establishing yourself as a professional in the financial advisory sector.",
      "",
      "By joining us as a Finesse Advisory Specialist, you embrace a professional identity that reflects sophistication, expertise, and credibility. This is not just an opportunity to work but to build a career that aligns with the highest standards of financial advisory excellence.",
      "",
      "We look forward to seeing you thrive in this role and contribute to the success of our customers, our partners, and yourself.",
      "Welcome to APEX SUPPORT AND SERVICES. Together, we’ll make financial dreams a reality.",
      "",
      "Warm regards,",
      "",
      "APEX SUPPORT AND SERVICES",
      "Call at +91 7042336564",
      "Email - support@apexin.in",
      "Website - www.apexin.in"
    ];

    const lineHeight = 16;
    lines.forEach(line => {
      const textLines = doc.splitTextToSize(line, wrapWidth);
      textLines.forEach(tl => {
        doc.text(tl, leftMargin, y);
        y += lineHeight;
      });
    });

    // Save the PDF
    doc.save('Offer_Letter.pdf');
  };

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

      {/* ID Card Modal */}
      <IDCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profilePhotoURL={profilePhotoURL}
        fullname={fullName}
        uniqueID={uniqueID}
        mobile={mobile}
        address={address}
        city={city}
        country={country}
        postalCode={postalCode}
      />

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
              <button
                onClick={handleOfferLetterClick}
                className="bg-white text-blue-600 font-medium py-2 px-4 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200 ease-in-out"
              >
                View Letter
              </button>
            </div>
          </div>

          {/* ID Card */}
          <div className="flex items-center border bg-gradient-to-r from-green-400 to-teal-500 shadow-lg border-[#DEE2E6] rounded-3xl p-6 w-1/2 sm:w-auto transform transition-transform hover:scale-105">
            <div className="flex flex-col items-center text-center w-full">
              <h2 className="text-white font-semibold text-2x1 mb-2">Your ID Card</h2>
              <button
                onClick={handleIDCardClick}
                className="bg-white text-green-600 font-medium py-2 px-4 rounded-full shadow-md hover:bg-green-100 transition-all duration-200 ease-in-out"
              >
                View ID Card
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cardData.map((card) => (
            <div
              key={card.id}
              className='border bg-white_custom border-[#DEE2E6] rounded-3xl hover:shadow-lg transition-shadow duration-200'
            >
              <div className="flex flex-col sm:flex-row text-center md:text-start items-center p-4">
                <img src={card.icon} alt={`${card.title} Icon`} className="  rounded-lg w-14 h-14 mr-4" />
                <div >
                  <h2 className="text-[#232323]  font-semibold text-xl">{card.title}</h2>
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

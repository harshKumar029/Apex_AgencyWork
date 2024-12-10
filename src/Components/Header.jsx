// src/Components/Header.jsx

import React, { useRef, useEffect, useState } from 'react';
import placeholderImage from "../assets/icon/profile-img.svg";
import HeaderSearchbar from './HeaderSearchbar';
import { useSidebar } from '../ContextApi';
import { Link, useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Header = ({ title, showSearch = true, children }) => {
  const { isOpenProfile, setIsOpenProfile, setIsOpen } = useSidebar();
  const profileRef = useRef(null);

  // Retry logic state
  const [retryCount, setRetryCount] = useState(0);

  // Fetch user data with retryCount
  const { userData, loading, error } = useUserData(retryCount);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const navigate = useNavigate();

  // Retry logic: Retry fetching data after 3 seconds if there's an error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleDropdown = () => {
    // Prevent opening the dropdown if userData is not loaded
    if (loading || error || !userData) {
      return;
    }
    setIsOpenProfile(!isOpenProfile);
  };

  const handleCopyUID = () => {
    if (!userData || !userData.uniqueID) return;
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
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const queryText = e.target.value;
    setSearchQuery(queryText);
    if (queryText.trim() !== '') {
      fetchLeads(queryText);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  const fetchLeads = async (queryText) => {
    setIsLoadingSearch(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle unauthenticated user
        setIsLoadingSearch(false);
        return;
      }

      const leadsRef = collection(db, 'leads');
      // Get all leads of the user
      const leadsQuery = query(leadsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(leadsQuery);
      const leadsData = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Filter leads based on search query
      const lowercasedQuery = queryText.toLowerCase();
      const filteredLeads = leadsData.filter((lead) => {
        const customerName =
          lead.customerDetails?.fullname?.toLowerCase() || '';
        const serviceName =
          serviceNames[lead.serviceId]?.toLowerCase() ||
          lead.serviceId.toLowerCase();
        const bankName =
          bankNames[lead.bankId]?.toLowerCase() || lead.bankId.toLowerCase();
        const status = lead.status?.toLowerCase() || '';
        return (
          customerName.includes(lowercasedQuery) ||
          serviceName.includes(lowercasedQuery) ||
          bankName.includes(lowercasedQuery) ||
          status.includes(lowercasedQuery)
        );
      });

      setSearchResults(filteredLeads);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // Mapping for service IDs to service names
  const serviceNames = {
    creditCard: 'Credit Card',
    personalLoan: 'Personal Loan',
    homeLoan: 'Home Loan',
    carLoan: 'Car Loan',
    magnetCard: 'Magnet Card',
    insurance: 'Insurance',
    loanAgainstProperty: 'Loan Against Property',
    businessLoan: 'Business Loan',
    bankAccount: 'Bank Account',
  };

  // Mapping for bank IDs to bank names
  const bankNames = {
    hdfcBank: 'HDFC Bank',
    idfcFirstBank: 'IDFC First Bank',
    yesBank: 'Yes Bank',
    indusBank: 'IndusInd Bank',
    sbiBank: 'State Bank Of India',
    standardChartered: 'Standard Chartered',
    auBank: 'AU Bank',
    americanExpress: 'American Express',
    iciciBank: 'ICICI Bank',
    hsbcBank: 'HSBC Bank',
    axisBank: 'AXIS Bank',
    kotakMahindraBank: 'Kotak Mahindra Bank',
    bobBank: 'BOB Bank',
    rblBank: 'RBL Bank',
  };

  const handleSuggestionClick = (leadId) => {
    navigate(`/view-details/${leadId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={profileRef}>
      <div className="flex items-center justify-between p-4 sm:px-8 bg-white border-b border-[#DEE2E6]">
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden"
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsOpenProfile(false);
          }}
        >
          <svg
            className='w-10'
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl text-[#343C6A] font-semibold">
          {title}
        </h1>

        {/* Right Section (Search, Earning Icon, Profile) */}
        <div className="flex items-center sm:space-x-10">
          {/* Search Input */}
          <div className='hidden sm:block relative'>
            {showSearch && (
              <>
                <HeaderSearchbar
                  searchQuery={searchQuery}
                  onChange={handleSearchChange}
                />
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleSuggestionClick(lead.id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {lead.customerDetails?.fullname || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Service: {serviceNames[lead.serviceId] || lead.serviceId}
                        </div>
                        <div className="text-xs text-gray-500">
                          Bank: {bankNames[lead.bankId] || lead.bankId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showSuggestions && searchResults.length === 0 && !isLoadingSearch && (
                  <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No results found.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Earning Icon */}
          <Link to='/earning'>
            <svg
<<<<<<< HEAD
              className="w-12 h-10 hidden sm:block cursor-pointer text-[#063e50] bg-[#F8FAFA] p-1 rounded-full"
=======
<<<<<<< HEAD
              className="w-12 h-10 hidden sm:block cursor-pointer text-[#063e50] bg-[#F8FAFA] p-1 rounded-full"
=======
              className="w-9 h-9 hidden sm:block cursor-pointer text-[#ADB5BD] bg-[#F8FAFA] p-1 rounded-full"
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 7.99983V4.50048C16 3.66874 16 3.25287 15.8248 2.9973C15.6717 2.77401 15.4346 2.62232 15.1678 2.57691C14.8623 2.52493 14.4847 2.6992 13.7295 3.04775L4.85901 7.14182C4.18551 7.45267 3.84875 7.6081 3.60211 7.84915C3.38406 8.06225 3.21762 8.32238 3.1155 8.60966C3 8.93462 3 9.30551 3 10.0473V14.9998M16.5 14.4998H16.51M3 11.1998L3 17.7998C3 18.9199 3 19.48 3.21799 19.9078C3.40973 20.2841 3.71569 20.5901 4.09202 20.7818C4.51984 20.9998 5.07989 20.9998 6.2 20.9998H17.8C18.9201 20.9998 19.4802 20.9998 19.908 20.7818C20.2843 20.5901 20.5903 20.2841 20.782 19.9078C21 19.48 21 18.9199 21 17.7998V11.1998C21 10.0797 21 9.51967 20.782 9.09185C20.5903 8.71552 20.2843 8.40956 19.908 8.21782C19.4802 7.99983 18.9201 7.99983 17.8 7.99983L6.2 7.99983C5.0799 7.99983 4.51984 7.99983 4.09202 8.21781C3.7157 8.40956 3.40973 8.71552 3.21799 9.09185C3 9.51967 3 10.0797 3 11.1998ZM17 14.4998C17 14.776 16.7761 14.9998 16.5 14.9998C16.2239 14.9998 16 14.776 16 14.4998C16 14.2237 16.2239 13.9998 16.5 13.9998C16.7761 13.9998 17 14.2237 17 14.4998Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <img
              src={userData?.profilePhotoURL || placeholderImage}
              alt="Profile"
              onClick={toggleDropdown}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
            {isOpenProfile && userData && !loading && !error && (
              <div className="absolute right-0 z-50 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul>
                  {/* Fullname and UID */}
                  <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-start">
                    <svg
                      className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold">{userData?.fullname || ''}</span>
                      <p className="text-xs text-gray-600 flex items-center">
                        UID:
                        <span className="uid-text text-[#063E50] underline mx-1">
                          {userData?.uniqueID || ''}
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
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.0497 6C15.0264 6.19057 15.924 6.66826 16.6277 7.37194C17.3314 8.07561 17.8091 8.97326 17.9997 9.95M14.0497 2C16.0789 2.22544 17.9713 3.13417 19.4159 4.57701C20.8606 6.01984 21.7717 7.91101 21.9997 9.94M10.2266 13.8631C9.02506 12.6615 8.07627 11.3028 7.38028 9.85323C7.32041 9.72854 7.29048 9.66619 7.26748 9.5873C7.18576 9.30695 7.24446 8.96269 7.41447 8.72526C7.46231 8.65845 7.51947 8.60129 7.63378 8.48698C7.98338 8.13737 8.15819 7.96257 8.27247 7.78679C8.70347 7.1239 8.70347 6.26932 8.27247 5.60643C8.15819 5.43065 7.98338 5.25585 7.63378 4.90624L7.43891 4.71137C6.90747 4.17993 6.64174 3.91421 6.35636 3.76987C5.7888 3.4828 5.11854 3.4828 4.55098 3.76987C4.2656 3.91421 3.99987 4.17993 3.46843 4.71137L3.3108 4.86901C2.78117 5.39863 2.51636 5.66344 2.31411 6.02348C2.08969 6.42298 1.92833 7.04347 1.9297 7.5017C1.93092 7.91464 2.01103 8.19687 2.17124 8.76131C3.03221 11.7947 4.65668 14.6571 7.04466 17.045C9.43264 19.433 12.295 21.0575 15.3284 21.9185C15.8928 22.0787 16.1751 22.1588 16.588 22.16C17.0462 22.1614 17.6667 22 18.0662 21.7756C18.4263 21.5733 18.6911 21.3085 19.2207 20.7789L19.3783 20.6213C19.9098 20.0898 20.1755 19.8241 20.3198 19.5387C20.6069 18.9712 20.6069 18.3009 20.3198 17.7333C20.1755 17.448 19.9098 17.1822 19.3783 16.6508L19.1835 16.4559C18.8339 16.1063 18.6591 15.9315 18.4833 15.8172C17.8204 15.3862 16.9658 15.3862 16.3029 15.8172C16.1271 15.9315 15.9523 16.1063 15.6027 16.4559C15.4884 16.5702 15.4313 16.6274 15.3644 16.6752C15.127 16.8453 14.7828 16.904 14.5024 16.8222C14.4235 16.7992 14.3612 16.7693 14.2365 16.7094C12.7869 16.0134 11.4282 15.0646 10.2266 13.8631Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{userData?.mobile || ''}</span>
                  </li>

                  {/* Go to Apex Dashboard */}
                  <Link
                    to='/'
                    onClick={() => setIsOpenProfile(false)}
                  >
                    <li className="py-2 px-4 hover:bg-gray-100 cursor-pointer flex items-center">
                      {/* Dashboard Icon */}
                      <svg
                        className='w-5 h-5 text-gray-600 mr-3 flex-shrink-0'
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.41345 10.7445C2.81811 10.513 2.52043 10.3972 2.43353 10.2304C2.35819 10.0858 2.35809 9.91354 2.43326 9.76886C2.51997 9.60195 2.8175 9.48584 3.41258 9.25361L20.3003 2.66327C20.8375 2.45364 21.1061 2.34883 21.2777 2.40616C21.4268 2.45596 21.5437 2.57292 21.5935 2.72197C21.6509 2.8936 21.5461 3.16219 21.3364 3.69937L14.7461 20.5871C14.5139 21.1822 14.3977 21.4797 14.2308 21.5664C14.0862 21.6416 13.9139 21.6415 13.7693 21.5662C13.6025 21.4793 13.4867 21.1816 13.2552 20.5862L10.6271 13.8282C10.5801 13.7074 10.5566 13.647 10.5203 13.5961C10.4881 13.551 10.4487 13.5115 10.4036 13.4794C10.3527 13.4431 10.2923 13.4196 10.1715 13.3726L3.41345 10.7445Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                            title={userData?.email || ''}
                          >
                            {userData?.email || ''}
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

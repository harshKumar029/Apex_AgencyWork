// src/Components/MyLeads.jsx

import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const MyLeads = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to show per page

  const [allLeads, setAllLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const leadsRef = collection(db, 'leads');
        const q = query(leadsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const leadsData = [];
        querySnapshot.forEach((doc) => {
          leadsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setAllLeads(leadsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load leads');
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = [];
    const today = new Date();

    if (activeFilter === 'All') {
      filtered = allLeads;
    } else if (activeFilter === 'Brand') {
      // Leads from the last 5 days
      filtered = allLeads.filter((lead) => {
        const submissionDate = lead.submissionDate ? lead.submissionDate.toDate() : null;
        if (!submissionDate) return false;
        const diffTime = Math.abs(today - submissionDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 5;
      });
    } else if (activeFilter === 'Fulfill') {
      // Leads with status 'Approved'
      filtered = allLeads.filter((lead) => lead.status && lead.status.toLowerCase() === 'approved');
    } else if (activeFilter === 'Pending') {
      // Leads with status 'Pending'
      filtered = allLeads.filter((lead) => lead.status && lead.status.toLowerCase() === 'pending');
    } else if (activeFilter === 'Rejected') {
      // Leads with status 'Rejected'
      filtered = allLeads.filter((lead) => lead.status && lead.status.toLowerCase() === 'rejected');
    } else if (activeFilter === 'Expire') {
      // Leads with 'Pending' status for more than two months
      filtered = allLeads.filter((lead) => {
        if (lead.status && lead.status.toLowerCase() === 'pending') {
          const submissionDate = lead.submissionDate ? lead.submissionDate.toDate() : null;
          if (!submissionDate) return false;
          const diffTime = Math.abs(today - submissionDate);
          const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
          return diffMonths >= 2;
        }
        return false;
      });
    }
    setFilteredLeads(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeFilter, allLeads]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  // Get the current items for the table
  const currentItems = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
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
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className='sm:hidden block w-full py-4 m-auto z-0'>
        <Searchbar />
      </div>
      {/* Header */}
      <div className=" flex justify-between items-center  mb-4">
        <h1 className="text-2xl font-medium text-[#343C6A]">Active Leads</h1>

        <button className="py-2 px-3 sm:mt-auto sm: sm:border border-[#063E50] flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full">
          <svg
            className="w-6 h-6 text-[#063E50]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>
          Download Report
        </button>
      </div>

      {/* Buttons for filtering the table */}
      <div className=" justify-between items-center mb-4">
        <div className="w-full sm:w-auto">
          <div className="space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar">
            {['All', 'Brand', 'Fulfill', 'Pending', 'Rejected', 'Expire'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className={`py-2 px-4 rounded-full ${activeFilter === filter
                    ? 'bg-[#063E50] text-white'
                    : ' border border-[#063E50] text-[#063E50]'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>


      </div>

      <div className="overflow-x-auto sm:hidden">
        {/* Card layout for mobile */}
        <div className="flex flex-col space-y-4 mb-3">
          {currentItems.map((row, index) => (
            <div key={row.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-bold">Name:</span>
                <span>{row.customerDetails?.fullname || 'N/A'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Service:</span>
                <span>{serviceNames[row.serviceId] || row.serviceId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Bank Chosen:</span>
                <span>{bankNames[row.bankId] || row.bankId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Date:</span>
                <span>
                  {row.submissionDate
                    ? row.submissionDate.toDate().toLocaleDateString()
                    : ''}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-bold">Amount:</span>
                <span>{row.amount || ''}</span>
              </div>
              <div className="flex justify-center">
                <button className="px-4 py-2 text-[#063E50] border border-[#063E50] rounded-full">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:block">
        <table className="min-w-full bg-white text-left">
          <thead className="text-[#063E50] font-medium text-base border-b border-[#DEE2E6]">
            <tr>
              <th className="px-4 py-2">Sl No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Bank Chosen</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="text-left text-base text-[#212529] font-normal">
            {currentItems.map((row, index) => (
              <tr key={row.id}>
                <td className="px-4 py-2">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-2">
                  {row.customerDetails?.fullname || 'N/A'}
                </td>
                <td className="px-4 py-2">
                  {serviceNames[row.serviceId] || row.serviceId}
                </td>
                <td className="px-4 py-2">
                  {bankNames[row.bankId] || row.bankId}
                </td>
                <td className="px-4 py-2">
                  {row.submissionDate
                    ? row.submissionDate.toDate().toLocaleDateString()
                    : ''}
                </td>
                <td className="px-4 py-2">{row.amount || ''}</td>
                <td className="px-4 py-2 font-medium text-center cursor-pointer">
                  <button className="px-4 py-2 text-[#063E50] border border-[#063E50] rounded-full">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`py-2 px-4 flex items-center font-medium ${currentPage === 1
              ? ' text-gray-500 cursor-not-allowed'
              : ' text-[#063E50]'
            } rounded`}
        >
          <svg
            className="w-5 h-5 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`py-2 px-4 mx-1 rounded-lg ${currentPage === index + 1
                ? 'bg-[#063E50] text-white'
                : ' text-[#063E50]'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`py-2 px-4 flex items-center font-medium ${currentPage === totalPages
              ? ' text-gray-500 cursor-not-allowed'
              : ' text-[#063E50]'
            } rounded`}
        >
          Next
          <svg
            className="w-5 h-5 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m9 5 7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MyLeads;

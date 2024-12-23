// src/Components/MyLeads.jsx

import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { generateCSV } from '../utils/csvUtils';

const MyLeads = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [allLeads, setAllLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [displayedLeads, setDisplayedLeads] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // Initial number of leads to display

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // State for download generation feedback
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

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

  // Function to get status class based on status
  const getStatusClass = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'decline':
        // "decline" -> "Declined"
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'processing':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold';
      case 'noanswering':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold';
      default:
        return '';
    }
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

        // Sort leadsData by submissionDate in descending order (New to Old)
        leadsData.sort((a, b) => {
          const dateA = a.submissionDate
            ? a.submissionDate.toDate()
            : new Date(0);
          const dateB = b.submissionDate
            ? b.submissionDate.toDate()
            : new Date(0);
          return dateB - dateA; // descending order
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
    } else if (activeFilter === 'New') {
      // Leads from the last 5 days
      filtered = allLeads.filter((lead) => {
        const submissionDate = lead.submissionDate
          ? lead.submissionDate.toDate()
          : null;
        if (!submissionDate) return false;
        const diffTime = Math.abs(today - submissionDate);
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays <= 5;
      });
    } else if (activeFilter === 'Approved') {
      // Leads with status 'approved'
      filtered = allLeads.filter(
        (lead) => lead.status && lead.status.toLowerCase() === 'approved'
      );
    } else if (activeFilter === 'Pending') {
      // Leads with status 'pending'
      filtered = allLeads.filter(
        (lead) => lead.status && lead.status.toLowerCase() === 'pending'
      );
    } else if (activeFilter === 'In Processing') {
      // Leads with status 'processing'
      filtered = allLeads.filter(
        (lead) => lead.status && lead.status.toLowerCase() === 'processing'
      );
    } else if (activeFilter === 'No Answering') {
      // Leads with status 'noAnswering'
      filtered = allLeads.filter(
        (lead) => lead.status && lead.status.toLowerCase() === 'noanswering'
      );
    } else if (activeFilter === 'Declined') {
      // Leads with status 'decline'
      filtered = allLeads.filter(
        (lead) => lead.status && lead.status.toLowerCase() === 'decline'
      );
    } else if (activeFilter === 'Expire') {
      // Leads with 'Pending' status for more than two months
      filtered = allLeads.filter((lead) => {
        if (lead.status && lead.status.toLowerCase() === 'pending') {
          const submissionDate = lead.submissionDate
            ? lead.submissionDate.toDate()
            : null;
          if (!submissionDate) return false;
          const diffTime = Math.abs(today - submissionDate);
          const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);
          return diffMonths >= 2;
        }
        return false;
      });
    }

    // Filter based on search query
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((lead) => {
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
    }

    setFilteredLeads(filtered);
    setVisibleCount(20); // Reset the visible count when filter or search changes
  }, [activeFilter, allLeads, searchQuery]);

  useEffect(() => {
    // Update the displayed leads whenever filtered leads or visible count changes
    setDisplayedLeads(filteredLeads.slice(0, visibleCount));
  }, [filteredLeads, visibleCount]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        visibleCount < filteredLeads.length
      ) {
        // Increase the number of visible leads
        setVisibleCount((prevCount) =>
          Math.min(prevCount + 20, filteredLeads.length)
        );
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleCount, filteredLeads.length]);

  // Handler for initiating delete
  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  };

  // Handler for confirming delete
  const handleConfirmDelete = async () => {
    if (leadToDelete) {
      try {
        await deleteDoc(doc(db, 'leads', leadToDelete.id));
        // Remove the lead from allLeads and filteredLeads
        setAllLeads((prevLeads) =>
          prevLeads.filter((lead) => lead.id !== leadToDelete.id)
        );
        setFilteredLeads((prevLeads) =>
          prevLeads.filter((lead) => lead.id !== leadToDelete.id)
        );
        setShowDeleteModal(false);
        setLeadToDelete(null);
      } catch (err) {
        console.error('Error deleting lead:', err);
        alert('Failed to delete lead.');
      }
    }
  };

  // Handler for cancelling delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  };

  // Handler for viewing lead details
  const handleViewLead = (leadId) => {
    navigate(`/view-details/${leadId}`);
  };

  // Function to handle CSV download in a new tab
  const handleDownloadReport = async () => {
    try {
      setIsGenerating(true);

      // Generate CSV
      const csvContent = generateCSV(allLeads, serviceNames, bankNames);

      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      // Create a temporary link to trigger download in a new tab
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      // Force open in a new tab:
      link.target = '_blank';
      link.download = 'leads_report.csv';

      // Append, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
    } catch (error) {
      console.error('Error downloading report:', error);
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img
          src="/loading.gif"
          alt="Loading..."
          style={{ width: '100px', height: '100px' }}
        />
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
        <Searchbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-medium text-[#343C6A]'>Active Leads</h1>

        <button
          className={`py-2 px-3 sm:mt-auto sm:border border-[#063E50] 
                      flex self-end sm:self-auto gap-2 text-[#063E50] rounded-full
                      transition-all duration-200 
                      ${isGenerating ? 'cursor-wait opacity-80' : 'hover:bg-[#063E50] hover:text-white'}`}
          onClick={handleDownloadReport}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg
                className='w-6 h-6 animate-spin'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                className='w-6 h-6'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 19V5m0 14-4-4m4 4 4-4'
                />
              </svg>
              Download Report
            </>
          )}
        </button>
      </div>

      {/* Buttons for filtering the table */}
      <div className='justify-between items-center mb-4'>
        <div className='w-full sm:w-auto'>
          <div className='space-x-4 overflow-x-auto whitespace-nowrap hide-scrollbar'>
            {[
              'All',
              'New',
              'Approved',
              'Pending',
              'In Processing',
              'No Answering',
              'Declined',
              'Expire',
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                }}
                className={`py-2 px-4 rounded-full ${
                  activeFilter === filter
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

      {/* Mobile layout */}
      <div className='overflow-x-auto sm:hidden'>
        <div className='flex flex-col space-y-4 mb-3'>
          {displayedLeads.length > 0 ? (
            displayedLeads.map((row, index) => (
              <div key={row.id} className='bg-white shadow-md rounded-lg p-4'>
                <div className='flex justify-between mb-2'>
                  <span className='font-bold'>Name:</span>
                  <span>{row.customerDetails?.fullname || 'N/A'}</span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='font-bold'>Service:</span>
                  <span>{serviceNames[row.serviceId] || row.serviceId}</span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='font-bold'>Bank Chosen:</span>
                  <span>{bankNames[row.bankId] || row.bankId}</span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='font-bold'>Date:</span>
                  <span>
                    {row.submissionDate
                      ? row.submissionDate.toDate().toLocaleDateString()
                      : ''}
                  </span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='font-bold'>Status:</span>
                  <span className={getStatusClass(row.status)}>
                    {row.status
                      ? row.status.charAt(0).toUpperCase() +
                        row.status.slice(1)
                      : ''}
                  </span>
                </div>
                <div>
                  <ul className='grid grid-cols-2 border-t border-[#DEE2E6] justify-items-center items-center'>
                    <li
                      className='px-4 py-2 inline-flex gap-3 items-center font-medium text-lg text-[#212529] cursor-pointer'
                      onClick={() => handleViewLead(row.id)}
                    >
                      {/* View SVG Icon */}
                      <svg
                        width='16'
                        height='17'
                        viewBox='0 0 16 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z'
                          fill='#A726A7'
                        />
                      </svg>
                      View
                    </li>
                    <li
                      className={`px-4 py-2 inline-flex gap-3 items-center font-medium text-lg ${
                        row.status &&
                        ['approved', 'decline'].includes(row.status.toLowerCase())
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-[#212529] cursor-pointer'
                      }`}
                      onClick={() => {
                        if (
                          !(
                            row.status &&
                            ['approved', 'decline'].includes(
                              row.status.toLowerCase()
                            )
                          )
                        ) {
                          handleDeleteClick(row);
                        }
                      }}
                    >
                      {/* Delete SVG Icon */}
                      <svg
                        width='15'
                        height='17'
                        viewBox='0 0 15 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M0.523225 3.70354H1.9186V14.1687C1.9186 14.7701 2.15743 15.3467 2.58264 15.772C3.00785 16.1972 3.58468 16.4361 4.18605 16.4361H11.1628C11.7641 16.4361 12.3409 16.1972 12.7661 15.772C13.1913 15.3468 13.4301 14.7701 13.4301 14.1687V3.70354H14.4767C14.6637 3.70354 14.8364 3.60378 14.9299 3.44196C15.0234 3.28003 15.0234 3.08051 14.9299 2.91868C14.8364 2.75674 14.6637 2.65698 14.4767 2.65698H10.8139V2.48251C10.8139 1.9737 10.6118 1.4857 10.2521 1.12594C9.89218 0.766166 9.40418 0.563965 8.89538 0.563965H6.45346C5.94465 0.563965 5.45665 0.766172 5.09689 1.12594C4.73699 1.4857 4.53491 1.9737 4.53491 2.48263V2.6571L0.523287 2.65698C0.336288 2.65698 0.163642 2.75674 0.0700789 2.91868C-0.0233596 3.08049 -0.0233596 3.28004 0.0700789 3.44196C0.163639 3.60378 0.336282 3.70354 0.523287 3.70354H0.523225ZM12.3837 14.1687C12.3837 14.4925 12.2551 14.803 12.0261 15.032C11.7972 15.261 11.4866 15.3896 11.1628 15.3896H4.18605C3.86219 15.3896 3.55169 15.261 3.32271 15.032C3.09373 14.803 2.96502 14.4925 2.96502 14.1687V3.70354H12.3836L12.3837 14.1687ZM5.58136 2.48261H5.58124C5.58124 2.25133 5.67322 2.02953 5.83674 1.86589C6.00025 1.70237 6.22205 1.61051 6.45334 1.61051H8.89526C9.12655 1.61051 9.34834 1.70237 9.51186 1.86589C9.6755 2.02953 9.76736 2.25132 9.76736 2.48261V2.65708L5.58131 2.65696L5.58136 2.48261Z'
                          fill='#F47A7A'
                        />
                        <path
                          d='M7.67563 6.67276C7.53681 6.67276 7.40371 6.72787 7.30552 6.82606C7.20746 6.92412 7.15234 7.05722 7.15234 7.19604V13.4751C7.15234 13.662 7.25211 13.8348 7.41392 13.9282C7.57586 14.0216 7.77528 14.0216 7.93721 13.9282C8.09914 13.8348 8.19879 13.662 8.19879 13.4751V7.19604C8.19879 7.05723 8.14367 6.92412 8.04561 6.82606C7.94743 6.72788 7.81433 6.67276 7.67563 6.67276Z'
                          fill='#F47A7A'
                        />
                        <path
                          d='M9.58984 7.19605V13.4751C9.58984 13.662 9.68961 13.8348 9.85154 13.9282C10.0134 14.0216 10.2129 14.0216 10.3747 13.9282C10.5366 13.8348 10.6364 13.662 10.6364 13.4751V7.19605C10.6364 7.00905 10.5366 6.8364 10.3747 6.74284C10.2129 6.6494 10.0133 6.6494 9.85154 6.74284C9.68961 6.8364 9.58984 7.00904 9.58984 7.19605Z'
                          fill='#F47A7A'
                        />
                        <path
                          d='M5.23422 6.67276C5.09552 6.67276 4.96242 6.72787 4.86424 6.82606C4.76618 6.92412 4.71094 7.05722 4.71094 7.19604V13.4751C4.71094 13.662 4.8107 13.8348 4.97264 13.9282C5.13445 14.0216 5.33399 14.0216 5.49592 13.9282C5.65774 13.8348 5.7575 13.662 5.7575 13.4751V7.19604C5.7575 7.05723 5.70239 6.92412 5.6042 6.82606C5.50614 6.72788 5.37304 6.67276 5.23422 6.67276Z'
                          fill='#F47A7A'
                        />
                      </svg>
                      Delete
                    </li>
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center rounded-lg p-6'>
              <p className='text-gray-600 text-lg pt-20 pb-20'>
                No Leads Available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className='hidden sm:block'>
        <table className='min-w-full bg-white text-left'>
          <thead className='text-[#063E50] font-medium text-base border-b border-[#DEE2E6]'>
            <tr>
              <th className='px-4 py-2'>Sl No</th>
              <th className='px-4 py-2'>Name</th>
              <th className='px-4 py-2'>Service</th>
              <th className='px-4 py-2'>Bank Chosen</th>
              <th className='px-4 py-2'>Date</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody className='text-left text-base text-[#212529] font-normal'>
            {displayedLeads.length > 0 ? (
              displayedLeads.map((row, index) => (
                <tr key={row.id}>
                  <td className='px-4 py-2'>{index + 1}</td>
                  <td className='px-4 py-2'>
                    {row.customerDetails?.fullname || 'N/A'}
                  </td>
                  <td className='px-4 py-2'>
                    {serviceNames[row.serviceId] || row.serviceId}
                  </td>
                  <td className='px-4 py-2'>
                    {bankNames[row.bankId] || row.bankId}
                  </td>
                  <td className='px-4 py-2'>
                    {row.submissionDate
                      ? row.submissionDate.toDate().toLocaleDateString()
                      : ''}
                  </td>
                  <td className='px-4 py-2'>
                    <span className={getStatusClass(row.status)}>
                      {row.status
                        ? row.status.charAt(0).toUpperCase() +
                          row.status.slice(1)
                        : ''}
                    </span>
                  </td>

                  <td className='px-4 py-4 gap-6 inline-flex relative'>
                    <div
                      onClick={() => handleViewLead(row.id)}
                      className='cursor-pointer'
                    >
                      {/* View SVG Icon */}
                      <svg
                        width='16'
                        height='17'
                        viewBox='0 0 16 17'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z'
                          fill='#A726A7'
                        />
                      </svg>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteClick(row)}
                        disabled={
                          row.status &&
                          ['approved', 'decline'].includes(
                            row.status.toLowerCase()
                          )
                        }
                        className={`${
                          row.status &&
                          ['approved', 'decline'].includes(
                            row.status.toLowerCase()
                          )
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                      >
                        {/* Delete SVG Icon */}
                        <svg
                          width='15'
                          height='17'
                          viewBox='0 0 15 17'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M0.523225 3.70354H1.9186V14.1687C1.9186 14.7701 2.15743 15.3467 2.58264 15.772C3.00785 16.1972 3.58468 16.4361 4.18605 16.4361H11.1628C11.7641 16.4361 12.3409 16.1972 12.7661 15.772C13.1913 15.3468 13.4301 14.7701 13.4301 14.1687V3.70354H14.4767C14.6637 3.70354 14.8364 3.60378 14.9299 3.44196C15.0234 3.28003 15.0234 3.08051 14.9299 2.91868C14.8364 2.75674 14.6637 2.65698 14.4767 2.65698H10.8139V2.48251C10.8139 1.9737 10.6118 1.4857 10.2521 1.12594C9.89218 0.766166 9.40418 0.563965 8.89538 0.563965H6.45346C5.94465 0.563965 5.45665 0.766172 5.09689 1.12594C4.73699 1.4857 4.53491 1.9737 4.53491 2.48263V2.6571L0.523287 2.65698C0.336288 2.65698 0.163642 2.75674 0.0700789 2.91868C-0.0233596 3.08049 -0.0233596 3.28004 0.0700789 3.44196C0.163639 3.60378 0.336282 3.70354 0.523287 3.70354H0.523225ZM12.3837 14.1687C12.3837 14.4925 12.2551 14.803 12.0261 15.032C11.7972 15.261 11.4866 15.3896 11.1628 15.3896H4.18605C3.86219 15.3896 3.55169 15.261 3.32271 15.032C3.09373 14.803 2.96502 14.4925 2.96502 14.1687V3.70354H12.3836L12.3837 14.1687ZM5.58136 2.48261H5.58124C5.58124 2.25133 5.67322 2.02953 5.83674 1.86589C6.00025 1.70237 6.22205 1.61051 6.45334 1.61051H8.89526C9.12655 1.61051 9.34834 1.70237 9.51186 1.86589C9.6755 2.02953 9.76736 2.25132 9.76736 2.48261V2.65708L5.58131 2.65696L5.58136 2.48261Z'
                            fill='#F47A7A'
                          />
                          <path
                            d='M7.67563 6.67276C7.53681 6.67276 7.40371 6.72787 7.30552 6.82606C7.20746 6.92412 7.15234 7.05722 7.15234 7.19604V13.4751C7.15234 13.662 7.25211 13.8348 7.41392 13.9282C7.57586 14.0216 7.77528 14.0216 7.93721 13.9282C8.09914 13.8348 8.19879 13.662 8.19879 13.4751V7.19604C8.19879 7.05723 8.14367 6.92412 8.04561 6.82606C7.94743 6.72788 7.81433 6.67276 7.67563 6.67276Z'
                            fill='#F47A7A'
                          />
                          <path
                            d='M9.58984 7.19605V13.4751C9.58984 13.662 9.68961 13.8348 9.85154 13.9282C10.0134 14.0216 10.2129 14.0216 10.3747 13.9282C10.5366 13.8348 10.6364 13.662 10.6364 13.4751V7.19605C10.6364 7.00905 10.5366 6.8364 10.3747 6.74284C10.2129 6.6494 10.0133 6.6494 9.85154 6.74284C9.68961 6.8364 9.58984 7.00904 9.58984 7.19605Z'
                            fill='#F47A7A'
                          />
                          <path
                            d='M5.23422 6.67276C5.09552 6.67276 4.96242 6.72787 4.86424 6.82606C4.76618 6.92412 4.71094 7.05722 4.71094 7.19604V13.4751C4.71094 13.662 4.8107 13.8348 4.97264 13.9282C5.13445 14.0216 5.33399 14.0216 5.49592 13.9282C5.65774 13.8348 5.7575 13.662 5.7575 13.4751V7.19604C5.7575 7.05723 5.70239 6.92412 5.6042 6.82606C5.50614 6.72788 5.37304 6.67276 5.23422 6.67276Z'
                            fill='#F47A7A'
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className='px-4 py-8 text-center text-gray-500'
                  colSpan='7'
                >
                  <div className='flex flex-col items-center justify-center'>
                    <p className='text-lg'>No Leads Available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-lg w-11/12 sm:w-1/3'>
            <div className='px-6 py-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Confirm Deletion
              </h2>
              <p className='mt-2 text-gray-600'>
                Are you sure you want to delete the lead{' '}
                <span className='font-bold'>
                  {leadToDelete?.customerDetails?.fullname || 'this lead'}
                </span>
                ?
              </p>
            </div>
            <div className='flex justify-end px-6 py-4 space-x-2'>
              <button
                onClick={handleCancelDelete}
                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeads;
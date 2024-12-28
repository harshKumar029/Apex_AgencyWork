// src/Components/Earnings.jsx

import React, { useState, useEffect } from 'react';
import MoneyIcon from '../assets/icon/MoneyIcon.svg';
import Paidtick from '../assets/icon/Paidtick.svg';
import Warning from '../assets/icon/Warning.svg';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { generateEarningsCSV } from '../utils/earningsCSV';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { generateEarningsCSV } from '../utils/earningsCSV';

const Earnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [salesEarnings, setSalesEarnings] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [otherEarnings, setOtherEarnings] = useState(0);
  const [hasPendingWithdrawRequest, setHasPendingWithdrawRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [earningsHistory, setEarningsHistory] = useState([]); // For CSV export
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State for handling Withdraw button
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // 1) Fetch main user doc
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setTotalEarnings(parseFloat(userData.earnings) || 0);
          } else {
            console.warn('User data not found');
            if (isMounted) {
              setTimeout(fetchData, 3000);
            }
            return;
          }

          // 2) Fetch latest paidHistory for paidAmount
          const paidHistoryRef = collection(db, 'users', user.uid, 'paidHistory');
          const paidHistoryQuery = query(paidHistoryRef, orderBy('date', 'desc'), limit(1));
          const paidHistorySnapshot = await getDocs(paidHistoryQuery);
          let recentPaymentAmount = 0;
          if (!paidHistorySnapshot.empty) {
            const docSnap = paidHistorySnapshot.docs[0];
            const data = docSnap.data();
            recentPaymentAmount = parseFloat(data.amount) || 0;
          }
          setPaidAmount(recentPaymentAmount);

          // 3) Fetch earningsHistory
          const earningsHistoryRef = collection(db, 'users', user.uid, 'earningsHistory');
          const earningsHistorySnapshot = await getDocs(earningsHistoryRef);

          let totalPending = 0;
          let totalSalesEarnings = 0;
          let totalReferralEarnings = 0;
          let totalOtherEarnings = 0;
          const earningsHistoryData = [];

          earningsHistorySnapshot.forEach((dSnap) => {
            const data = dSnap.data();
            const amount = parseFloat(data.amount) || 0;
            earningsHistoryData.push({ id: dSnap.id, ...data });

            // Sum by type
            if (data.type === 'sale') {
              totalSalesEarnings += amount;
            } else if (data.type === 'referral') {
              totalReferralEarnings += amount;
            } else if (data.type === 'bonus') {
              totalOtherEarnings += amount;
            }

            // Pending
            if (
              data.status === 'unpaid' &&
              ['sale', 'referral', 'bonus'].includes(data.type)
            ) {
              totalPending += amount;
            }
          });

          setPendingAmount(totalPending);
          setSalesEarnings(totalSalesEarnings);
          setReferralEarnings(totalReferralEarnings);
          setOtherEarnings(totalOtherEarnings);
          setEarningsHistory(earningsHistoryData);

          // 4) Check for an existing pending withdrawal request
          const withdrawRequestRef = collection(db, 'withdrawRequest');
          const wQuery = query(
            withdrawRequestRef,
            where('userId', '==', user.uid),
            where('status', '==', 'pending') // all-lowercase
          );
          const withdrawSnap = await getDocs(wQuery);
          setHasPendingWithdrawRequest(!withdrawSnap.empty);

          if (isMounted) {
            setIsLoading(false);
          }
        } else {
          console.warn('User not authenticated');
          if (isMounted) {
            setTimeout(fetchData, 3000);
          }
        }
      } catch (err) {
        console.error('Error fetching earnings data:', err);
        if (isMounted) {
          setTimeout(fetchData, 3000);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle CSV Download
  const downloadReport = () => {
    const csvContent = generateEarningsCSV(earningsHistory);

    // Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Link
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'earnings_history.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle Withdraw
  const handleWithdrawRequest = async () => {
    setIsWithdrawing(true);
    try {
      const user = auth.currentUser;
      if (user) {
        // Collect all unpaid earnings
        const unpaidEarnings = earningsHistory.filter(
          (earning) =>
            earning.status === 'unpaid' &&
            ['sale', 'referral', 'bonus'].includes(earning.type)
        );
        if (unpaidEarnings.length === 0) {
          alert('No pending earnings to withdraw.');
          return;
        }

        const earningIds = unpaidEarnings.map((earn) => earn.id);
        const withdrawRequestRef = collection(db, 'withdrawRequest');

        // Create a new doc with status = 'pending' (all-lowercase)
        await addDoc(withdrawRequestRef, {
          userId: user.uid,
          amount: pendingAmount,
          date: Timestamp.now(),
          status: 'pending', // changed to all-lowercase
          earningIds: earningIds,
        });

        setShowSuccessModal(true);
        setHasPendingWithdrawRequest(true);
      } else {
        alert('User not authenticated.');
      }
    } catch (err) {
      console.error('Error submitting withdraw request:', err);
      alert('Failed to submit withdraw request.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Check if the withdraw button is disabled
  const isWithdrawButtonDisabled = hasPendingWithdrawRequest || pendingAmount === 0 || isWithdrawing;

  if (isLoading) {
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

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className='flex justify-between'>
        <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Earnings</h1>
        <div className='flex sm:hidden items-center justify-center'>
          <button
            className="flex items-center gap-3 text-[#063E50] py-2 px-4 rounded-full"
            onClick={downloadReport}
          >
            <svg
              width="10"
              height="12"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 8L6 13L11 8" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 13L6 1" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Row of Cards */}
      <div className="flex justify-between mb-6 gap-4">
        {/* Card 1 - Total Earnings */}
        <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-60">
          <img
            src={MoneyIcon}
            alt="MoneyIcon"
            className="w-16 h-16 sm:mr-4 bg-[#8416DB0F] rounded-full p-4"
          />
          <div className='text-center mx-auto'>
            <h2 className="text-[#063E50] font-normal text-base">Total Earnings</h2>
            <p className="text-[#212529] font-semibold text-xl">
              ₹{totalEarnings.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Card 2 - Paid */}
        <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-60">
          <img
            src={Paidtick}
            alt="Paidtick"
            className="w-16 h-16 sm:mr-4 bg-[#5DD32524] rounded-full p-4"
          />
          <div className='text-center mx-auto '>
            <h2 className="text-[#063E50] font-normal text-base">Paid</h2>
            <p className="text-[#212529] font-semibold text-xl">
              ₹{paidAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Card 3 - Pending */}
        <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-60">
          <img
            src={Warning}
            alt="Warning"
            className="w-16 h-16 sm:mr-4 bg-[#F47A7A14] rounded-full p-4"
          />
          <div className='text-center mx-auto'>
            <h2 className="text-[#063E50] font-normal text-base">Pending</h2>
            <p className="text-[#212529] font-semibold text-xl">
              ₹{pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className='sm:flex hidden items-center justify-center'>
          <button
            className="border border-[#063E50] bg-white_custom flex items-center gap-3 text-[#063E50] py-2 px-4 rounded-full"
            onClick={downloadReport}
          >
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 8L6 13L11 8" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 13L6 1" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Column of Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Sales Earnings */}
        <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
          <h2 className="text-[#063E50] font-normal text-base">Sales Earnings</h2>
          <p className="text-[#212529] font-semibold text-xl">
            ₹{salesEarnings.toLocaleString()}
          </p>
        </div>

        {/* Referral Earnings */}
        <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
          <h2 className="text-[#063E50] font-normal text-base">Referral Earnings</h2>
          <p className="text-[#212529] font-semibold text-xl">
            ₹{referralEarnings.toLocaleString()}
          </p>
        </div>

        {/* Other Earnings */}
        <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
          <h2 className="text-[#063E50] font-normal text-base">Other Earnings</h2>
          <p className="text-[#212529] font-semibold text-xl">
            ₹{otherEarnings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Withdraw Button */}
      <div className="flex justify-center">
        <button
          className={`py-2 px-4 rounded-full w-full sm:w-auto text-white flex items-center justify-center ${
            isWithdrawButtonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#063E50] hover:bg-[#052d38]'
          }`}
          onClick={handleWithdrawRequest}
          disabled={isWithdrawButtonDisabled}
        >
          {isWithdrawing ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : hasPendingWithdrawRequest ? (
            'Your withdrawal request is pending'
          ) : (
            'Withdraw Amount'
          )}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-lg w-11/12 sm:w-1/3'>
            <div className='px-6 py-4'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Success!
              </h2>
              <p className='mt-2 text-gray-600'>
                Your withdraw request has been submitted successfully.
              </p>
            </div>
            <div className='flex justify-end px-6 py-4'>
              <button
                onClick={() => setShowSuccessModal(false)}
                className='px-4 py-2 bg-[#063E50] text-white rounded-md hover:bg-[#052d38]'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
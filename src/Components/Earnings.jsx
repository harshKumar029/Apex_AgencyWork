// src/Components/Earnings.jsx

import React, { useState, useEffect } from 'react';
import MoneyIcon from '../assets/icon/MoneyIcon.svg';
import Paidtick from '../assets/icon/Paidtick.svg';
import Warning from '../assets/icon/Warning.svg';
import { auth, db } from '../firebase'; // Ensure this path is correct
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const Earnings = () => {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [salesEarnings, setSalesEarnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Fetch user data
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setTotalEarnings(userData.earnings || 0);
                    } else {
                        setError('User data not found');
                    }

                    // Fetch Paid History
                    const paidHistoryRef = collection(db, 'users', user.uid, 'paidHistory');
                    const paidHistorySnapshot = await getDocs(paidHistoryRef);

                    let totalPaid = 0;
                    paidHistorySnapshot.forEach((doc) => {
                        const data = doc.data();
                        totalPaid += data.amount || 0;
                    });
                    setPaidAmount(totalPaid);

                    // Fetch Earnings History
                    const earningsHistoryRef = collection(db, 'users', user.uid, 'earningsHistory');
                    const earningsHistorySnapshot = await getDocs(earningsHistoryRef);

                    let totalPending = 0;
                    let totalSalesEarnings = 0;
                    earningsHistorySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.status === 'unpaid') {
                            totalPending += data.amount || 0;
                        }
                        if (data.leadId) {
                            totalSalesEarnings += data.amount || 0;
                        }
                    });
                    setPendingAmount(totalPending);
                    setSalesEarnings(totalSalesEarnings);
                } else {
                    setError('User not authenticated');
                }
            } catch (err) {
                console.error('Error fetching earnings data:', err);
                setError('Failed to load earnings data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-10">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
            <div className='flex justify-between'>
                <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Earnings</h1>
                <div className='flex sm:hidden items-center justify-center'>
                    <button className="flex items-center gap-3 text-[#063E50] py-2 px-4 rounded-full">
                        <svg width="10" height="12" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8L6 13L11 8" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 13L6 1" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download Report
                    </button>
                </div>
            </div>

            {/* Row of Cards */}
            <div className="flex flex-wrap justify-between mb-6 gap-4">
                {/* Card 1 - Total Earnings */}
                <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
                    <img src={MoneyIcon} alt="MoneyIcon" className="w-16 h-16 sm:mr-4 bg-[#8416DB0F] rounded-full p-4" />
                    <div className='text-center mx-auto'>
                        <h2 className="text-[#063E50] font-normal text-base">Total Earnings</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                </div>

                {/* Card 2 - Paid */}
                <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
                    <img src={Paidtick} alt="Paidtick" className="w-16 h-16 sm:mr-4 bg-[#5DD32524] rounded-full p-4" />
                    <div className='text-center mx-auto'>
                        <h2 className="text-[#063E50] font-normal text-base">Paid</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹{paidAmount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Card 3 - Pending */}
                <div className="flex items-center flex-col bg-white_custom sm:flex-row border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
                    <img src={Warning} alt="Warning" className="w-16 h-16 sm:mr-4 bg-[#F47A7A14] rounded-full p-4" />
                    <div className='text-center mx-auto'>
                        <h2 className="text-[#063E50] font-normal text-base">Pending</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹{pendingAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div className='sm:flex hidden items-center justify-center'>
                    <button className="border border-[#063E50] bg-white_custom flex items-center gap-3 text-[#063E50] py-2 px-4 rounded-full">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8L6 13L11 8" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 13L6 1" stroke="#063E50" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download Report
                    </button>
                </div>
            </div>

            {/* Column of Cards */}
            <div className="grid grid-cols-1 gap-4">
                {/* Sales Earnings */}
                <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Sales Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹{salesEarnings.toLocaleString()}</p>
                </div>

                {/* Referral Earnings */}
                <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Referral Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹0</p>
                </div>

                {/* Other Earnings */}
                <div className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Other Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹0</p>
                </div>
            </div>
        </div>
    );
};

export default Earnings;

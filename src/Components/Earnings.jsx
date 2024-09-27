import React from 'react';
import MoneyIcon from '../assets/icon/MoneyIcon.svg'
import Paidtick from '../assets/icon/Paidtick.svg'
import Warning from '../assets/icon/Warning.svg'

const Earnings = () => {
    return (
        <div className=' w-[95%] m-auto mt-5'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Earnings</h1>

            {/* Row of Cards */}
            <div className="flex justify-between mb-6">
                {/* Card 1 */}
                <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4 w-1/5">
                    <img src={MoneyIcon} alt="MoneyIcon" className="w-16 h-16 mr-4 bg-[#8416DB0F] rounded-full p-4" />
                    <div>
                        <h2 className="text-[#063E50] font-normal text-base">Total Earnings</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹23,000</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4 w-1/5">
                    <img src={Paidtick} alt="Paidtick" className="w-16 h-16 mr-4 bg-[#5DD32524] rounded-full p-4" />
                    <div>
                        <h2 className="text-[#063E50] font-normal text-base">Paid</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹20,000</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4  w-1/5">
                    <img src={Warning} alt="Warning" className="w-16 h-16 mr-4 bg-[#F47A7A14] rounded-full p-4" />
                    <div>
                        <h2 className="text-[#063E50] font-normal text-base">Pending</h2>
                        <p className="text-[#212529] font-semibold text-xl">₹2,000</p>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <button className="border border-[#063E50] flex items-center gap-3 text-[#063E50] py-2 px-4 rounded-full">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8L6 13L11 8" stroke="#063E50" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6 13L6 1" stroke="#063E50" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        Download Report
                    </button>
                </div>

            </div>

            {/* Column of Cards */}
            <div className="grid grid-cols-1 gap-4">
                {/* Card 1 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Sales Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹23,000</p>
                </div>

                {/* Card 2 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Referral Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹0</p>
                </div>

                {/* Card 3 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-normal text-base">Other Earnings</h2>
                    <p className="text-[#212529] font-semibold text-xl">₹0</p>
                </div>
            </div>
        </div>
    );
};

export default Earnings;

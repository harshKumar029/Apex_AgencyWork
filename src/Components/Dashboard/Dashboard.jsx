import React from 'react';
import { useNavigate } from 'react-router-dom';
import Bank from '../../assets/icon/DashboardIcon/Bank.svg'
import BusinessLoan from '../../assets/icon/DashboardIcon/BusinessLoan.svg'
import CarLoan from '../../assets/icon/DashboardIcon/CarLoan.svg'
import Credit from '../../assets/icon/DashboardIcon/Credit.svg'
import HomeLoan from '../../assets/icon/DashboardIcon/HomeLoan.svg'
import Insurance from '../../assets/icon/DashboardIcon/Insurance.svg'
import Loan from '../../assets/icon/DashboardIcon/Loan.svg'
import LoanAgainstProperty from '../../assets/icon/DashboardIcon/LoanAgainstProperty.svg'
import MagnetCard from '../../assets/icon/DashboardIcon/MagnetCard.svg'

const Dashboard = () => {
  const navigate = useNavigate();
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


  return (
    <div className=' w-[95%] m-auto my-5'>

      {/* Row of Cards */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
        {/* Card 1 - Full width on mobile, flex-grow to prevent excess space on desktop */}
        <div className="flex flex-col items-center sm:items-start sm:flex-grow py-4 w-full justify-center sm:w-auto">
          <div>
            <h2 className="text-[#232323] font-semibold text-3xl">Welcome Shreya Verma!</h2>
            <p className="text-[#ADB5BD] font-normal text-xl">Explore our all features and services.</p>
          </div>
        </div>

        {/* Container for Cards 2, 3, and 4 */}
        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0">
          {/* Card 2 */}
          <div className=" hidden sm:flex items-end sm:items-center justify-end rounded-3xl p-4 w-full sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-base">Your Unique ID</h2>
              <p className="text-[#063E50] font-normal underline text-xs">123456</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center border border-[#DEE2E6] rounded-3xl p-4 w-full sm:w-auto">
            <div>
              <h2 className="text-[#232323] font-semibold text-base">Your offer Letter</h2>
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


      {/* </div> */}

      {/* Column of Cards */}
      {/* <div className="grid grid-cols-1 gap-4">
        
    </div> */}
      <div>
        <div className="flex items-center py-4 w-1/1">
          <div>
            <h2 className="text-[#343C6A]  font-medium text-2xl">Our Services</h2>
            <p className="text-[#495057] font-light text-base">
              Choose from the services below</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cardData.map((card) => (
            <div key={card.id} className='border border-[#DEE2E6] rounded-3xl'>
              <div className="flex items-center  p-4 ">
                <img src={card.icon} alt="MoneyIcon" className="w-16 h-16 mr-4" />
                <div>
                  <h2 className="text-[#232323] font-semibold text-xl">{card.title}</h2>
                  <p onClick={() => navigate('/Dashboard/selectbank')} className="text-[#063E50] cursor-pointer font-normal underline text-base">{card.apply}</p>
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

// src/Components/ReferAndEarn.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

const ReferAndEarn = () => {
  const [uniqueID, setUniqueID] = useState('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [referralList, setReferralList] = useState([]);
  const [loading, setLoading] = useState(true);
  // Removed error state

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user's uniqueID
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          let userData;
          if (userDocSnap.exists()) {
            userData = userDocSnap.data();
            setUniqueID(userData.uniqueID || '');
          }

          // Fetch referrals made by the user
          const referralsQuery = query(
            collection(db, 'referrals'),
            where('referringUserId', '==', user.uid)
          );
          const referralsSnapshot = await getDocs(referralsQuery);

          const referrals = [];
          let successfulCount = 0;

          // Prepare an array of promises for fetching referred users
          const referredUserPromises = referralsSnapshot.docs.map(async (referralDoc) => {
            const referralData = referralDoc.data();
            const referredUserId = referralData.referredUserId;
            const status = referralData.status || 'Pending';

            // Fetch referred user's data
            const referredUserDocRef = doc(db, 'users', referredUserId);
            const referredUserDocSnap = await getDoc(referredUserDocRef);
            let referredUserData = { fullname: 'N/A', mobile: 'N/A' };
            if (referredUserDocSnap.exists()) {
              referredUserData = referredUserDocSnap.data();
            }

            // Count successful referrals
            if (
              status.toLowerCase() === 'successful' ||
              status.toLowerCase() === 'success' ||
              status.toLowerCase() === 'approved'
            ) {
              successfulCount++;
            }

            // Collect referral information
            referrals.push({
              id: referralDoc.id,
              fullname: referredUserData.fullname || 'N/A',
              mobile: referredUserData.mobile || 'N/A',
              status: status.charAt(0).toUpperCase() + status.slice(1),
            });
          });

          // Wait for all referred user data to be fetched
          await Promise.all(referredUserPromises);

          setReferralList(referrals);
          setTotalReferrals(referrals.length);
          setSuccessfulReferrals(successfulCount);

          // Fetch earnings from 'earnings' collection where type is 'referral'
          const earningsQuery = query(
            collection(db, 'earnings'),
            where('userId', '==', user.uid),
            where('type', '==', 'referral')
          );
          const earningsSnapshot = await getDocs(earningsQuery);

          let totalEarnings = 0;
          for (const earningDoc of earningsSnapshot.docs) {
            const earningData = earningDoc.data();
            totalEarnings += earningData.amount || 0;
          }
          setReferralEarnings(totalEarnings);
          setLoading(false); // Move loading false here after successful data fetch
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
        // Retry fetching data after a delay
        setTimeout(fetchReferralData, 5000); // retry after 5 seconds
      }
    };

    fetchReferralData();
  }, []);

  const shareMessage = `Join Apex and start earning! Use my referral code: ${uniqueID}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(uniqueID);
    alert('Referral code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className='flex flex-col justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:w-[95%] md:px-0 m-auto mt-5 mb-28 sm:my-5">
      <h1 className="text-3xl font-bold text-[#063E50] mb-6"></h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Display Referral Code */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[#063E50] mb-2">
            Your Referral Code. Invite more people, more earnings!
          </h2>
          <div className="flex justify-center items-center space-x-2">
            <span className="text-2xl font-bold text-[#063E50] tracking-widest">
              {uniqueID}
            </span>
            <button
              onClick={handleCopy}
              className="text-[#063E50] hover:text-blue-700 focus:outline-none"
              title="Copy Referral Code"
            >
              {/* Copy Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M15 3h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[#063E50] mb-4">
            Share Your Referral Code
          </h2>
          <div className="flex justify-center flex-wrap gap-4">
            <FacebookShareButton url="https://apex.com/signup" quote={shareMessage}>
              <FacebookIcon size={48} round />
            </FacebookShareButton>
            <TwitterShareButton url="https://apex.com/signup" title={shareMessage}>
              <TwitterIcon size={48} round />
            </TwitterShareButton>
            <WhatsappShareButton url="https://apex.com/signup" title={shareMessage}>
              <WhatsappIcon size={48} round />
            </WhatsappShareButton>
            <EmailShareButton url="https://apex.com/signup" subject="Join Apex" body={shareMessage}>
              <EmailIcon size={48} round />
            </EmailShareButton>
          </div>
        </div>

        {/* Referral Statistics */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-[#063E50] mb-4">
            Your Referral Statistics
          </h2>
          <div className="flex justify-center flex-wrap gap-8">
            <div className="w-40">
              <p className="text-4xl font-bold text-[#063E50]">{totalReferrals}</p>
              <p className="text-gray-600">Total Referrals</p>
            </div>
            <div className="w-40">
              <p className="text-4xl font-bold text-[#063E50]">{successfulReferrals}</p>
              <p className="text-gray-600">Successful Referrals</p>
            </div>
            <div className="w-40">
              <p className="text-4xl font-bold text-[#063E50]">
                ₹{referralEarnings}
              </p>
              <p className="text-gray-600">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Referral List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#063E50] mb-4">
            Your Referrals
          </h2>
          {referralList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Mobile Number</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {referralList.map((referral, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{referral.fullname}</td>
                      <td className="py-2 px-4">{referral.mobile}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                            referral.status.toLowerCase() === 'successful' ||
                            referral.status.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {referral.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600">You have not referred anyone yet.</p>
          )}
        </div>
      </div>
      <div className='bg-white shadow-md rounded-lg'>
        {/* How It Works */}
        <div className="mt-12 p-6">
          <h2 className="text-2xl font-bold text-[#063E50] mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-4.553a2 2 0 00-2.828-2.828L12 7.172 7.275 2.447a2 2 0 10-2.828 2.828L9 10m6 0v10m-6 0V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#063E50] mb-2">
                Share Your Code
              </h3>
              <p className="text-gray-600">
                Share your unique referral code with friends and family.
              </p>
            </div>
            {/* Step 2 */}
            <div className="text-center p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l-1.586-1.586a2 2 0 00-2.828 0L9 8l-4 4h11.586a2 2 0 001.414-.586l1.586-1.586a2 2 0 000-2.828L16 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 17l-4 4m0 0l4-4m-4 4h7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#063E50] mb-2">
                They Sign Up
              </h3>
              <p className="text-gray-600">
                Your referrals sign up using your code and join Apex.
              </p>
            </div>
            {/* Step 3 */}
            <div className="text-center p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {/* Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 12l-1.5 1.5L8 12m0 0l-1.5 1.5L5 12m3 0l1.5-1.5L11 12m0 0l1.5-1.5L14 12m-3 0l-1.5 1.5L8 12" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15h14M5 19h14" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#063E50] mb-2">
                Earn Rewards
              </h3>
              <p className="text-gray-600">
                You will earn rewards when your referral makes their first sale. More referrals, more earnings!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReferAndEarn;
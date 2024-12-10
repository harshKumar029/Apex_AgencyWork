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
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }} />
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
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        {/* Referral List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#063E50] mb-4 text-center">
            Your Referrals User Details
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
                          className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${referral.status.toLowerCase() === 'successful' ||
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
        <div className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-[#063E50] mb-4 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                {/* Icon */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-4.553a2 2 0 00-2.828-2.828L12 7.172 7.275 2.447a2 2 0 10-2.828 2.828L9 10m6 0v10m-6 0V10" />
                </svg> */}
                <svg className="h-12 w-12 text-[#063E50]" xmlns="http://www.w3.org/2000/svg" fill='#063E50' x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                  <path d="M 40 0 C 34.53125 0 30.066406 4.421875 30 9.875 L 15.90625 16.9375 C 14.25 15.71875 12.207031 15 10 15 C 4.488281 15 0 19.488281 0 25 C 0 30.511719 4.488281 35 10 35 C 12.207031 35 14.25 34.28125 15.90625 33.0625 L 30 40.125 C 30.066406 45.578125 34.53125 50 40 50 C 45.511719 50 50 45.511719 50 40 C 50 34.488281 45.511719 30 40 30 C 37.875 30 35.902344 30.675781 34.28125 31.8125 L 20.625 25 L 34.28125 18.1875 C 35.902344 19.324219 37.875 20 40 20 C 45.511719 20 50 15.511719 50 10 C 50 4.488281 45.511719 0 40 0 Z M 40 2 C 44.429688 2 48 5.570313 48 10 C 48 14.429688 44.429688 18 40 18 C 38.363281 18 36.859375 17.492188 35.59375 16.65625 C 35.46875 16.238281 35.089844 15.949219 34.65625 15.9375 C 34.652344 15.933594 34.628906 15.941406 34.625 15.9375 C 33.230469 14.675781 32.292969 12.910156 32.0625 10.9375 C 32.273438 10.585938 32.25 10.140625 32 9.8125 C 32.101563 5.472656 35.632813 2 40 2 Z M 30.21875 12 C 30.589844 13.808594 31.449219 15.4375 32.65625 16.75 L 19.8125 23.1875 C 19.472656 21.359375 18.65625 19.710938 17.46875 18.375 Z M 10 17 C 11.851563 17 13.554688 17.609375 14.90625 18.65625 C 14.917969 18.664063 14.925781 18.679688 14.9375 18.6875 C 14.945313 18.707031 14.957031 18.730469 14.96875 18.75 C 15.054688 18.855469 15.160156 18.9375 15.28125 19 C 15.285156 19.003906 15.308594 18.996094 15.3125 19 C 16.808594 20.328125 17.796875 22.222656 17.96875 24.34375 C 17.855469 24.617188 17.867188 24.925781 18 25.1875 C 17.980469 25.269531 17.96875 25.351563 17.96875 25.4375 C 17.847656 27.65625 16.839844 29.628906 15.28125 31 C 15.1875 31.058594 15.101563 31.132813 15.03125 31.21875 C 13.65625 32.332031 11.914063 33 10 33 C 5.570313 33 2 29.429688 2 25 C 2 20.570313 5.570313 17 10 17 Z M 19.8125 26.8125 L 32.65625 33.25 C 31.449219 34.5625 30.589844 36.191406 30.21875 38 L 17.46875 31.625 C 18.65625 30.289063 19.472656 28.640625 19.8125 26.8125 Z M 40 32 C 44.429688 32 48 35.570313 48 40 C 48 44.429688 44.429688 48 40 48 C 35.570313 48 32 44.429688 32 40 C 32 37.59375 33.046875 35.433594 34.71875 33.96875 C 34.742188 33.949219 34.761719 33.929688 34.78125 33.90625 C 34.785156 33.902344 34.808594 33.910156 34.8125 33.90625 C 34.972656 33.839844 35.113281 33.730469 35.21875 33.59375 C 36.554688 32.597656 38.199219 32 40 32 Z"></path>
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
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l-1.586-1.586a2 2 0 00-2.828 0L9 8l-4 4h11.586a2 2 0 001.414-.586l1.586-1.586a2 2 0 000-2.828L16 7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 17l-4 4m0 0l4-4m-4 4h7" />
                </svg> */}
                <svg className="h-12 w-12 text-[#063E50]" width="59" height="53" viewBox="0 0 59 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.9999 15C26.8298 15 24.0106 16.5306 22.2158 18.906C21.8296 19.4172 21.6364 19.6728 21.6427 20.0183C21.6476 20.2852 21.8152 20.6219 22.0252 20.7867C22.297 21 22.6737 21 23.4271 21H36.5726C37.326 21 37.7027 21 37.9745 20.7867C38.1845 20.6219 38.3521 20.2852 38.357 20.0183C38.3633 19.6728 38.1702 19.4172 37.7839 18.906C35.9891 16.5306 33.1699 15 29.9999 15Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M30 12C32.4853 12 34.5 9.98528 34.5 7.5C34.5 5.01472 32.4853 3 30 3C27.5147 3 25.5 5.01472 25.5 7.5C25.5 9.98528 27.5147 12 30 12Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M46.9999 44C43.8298 44 41.0106 45.5306 39.2158 47.906C38.8296 48.4172 38.6364 48.6728 38.6427 49.0183C38.6476 49.2852 38.8152 49.6219 39.0252 49.7867C39.297 50 39.6737 50 40.4271 50H53.5726C54.326 50 54.7027 50 54.9745 49.7867C55.1845 49.6219 55.3521 49.2852 55.357 49.0183C55.3633 48.6728 55.1702 48.4172 54.7839 47.906C52.9891 45.5306 50.1699 44 46.9999 44Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M47 41C49.4853 41 51.5 38.9853 51.5 36.5C51.5 34.0147 49.4853 32 47 32C44.5147 32 42.5 34.0147 42.5 36.5C42.5 38.9853 44.5147 41 47 41Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M11.9999 44C8.82978 44 6.01065 45.5306 4.21585 47.906C3.82956 48.4172 3.63641 48.6728 3.64273 49.0183C3.64761 49.2852 3.81521 49.6219 4.02522 49.7867C4.29704 50 4.67372 50 5.42708 50H18.5726C19.326 50 19.7027 50 19.9745 49.7867C20.1845 49.6219 20.3521 49.2852 20.357 49.0183C20.3633 48.6728 20.1702 48.4172 19.7839 47.906C17.9891 45.5306 15.1699 44 11.9999 44Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 41C14.4853 41 16.5 38.9853 16.5 36.5C16.5 34.0147 14.4853 32 12 32C9.51472 32 7.5 34.0147 7.5 36.5C7.5 38.9853 9.51472 41 12 41Z" stroke="#063E50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M30.1177 33.4229L25.0967 38.3106C24.7038 38.6931 24.0752 38.6847 23.6928 38.2917V38.2917C23.3103 37.8988 23.3187 37.2703 23.7116 36.8878L28.7326 32L30.1177 33.4229Z" fill="#063E50" />
                  <path d="M29.5721 25.0015C30.1215 25.0029 30.5658 25.4493 30.5645 25.9987L30.5479 33.0039L28.5584 32.9992L28.575 25.994C28.5763 25.4446 29.0227 25.0002 29.5721 25.0015V25.0015Z" fill="#063E50" />
                  <path d="M35.425 38.2915C35.0425 38.6844 34.4139 38.6929 34.021 38.3104L29.0001 33.4226L30.3852 31.9998L35.4061 36.8875C35.799 37.27 35.8075 37.8986 35.425 38.2915V38.2915Z" fill="#063E50" />
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
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#063E50]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 12l-1.5 1.5L8 12m0 0l-1.5 1.5L5 12m3 0l1.5-1.5L11 12m0 0l1.5-1.5L14 12m-3 0l-1.5 1.5L8 12" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15h14M5 19h14" />
                </svg> */}
                <svg className="h-12 w-12" fill="#063E50" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54.558 54.559" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M27.28,3.911c-8.024,0-14.553,6.528-14.553,14.552s6.528,14.553,14.553,14.553c8.024,0,14.552-6.529,14.552-14.553 S35.304,3.911,27.28,3.911z M27.28,31.016c-6.921,0-12.553-5.631-12.553-12.553c0-6.921,5.631-12.552,12.553-12.552 c6.921,0,12.552,5.631,12.552,12.552C39.832,25.384,34.201,31.016,27.28,31.016z"></path> <path d="M27.28,7.704c-0.552,0-1,0.448-1,1c0,0.552,0.448,1,1,1c4.83,0,8.758,3.929,8.758,8.759c0,0.552,0.448,1,1,1s1-0.448,1-1 C38.038,12.53,33.212,7.704,27.28,7.704z"></path> <path d="M45.743,18.463C45.743,8.282,37.46,0,27.28,0C17.1,0,8.816,8.282,8.816,18.463c0,5.947,2.847,11.471,7.647,14.946 l-5.877,15.06c-0.124,0.317-0.078,0.676,0.122,0.95c0.2,0.276,0.534,0.437,0.865,0.412l6.676-0.366l4.663,4.791 c0.19,0.196,0.45,0.303,0.717,0.303c0.066,0,0.132-0.006,0.199-0.02c0.333-0.066,0.609-0.3,0.733-0.615l2.719-6.968L30,53.924 c0.123,0.315,0.399,0.549,0.732,0.615c0.066,0.014,0.133,0.02,0.199,0.02c0.267,0,0.525-0.106,0.717-0.303l4.663-4.791 l6.676,0.366c0.022,0.001,0.045,0.003,0.065,0.001c0.549,0.008,1.01-0.443,1.01-1c0-0.197-0.057-0.381-0.156-0.537l-5.811-14.886 C42.896,29.934,45.743,24.41,45.743,18.463z M23.262,51.747l-3.897-4.004c-0.189-0.194-0.448-0.304-0.717-0.304 c-0.018,0-0.037,0-0.055,0.002l-5.579,0.306l5.163-13.228c0.019,0.011,0.039,0.02,0.058,0.029 c0.225,0.127,0.457,0.239,0.686,0.355c0.184,0.095,0.365,0.195,0.552,0.283c0.082,0.039,0.167,0.07,0.249,0.106 c1.544,0.698,3.171,1.181,4.85,1.429c0.008,0.002,0.016,0.004,0.024,0.004c0.365,0.053,0.734,0.09,1.104,0.121 c0.096,0.008,0.191,0.021,0.288,0.027c0.294,0.02,0.59,0.025,0.886,0.032c0.136,0.003,0.271,0.015,0.406,0.015 c0.041,0,0.082-0.006,0.123-0.006c0.513-0.005,1.027-0.027,1.545-0.077c0.039-0.003,0.077-0.003,0.115-0.007 c0.006,0,0.013,0,0.021-0.001l-2.735,7.004c0,0,0,0.001,0,0.002L23.262,51.747z M35.966,47.441 c-0.285-0.012-0.57,0.095-0.771,0.302l-3.896,4.004l-2.944-7.543l3.021-7.741c0.34-0.076,0.674-0.171,1.006-0.268 c0.08-0.021,0.159-0.038,0.237-0.062c0.513-0.154,1.017-0.334,1.513-0.533c0.139-0.056,0.272-0.119,0.409-0.176 c0.366-0.158,0.728-0.326,1.083-0.507c0.152-0.078,0.305-0.155,0.454-0.237c0.101-0.055,0.206-0.103,0.306-0.16l5.164,13.229 L35.966,47.441z M36.328,32.208c-1.798,1.187-3.775,1.996-5.881,2.406c-1.632,0.317-3.257,0.389-4.839,0.229 c-2.636-0.264-5.15-1.166-7.378-2.637c-4.643-3.062-7.415-8.201-7.415-13.746c0-9.078,7.385-16.463,16.463-16.463 s16.463,7.385,16.463,16.463C43.743,24.007,40.97,29.146,36.328,32.208z"></path> </g> </g> </g></svg>              </div>
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
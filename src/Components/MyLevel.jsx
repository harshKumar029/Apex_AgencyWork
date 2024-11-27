// src/Components/MyLevel.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MyLevel = () => {
  // State variables
  const [approvedLeadsCount, setApprovedLeadsCount] = useState(null); // Total approved leads in current month
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Level-related state variables
  const [completedLevels, setCompletedLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [previousLevelThreshold, setPreviousLevelThreshold] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [leadsNeededForCurrentLevel, setLeadsNeededForCurrentLevel] = useState(0);
  const [leadsInCurrentLevel, setLeadsInCurrentLevel] = useState(0);
  const [nextLevelName, setNextLevelName] = useState('');

  // Define the levels and their thresholds
  const levels = [
    { name: 'Silver', threshold: 7 },
    { name: 'Gold', threshold: 14 },
    { name: 'Platinum', threshold: 21 },
    { name: 'DIAMOND', threshold: 28 },
  ];

  // Fetch approved leads when the component mounts
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Authenticated user UID:', user.uid);

        try {
          const now = new Date();

          // Calculate the start and end of the current month in UTC to avoid timezone issues
          const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
          const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

          // Convert to Firestore Timestamps
          const startTimestamp = Timestamp.fromDate(firstDayOfMonth);
          const endTimestamp = Timestamp.fromDate(lastDayOfMonth);

          console.log('Fetching approved leads for user:', user.uid);
          console.log('Date range:', startTimestamp.toDate(), '-', endTimestamp.toDate());

          // Construct the Firestore query
          const leadsQuery = query(
            collection(db, 'leads'),
            where('userId', '==', user.uid),
            where('status', '==', 'approved'),
            where('statusChangeAt', '>=', startTimestamp),
            where('statusChangeAt', '<=', endTimestamp)
          );

          // Execute the query
          const leadsSnapshot = await getDocs(leadsQuery);

          // Check if the snapshot is empty
          if (leadsSnapshot.empty) {
            console.log('No matching documents found.');
            setApprovedLeadsCount(0);
          } else {
            const count = leadsSnapshot.size;
            console.log('Approved leads count:', count);
            setApprovedLeadsCount(count);

            // Log each lead's data for verification
            leadsSnapshot.forEach((doc) => {
              console.log('Lead ID:', doc.id, 'Data:', doc.data());
            });
          }
        } catch (err) {
          console.error('Error fetching approved leads:', err);
          setError('Failed to fetch approved leads.');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is signed in.');
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Calculate level progress when approvedLeadsCount or loading changes
  useEffect(() => {
    if (approvedLeadsCount !== null && !loading) {
      let completed = [];
      let current = null;
      let prevThreshold = 0;
      let progress = 0;
      let leadsNeeded = 0;
      let leadsInCurrent = 0;
      let nextName = '';

      // Determine completed and current levels
      for (let i = 0; i < levels.length; i++) {
        if (approvedLeadsCount >= levels[i].threshold) {
          completed.push(levels[i]);
        } else {
          current = levels[i];
          break;
        }
      }

      if (!current && completed.length === levels.length) {
        // User has reached the highest level
        current = levels[levels.length - 1];
        prevThreshold = levels[levels.length - 2]?.threshold || 0; // Previous threshold or 0
        progress = 100;
        leadsNeeded = 0;
        leadsInCurrent = current.threshold - prevThreshold;
        nextName = '';
      } else {
        if (completed.length > 0) {
          prevThreshold = completed[completed.length - 1].threshold;
        } else {
          prevThreshold = 0;
        }

        leadsInCurrent = approvedLeadsCount - prevThreshold;
        leadsNeeded = current.threshold - approvedLeadsCount;
        progress = (leadsInCurrent / (current.threshold - prevThreshold)) * 100;
        nextName = current.name;
      }

      // Update state variables
      setCompletedLevels(completed);
      setCurrentLevel(current);
      setPreviousLevelThreshold(prevThreshold);
      setProgressPercentage(progress);
      setLeadsNeededForCurrentLevel(leadsNeeded);
      setLeadsInCurrentLevel(leadsInCurrent);
      setNextLevelName(nextName);
    }
  }, [approvedLeadsCount, loading, levels]);

  // Render loading state
  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  // Render no data state
  if (approvedLeadsCount === null) {
    return <div className="text-center mt-10">No data available.</div>;
  }

  return (
    <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4"></h1>

      {/* Level Progress Card */}
      <div
        className="mb-6 rounded-3xl"
        style={{
          background: 'linear-gradient(0deg, rgba(22,34,42,1) 23%, rgba(58,96,115,1) 83%)',
        }}
      >
        <div className="space-y-3 mb-6 p-6 pt-10 pb-10">
          <h2 className="text-xl font-bold text-white">
            {currentLevel ? currentLevel.name.toUpperCase() : 'DIAMOND'}
          </h2>
          <div className="hidden sm:flex items-center justify-center">
            <p className="text-lg font-semibold text-white text-center">
              {leadsNeededForCurrentLevel > 0
                ? `Complete ${leadsNeededForCurrentLevel} more sale${
                    leadsNeededForCurrentLevel !== 1 ? 's' : ''
                  } to reach ${nextLevelName} level`
                : 'You have reached the highest level!'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full flex items-center">
            {/* Left Circle */}
            <div className="w-7 absolute left-0 -translate-x-1/2">
              {/* Left circle SVG */}
              {/* Replace with your SVG code */}
            </div>

            <input
              id="large-range"
              type="range"
              value={progressPercentage}
              max="100"
              className="w-full h-3 appearance-none rounded-full cursor-default"
              style={{
                background: `linear-gradient(to right, #22a116 0%, #22a116 ${progressPercentage}%, white ${progressPercentage}%, white 100%)`,
              }}
              disabled
            />

            {/* Right Circle */}
            <div className="w-7 h-7 bg-[#FFFFFF] rounded-full absolute right-0 translate-x-1/2"></div>
          </div>

          <div className="text-xl flex justify-between text-white">
            <div className="font-normal text-xl">
              <p>Total Sales {approvedLeadsCount}</p>
            </div>
            <div className="font-normal text-xl">
              <p>Pending {leadsNeededForCurrentLevel > 0 ? leadsNeededForCurrentLevel : 0}</p>
            </div>
          </div>
          <div className="flex sm:hidden items-center justify-center">
            <p className="text-lg font-normal text-xl text-white text-center">
              {leadsNeededForCurrentLevel > 0
                ? `Do ${leadsNeededForCurrentLevel} more sale${
                    leadsNeededForCurrentLevel !== 1 ? 's' : ''
                  } to complete ${nextLevelName} level`
                : 'You have reached the highest level!'}
            </p>
          </div>
        </div>
      </div>

      {/* Column of Cards */}
      <div className="grid grid-cols-1 gap-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5"
          >
            <h2 className="text-[#063E50] font-bold text-xl">{level.name}</h2>
            <p className="text-[#063E50] flex items-center gap-3 font-semibold text-lg">
              {approvedLeadsCount >= level.threshold ? 'Completed' : 'Pending'}
              {approvedLeadsCount >= level.threshold ? (
                // Completed Icon
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14.7935"
                    cy="14.7935"
                    r="8.5"
                    fill="white"
                    stroke="#5DD326"
                    strokeWidth="12.587"
                  />
                  <path
                    d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Pending Icon
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="14.7935"
                    cy="14.7935"
                    r="8.5"
                    fill="white"
                    stroke="#bb2318"
                    strokeWidth="12.587"
                  />
                  <path
                    d="M15 10V16L18 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLevel;
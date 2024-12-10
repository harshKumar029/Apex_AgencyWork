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

<<<<<<< HEAD
  // State for fetching level data from Firestore
  const [levelsData, setLevelsData] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
=======
  // Define the levels and their thresholds
  const levels = [
    { name: 'Silver', threshold: 7 },
    { name: 'Gold', threshold: 14 },
    { name: 'Platinum', threshold: 21 },
    { name: 'DIAMOND', threshold: 28 },
  ];
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b

  // Fetch approved leads when the component mounts
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
<<<<<<< HEAD
        try {
          const now = new Date();
          // Calculate the start and end of the current month in UTC
          const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
          const lastDayOfMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
          );
=======
        console.log('Authenticated user UID:', user.uid);

        try {
          const now = new Date();

          // Calculate the start and end of the current month in UTC to avoid timezone issues
          const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
          const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b

          // Convert to Firestore Timestamps
          const startTimestamp = Timestamp.fromDate(firstDayOfMonth);
          const endTimestamp = Timestamp.fromDate(lastDayOfMonth);

<<<<<<< HEAD
=======
          console.log('Fetching approved leads for user:', user.uid);
          console.log('Date range:', startTimestamp.toDate(), '-', endTimestamp.toDate());

>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
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

<<<<<<< HEAD
          if (leadsSnapshot.empty) {
            setApprovedLeadsCount(0);
          } else {
            const count = leadsSnapshot.size;
            setApprovedLeadsCount(count);
=======
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
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
          }
        } catch (err) {
          console.error('Error fetching approved leads:', err);
          setError('Failed to fetch approved leads.');
        } finally {
          setLoading(false);
        }
      } else {
<<<<<<< HEAD
=======
        console.log('No user is signed in.');
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
        setLoading(false);
      }
    });

<<<<<<< HEAD
    return () => unsubscribe();
  }, []);

  // Fetch level data from Firestore
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levelsRef = collection(db, 'levelEarning');
        const snapshot = await getDocs(levelsRef);
        let tempLevels = [];
        // We know the order: COPPER, SILVER, GOLD, PLATINUM, DIAMOND
        // We'll fetch all and then order them
        const order = ['copper', 'silver', 'gold', 'platinum', 'diamond'];
        const dataMap = {};
        snapshot.forEach((doc) => {
          dataMap[doc.id.toLowerCase()] = doc.data();
        });

        // Calculate cumulative thresholds based on leadsRequired
        let cumulative = 0;
        for (let lvl of order) {
          const docData = dataMap[lvl] || { leadsRequired: 0, earning: 0 };
          cumulative += docData.leadsRequired || 0;
          tempLevels.push({
            name: lvl.toUpperCase(),
            threshold: cumulative,
            earning: docData.earning || 0,
          });
        }
        setLevelsData(tempLevels);
      } catch (err) {
        console.error('Error fetching level data:', err);
        setError('Failed to fetch level data.');
      } finally {
        setLevelsLoading(false);
      }
    };
    fetchLevels();
  }, []);

  // Calculate level progress when approvedLeadsCount or loading or levelsData changes
  useEffect(() => {
    if (approvedLeadsCount !== null && !loading && !levelsLoading && levelsData.length > 0) {
      const levels = levelsData;
=======
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Calculate level progress when approvedLeadsCount or loading changes
  useEffect(() => {
    if (approvedLeadsCount !== null && !loading) {
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
      let completed = [];
      let current = null;
      let prevThreshold = 0;
      let progress = 0;
      let leadsNeeded = 0;
      let leadsInCurrent = 0;
      let nextName = '';

<<<<<<< HEAD
=======
      // Determine completed and current levels
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
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
<<<<<<< HEAD
        prevThreshold = levels[levels.length - 2]?.threshold || 0;
=======
        prevThreshold = levels[levels.length - 2]?.threshold || 0; // Previous threshold or 0
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
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
<<<<<<< HEAD
        leadsNeeded = current ? current.threshold - approvedLeadsCount : 0;
        progress = current ? (leadsInCurrent / (current.threshold - prevThreshold)) * 100 : 100;
        nextName = current ? current.name : '';
      }

=======
        leadsNeeded = current.threshold - approvedLeadsCount;
        progress = (leadsInCurrent / (current.threshold - prevThreshold)) * 100;
        nextName = current.name;
      }

      // Update state variables
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
      setCompletedLevels(completed);
      setCurrentLevel(current);
      setPreviousLevelThreshold(prevThreshold);
      setProgressPercentage(progress);
      setLeadsNeededForCurrentLevel(leadsNeeded);
      setLeadsInCurrentLevel(leadsInCurrent);
      setNextLevelName(nextName);
    }
<<<<<<< HEAD
  }, [approvedLeadsCount, loading, levelsLoading, levelsData]);

  // Render loading state
  if (loading || levelsLoading) {
=======
  }, [approvedLeadsCount, loading, levels]);

  // Render loading state
  if (loading) {
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
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
<<<<<<< HEAD
            <div className="w-7 absolute left-0 -translate-x-1/2"></div>
=======
            <div className="w-7 absolute left-0 -translate-x-1/2">
              {/* Left circle SVG */}
              {/* Replace with your SVG code */}
            </div>
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b

            <input
              id="large-range"
              type="range"
              value={progressPercentage}
              max="100"
              className="w-full h-3 appearance-none rounded-full cursor-default"
              style={{
<<<<<<< HEAD
                background: `linear-gradient(to right, #E9B348 0%, #E9B348 ${progressPercentage}%, white ${progressPercentage}%, white 100%)`,
=======
                background: `linear-gradient(to right, #22a116 0%, #22a116 ${progressPercentage}%, white ${progressPercentage}%, white 100%)`,
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
              }}
              disabled
            />

            {/* Right Circle */}
            <div className="w-7 h-7 bg-[#FFFFFF] rounded-full absolute right-0 translate-x-1/2"></div>
          </div>

          <div className="text-xl flex justify-between text-white">
            <div className="font-normal text-xl">
<<<<<<< HEAD
              <p>Monthly Sales {approvedLeadsCount}</p>
=======
              <p>Total Sales {approvedLeadsCount}</p>
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
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
<<<<<<< HEAD
        {levelsData.map((level, index) => (
=======
        {levels.map((level, index) => (
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
          <div
            key={index}
            className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5"
          >
            <h2 className="text-[#063E50] font-bold text-xl">{level.name}</h2>
<<<<<<< HEAD
            <div className="flex justify-between items-center">
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
                    viewBox="0 0 122.88 122.88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <style>{`
                      .st0 { fill-rule:evenodd; clip-rule:evenodd; fill:#ffa900; }
                    `}</style>
                    <g>
                      <path
                        className="st0"
                        d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44c0,33.93-27.51,61.44-61.44,61.44C27.51,122.88,0,95.37,0,61.44 C0,27.51,27.51,0,61.44,0L61.44,0z M54.22,37.65c0-9.43,14.37-9.44,14.37,0.02v25.75l16.23,8.59c0.08,0.04,0.16,0.09,0.23,0.15 l0.14,0.1c7.54,4.94,0.53,16.81-7.53,12.15l-0.03-0.02L57.99,73.87c-2.3-1.23-3.79-3.67-3.79-6.29l0.01,0L54.22,37.65L54.22,37.65z"
                      />
                    </g>
                  </svg>
                )}
              </p>
              <p className="text-[#063E50] font-semibold text-lg">Bonus: ₹ {level.earning}</p>
            </div>
=======
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
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
          </div>
        ))}
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MyLevel;
=======
export default MyLevel;
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b

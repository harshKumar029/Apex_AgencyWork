// src/Components/MyLevel.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import linkBg from '../assets/img/levelbg.svg'

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

  // State for fetching level data from Firestore
  const [levelsData, setLevelsData] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(true);

  // Fetch approved leads when the component mounts
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const now = new Date();
          // Calculate the start and end of the current month in UTC
          const firstDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
          const lastDayOfMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
          );

          // Convert to Firestore Timestamps
          const startTimestamp = Timestamp.fromDate(firstDayOfMonth);
          const endTimestamp = Timestamp.fromDate(lastDayOfMonth);

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

          if (leadsSnapshot.empty) {
            setApprovedLeadsCount(0);
          } else {
            const count = leadsSnapshot.size;
            setApprovedLeadsCount(count);
          }
        } catch (err) {
          console.error('Error fetching approved leads:', err);
          setError('Failed to fetch approved leads.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

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
      let completed = [];
      let current = null;
      let prevThreshold = 0;
      let progress = 0;
      let leadsNeeded = 0;
      let leadsInCurrent = 0;
      let nextName = '';

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
        prevThreshold = levels[levels.length - 2]?.threshold || 0;
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
        leadsNeeded = current ? current.threshold - approvedLeadsCount : 0;
        progress = current ? (leadsInCurrent / (current.threshold - prevThreshold)) * 100 : 100;
        nextName = current ? current.name : '';
      }

      setCompletedLevels(completed);
      setCurrentLevel(current);
      setPreviousLevelThreshold(prevThreshold);
      setProgressPercentage(progress);
      setLeadsNeededForCurrentLevel(leadsNeeded);
      setLeadsInCurrentLevel(leadsInCurrent);
      setNextLevelName(nextName);
    }
  }, [approvedLeadsCount, loading, levelsLoading, levelsData]);

  // Render loading state
  if (loading || levelsLoading) {
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
      {/* <div
        className="mb-6 rounded-3xl"
        style={{
          background: 'linear-gradient(0deg, rgba(22,34,42,1) 23%, rgba(58,96,115,1) 83%)',
        }}
      > */}
            <div
        className="mb-6 rounded-3xl bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${linkBg})`,
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
            <div className="w-7 absolute left-0 -translate-x-1/2"></div>

            <input
              id="large-range"
              type="range"
              value={progressPercentage}
              max="100"
              className="w-full h-3 appearance-none rounded-full cursor-default"
              style={{
                background: `linear-gradient(to right, #E9B348 0%, #E9B348 ${progressPercentage}%, white ${progressPercentage}%, white 100%)`,
              }}
              disabled
            />

            {/* Right Circle */}
            <div className="w-7 h-7 bg-[#FFFFFF] rounded-full absolute right-0 translate-x-1/2"></div>
          </div>

          <div className="text-xl flex justify-between text-white">
            <div className="font-normal text-xl">
              <p>Monthly Sales {approvedLeadsCount}</p>
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
        {levelsData.map((level, index) => (
          <div
            key={index}
            className="border bg-white_custom border-[#DEE2E6] rounded-3xl p-4 space-y-5"
          >
            <h2 className="text-[#063E50] font-bold text-xl">{level.name}</h2>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLevel;

// src/Components/Trainings.jsx

import React from 'react';

const Trainings = () => {
    return (
        <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5 flex flex-col items-center justify-center'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-6"></h1>
            <div className='flex flex-col items-center justify-center bg-white shadow-md rounded-3xl p-6 max-w-md'>
                {/* Integrated SVG Icon */}
                <svg
                    className='w-24 h-24 text-gray-400 mb-4'
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 30"
                    fill="none"
                >
                    <title>Stopwatch Coming Soon 1</title>
                    <path
                        d="M19.25,9.08l1-1L17.39,5.29l-1,1A8.56,8.56,0,0,0,13,5.06V4h2V2H9V4h2V5.06a8.52,8.52,0,1,0,8.25,4ZM12,20a6.51,6.51,0,0,1-6.5-6.5H12V7a6.5,6.5,0,0,1,0,13Z"
                        fill="#063E50"
                    />
                </svg>
                {/* Temporary Message */}
                <h2 className='text-xl font-semibold text-gray-800 mb-2 text-center'>Training Videos Available Soon</h2>
                <p className='text-gray-600 text-center max-w-md'>
                    We are working hard to bring you valuable training content to enhance your skills. Stay tuned for upcoming training videos!
                </p>
            </div>
        </div>
    );
};

export default Trainings;

import React from 'react';

const Trainings = () => {
    // Dummy data for the training videos
    const trainingVideos = [
        {
            id: 1,
            title: 'How to track your leads?',
            duration: '3 months.58',
        },
        {
            id: 2,
            title: 'Effective Sales Strategies',
            duration: '2 months.58',
        },
        {
            id: 3,
            title: 'Optimizing Your Workflow',
            duration: '1 month.30',
        },
        {
            id: 4,
            title: 'How to track your leads?',
            duration: '3 months.58',
        },
        {
            id: 5,
            title: 'Effective Sales Strategies',
            duration: '2 months.58',
        },
        {
            id: 6,
            title: 'Optimizing Your Workflow',
            duration: '1 month.30',
        },
    ];

    return (
        <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Training Videos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {trainingVideos.map((video) => (
                    <div key={video.id} className="border bg-white_custom border-[#DEE2E6] rounded-3xl">
                        <video className='w-full rounded-t-3xl' controls>
                            <source src={`path/to/video-${video.id}.mp4`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className='p-4'>
                            <h3 className="font-semibold text-[#212529] mt-2">{video.title}</h3>
                            <p className="font-normal text-[#212529]">{video.duration}</p>
                            <button className="text-[#063E50] text-base flex items-center gap-2 font-medium mt-2">
                                Watch
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_110_4497)">
                                        <path d="M9.99999 3.33301L8.82499 4.50801L13.475 9.16634H3.33333V10.833H13.475L8.82499 15.4913L9.99999 16.6663L16.6667 9.99967L9.99999 3.33301Z" fill="#063E50" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_110_4497">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Trainings;

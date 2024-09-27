import React from 'react';

const Trainings = () => {
    // Dummy data for the training videos
    const trainingVideos = [
        {
            id: 1,
            title: 'How to track your leads?',
            duration: '3 months',
        },
        {
            id: 2,
            title: 'Effective Sales Strategies',
            duration: '2 months',
        },
        {
            id: 3,
            title: 'Optimizing Your Workflow',
            duration: '1 month',
        },
        {
            id: 4,
            title: 'Improving Customer Engagement',
            duration: '4 months',
        },
    ];

    return (
        <div className='w-[95%] m-auto mt-5'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Training Videos</h1>

            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                {trainingVideos.map((video) => (
                    <div key={video.id} className="border border-[#DEE2E6] rounded-lg p-4 w-1/3 shrink-0">
                        <video width="100%" controls>
                            <source src={`path/to/video-${video.id}.mp4`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <h3 className="font-semibold text-[#212529] mt-2">{video.title}</h3>
                        <p className="font-normal text-[#212529]">{video.duration}</p>
                        <button className="text-[#063E50] flex items-center gap-2 font-medium mt-2">
                            Watch
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_110_4497)">
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
                ))}
            </div>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Popular Topics</h1>

            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                {trainingVideos.map((video) => (
                    <div key={video.id} className="border border-[#DEE2E6] rounded-lg p-4 w-1/3 shrink-0">
                        <video width="100%" controls>
                            <source src={`path/to/video-${video.id}.mp4`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <h3 className="font-semibold text-[#212529] mt-2">{video.title}</h3>
                        <p className="font-normal text-[#212529]">{video.duration}</p>
                        <button className="text-[#063E50] flex items-center gap-2 font-medium mt-2">
                            Watch
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_110_4497)">
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
                ))}
            </div>
        </div>
    );
};

export default Trainings;

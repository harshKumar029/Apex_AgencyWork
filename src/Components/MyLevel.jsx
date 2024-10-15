import React, { useState } from 'react';


const MyLevel = () => {
    const [value, setValue] = useState(30); // Initial value at 50

    const handleChange = (e) => setValue(e.target.value);

    return (
        <div className=' w-[95%] m-auto mt-5'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">My Level</h1>

            {/* Row of Cards */}
            <div className=" mb-6 rounded-3xl"
              style={{
                background: 'linear-gradient(0deg, rgba(22,34,42,1) 23%, rgba(58,96,115,1) 83%)',
              }}
            >
                <div className=" space-y-3 mb-6 p-6">

                    <h2 className=' text-xl font-bold text-white'>DIAMOND</h2>
                    <div className=" hidden sm:flex items-center justify-center ">
                        <p className="text-lg font-semibold text-white text-center">
                            Complete 7 more sales to continue with Expert benefits
                        </p>
                    </div>

                    {/* <input id="large-range" type="range" value="0" class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-[#E9B348]"></input> */}
                    <div className="relative w-full flex items-center">
                        {/* Left Circle */}
                        <div className="w-7 absolute left-0 -translate-x-1/2">
                            <svg viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="17.5" cy="17.5" r="9" fill="white" stroke="url(#paint0_linear_121_9282)" stroke-width="17" />
                                <path d="M6 19.75L10.2188 23.9688M16.125 17.2188L20.3438 13M12.75 19.75L16.9688 23.9688L27.0938 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <defs>
                                    <linearGradient id="paint0_linear_121_9282" x1="34.0583" y1="35" x2="1.09891" y2="35.0928" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#F3B14E" />
                                        <stop offset="1" stop-color="#FFCE51" />
                                    </linearGradient>
                                </defs>
                            </svg>

                        </div>

                        <input
                            id="large-range"
                            type="range"
                            value={value}
                            onChange={handleChange} // Optional
                            className="w-full h-3 appearance-none rounded-full cursor-default"
                            style={{
                                background: `linear-gradient(to right, #E9B348 0%, #E9B348 ${value}%, white ${value}%, white 100%)`,
                            }}
                            disabled
                        />

                        {/* Right Circle */}
                        <div className="w-7 h-7 bg-[#FFFFFF] rounded-full absolute right-0 translate-x-1/2"></div>
                    </div>

                    <div className='text-xl flex justify-between text-white'>
                        <div className=' font-bold'>
                            <p>Sale Done</p>
                            <p>5</p>
                        </div>
                        <div className=' font-bold'>
                            <p>Sale Pending</p>
                            <p>7</p>
                        </div>
                    </div>
                    <div className="flex sm:hidden items-center justify-center ">
                        <p className="text-lg font-semibold text-white text-center">
                            Complete 7 more sales to continue with Expert benefits
                        </p>
                    </div>

                </div>
            </div>

            {/* Column of Cards */}
            <div className="grid grid-cols-1 gap-4">
                {/* Card 1 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-bold text-xl">Platinum</h2>
                    <p className="text-[#063E50] flex items-center gap-3 font-semibold text-lg">Completed
                        <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14.7935" cy="14.7935" r="8.5" fill="white" stroke="#5DD326" stroke-width="12.587" />
                            <path d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </p>
                </div>

                {/* Card 2 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-bold text-xl">Gold</h2>
                    <p className="text-[#063E50] flex items-center gap-3 font-semibold text-xl">Completed
                        <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14.7935" cy="14.7935" r="8.5" fill="white" stroke="#5DD326" stroke-width="12.587" />
                            <path d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </p>
                </div>

                {/* Card 3 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-bold text-xl">Silver</h2>
                    <p className="text-[#063E50] flex items-center gap-3 font-semibold text-xl">Completed
                        <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="14.7935" cy="14.7935" r="8.5" fill="white" stroke="#5DD326" stroke-width="12.587" />
                            <path d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </p>
                </div>
            </div>
        </div>
    )
}

export default MyLevel

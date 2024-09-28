import React from 'react'


const MyLevel = () => {
    return (
        <div className=' w-[95%] m-auto mt-5'>
            <h1 className="text-2xl font-medium text-[#343C6A] mb-4">My Level</h1>

            {/* Row of Cards */}
            <div className="flex justify-between mb-6">



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
<circle cx="14.7935" cy="14.7935" r="8.5" fill="white" stroke="#5DD326" stroke-width="12.587"/>
<path d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    </p>
                </div>

                {/* Card 3 */}
                <div className="border border-[#DEE2E6] rounded-3xl p-4 space-y-5">
                    <h2 className="text-[#063E50] font-bold text-xl">Silver</h2>
                    <p className="text-[#063E50] flex items-center gap-3 font-semibold text-xl">Completed
                    <svg width="25" height="25" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.7935" cy="14.7935" r="8.5" fill="white" stroke="#5DD326" stroke-width="12.587"/>
<path d="M5.07208 16.6953L8.63837 20.2616M13.6312 14.5555L17.1975 10.9893M10.7781 16.6953L14.3444 20.2616L22.9035 10.9893" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    </p>
                </div>
            </div>
        </div>
    )
}

export default MyLevel

import React, { useState } from 'react';

const Setting = () => {
    const [activeTab, setActiveTab] = useState('editProfile');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='w-[95%] m-auto my-5'>
            {/* Tabs */}
            <div className="flex justify-start space-x-4 mb-5">
                <button
                    onClick={() => handleTabChange('editProfile')}
                    className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'editProfile' ? 'border-b-2 border-[#063E50] text-[#063E50]' : 'text-[#718EBF]'}`}
                >
                    Edit Profile
                </button>
                <button
                    onClick={() => handleTabChange('security')}
                    className={`py-2 px-4 text-lg font-medium rounded-t-lg ${activeTab === 'security' ? 'border-b-2 border-[#063E50] text-[#063E50]' : 'text-[#718EBF]'}`}
                >
                    Security
                </button>
            </div>

            {/* Content for Edit Profile Tab */}
            {activeTab === 'editProfile' && (
                <div className="flex">
                    <div className="flex mb-4">
                        {/* User Profile Photo */}
                        <img
                            src="path/to/profile-photo.jpg" // Replace with your image path
                            alt="Profile"
                            className="w-24 h-24 rounded-full border border-[#DEE2E6] object-cover"
                        />
                    </div>

                    {/* Input Fields */}
                    <div className="flex flex-col space-y-2 ml-4">
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Charlene Reed"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />

                                <label className="text-[#212529]" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="charlenereed@gmail.com"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>

                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="dob">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    className="border placeholder-[#718EBF] border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />

                                <label className="text-[#212529]" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="**********"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="San Jose, California, USA"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />

                                <label className="text-[#212529]" htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    placeholder="San Jose"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>

                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    placeholder="45962"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />

                                <label className="text-[#212529]" htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    placeholder="USA"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="occupation">Occupation</label>
                                <input
                                    type="text"
                                    id="occupation"
                                    placeholder="Sales Person"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>

                            <div className="flex flex-col space-y-2 w-full">
                                <label className="text-[#212529]" htmlFor="workExperience">Work Experience</label>
                                <input
                                    type="text"
                                    id="workExperience"
                                    placeholder="2 years"
                                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content for Security Tab */}
            {activeTab === 'security' && (
                <div className="flex flex-col space-y-4">
                    <h2 className="text-lg text-[#212529]">Security Settings Content</h2>
                    <label className="text-[#212529]" htmlFor="twoFactorAuth">Two-Factor Authentication</label>
                    <input
                        type="checkbox"
                        id="twoFactorAuth"
                        className="w-4 h-4"
                    />
                </div>
            )}
            {/* Save Button */}
            <div className="flex justify-end mt-8">
                <button className="bg-[#063E50] text-white py-2 px-12 rounded-full">
                    Save
                </button>
            </div>
        </div>
    );
};

export default Setting;

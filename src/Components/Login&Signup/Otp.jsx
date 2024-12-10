// src/Components/Otp.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import Leftarrow from '../../assets/icon/Leftarrow.svg';
import CardImg from '../../assets/img/CardImg.svg';

const Otp = () => {
    const navigate = useNavigate();
    const [codes, setCodes] = useState(["", "", "", "", "", ""]);
    const [otp, setOtp] = useState(null); // Assuming you need to store the OTP
    const inputRefs = useRef([]);

    const handleChange = (index, value, isBackspace) => {
        // Allow only digits
        if (!/^\d*$/.test(value)) return;

        setCodes(prevCodes => {
            const newCodes = [...prevCodes];
            newCodes[index] = value;

            if (isBackspace && index > 0 && !value) {
                inputRefs.current[index - 1].focus();
            } else if (!isBackspace && index < newCodes.length - 1 && value) {
                inputRefs.current[index + 1].focus();
            }

            return newCodes;
        });

        // Update the OTP state
        const otpValue = [...codes.slice(0, index), value, ...codes.slice(index + 1)].join('');
        setOtp(parseInt(otpValue, 10));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle OTP verification logic here
        console.log('Submitted OTP:', otp);
    };

    return (
        <div className='md:bg-blue-primary bg-white flex flex-col md:flex-row h-auto h-screen overflow-hidden'>
            {/* Left Section */}
            <section className='pt-4 hidden md:block pb-8 px-14 space-y-3 relative md:w-[45vw] h-full'>
                <img className='w-36' src={ApexLogo} alt='ApexLogo' />
                <div className='text-white'>
                    <h1 className='text-[2.5rem] font-medium'>
                        Your <b className='font-extrabold'>Financial Future</b> Starts Here
                    </h1>
                    <h3>Join our growing community of successful agents.</h3>
                    <img className='absolute w-[32rem] left-0 bottom-20 hidden md:block' src={CardImg} alt='CardImg' />
                </div>
            </section>

            {/* Right Section */}
            <section className="w-full md:w-[55vw] h-auto md:h-full mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
                <div className="md:w-[45vw] w-full px-5 md:mr-28 space-y-14 md:space-y-7">
                    {/* Header */}
                    <div className='flex justify-between items-center'>
                        <div className='flex items-baseline gap-3'>
                            <img className='w-7 cursor-pointer' src={Leftarrow} alt='Back Arrow' onClick={() => navigate(-1)} />
                            <div>
                                <h2 className="text-[#525252] text-4xl font-bold mb-2">OTP Verification</h2>
                                <p className='font-normal text-sm text-[#495057]'>Enter the OTP sent to your email address</p>
                            </div>
                        </div>
                        <img className='md:hidden block w-36' src={Apexlogoblue} alt='ApexLogo' />
                    </div>

                    {/* OTP Form */}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        {/* OTP Inputs */}
                        <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                            {codes.map((code, index) => (
                                <div key={index}>
                                    <label htmlFor={`code-${index + 1}`} className="sr-only">{`Code ${index + 1}`}</label>
                                    <input
                                        type="text"
                                        maxLength="1"
                                        id={`code-${index + 1}`}
                                        ref={input => inputRefs.current[index] = input}
                                        className="block w-12 h-12 px-4 py-3 text-2xl font-extrabold text-center text-[#495057] bg-gray-50 border border-[#DEE2E6] rounded-lg focus:outline-none focus:border-blue-500"
                                        value={code}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace') {
                                                // Handle backspace key
                                                e.preventDefault(); // Prevent the default backspace behavior
                                                handleChange(index, '', true);
                                            }
                                        }}
                                        required
                                        autoFocus={index === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-3 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors flex items-center justify-center"
                        >
                            Verify
                        </button>
                    </form>

                    {/* Timer and Resend Link */}
                    <div className="mt-6 text-center font-medium">
                        <p className='text-[#F47A7A] mb-2'>01:40</p>
                        <p className="text-[#A1A1A1]">
                            Didn’t get an OTP?{' '}
                            <span
                                onClick={() => navigate('/Signup')}
                                className="text-[#063E50] cursor-pointer hover:underline"
                            >
                                Resend
                            </span>
                        </p>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1]">
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/Login')}
                                className="text-[#063E50] cursor-pointer hover:underline"
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Otp;
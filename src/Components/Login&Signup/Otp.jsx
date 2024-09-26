// import React from 'react'
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/ApexLogo.svg'
import Leftarrow from '../../assets/icon/Leftarrow.svg'
import CardImg from '../../assets/img/CardImg.svg'

const Otp = () => {

    const navigate = useNavigate();
    const [codes, setCodes] = useState(["", "", "", "", "", ""]);



    const inputRefs = useRef([]);

    const handleChange = (index, value, isBackspace) => {
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
        // setOtp( parseInt(codes.join(""), 10));
        setOtp(parseInt([...codes.slice(0, index), value, ...codes.slice(index + 1)].join(''), 10));
    };
    return (
        <div className='bg-blue-primary flex h-[100vh]'>
            <section className='  py-8 px-14 space-y-3 '>
                <img className=' w-36' src={ApexLogo} alt='ApexLogo' />
                <div className=' text-white'>
                    <h1 className=' text-[2.5rem] font-medium'>Your <b className=' font-extrabold'>Financial Future</b> Starts Here</h1>
                    <h3>Join our growing community of successful agents.</h3>
                    <img className=' absolute left-0 bottom-20' src={CardImg} alt='CardImg' />
                </div>
            </section>
            <section className="w-[120vw] h-screen bg-white rounded-l-[2.738rem] flex items-center justify-end">
                <div className="w-[43vw] mr-28 space-y-7">

                    <div className=' flex items-baseline gap-3'>
                        <img className=' w-7' src={Leftarrow} alt='Leftarrow' />
                        <div>
                            <h2 className=" text-[#525252] text-4xl font-bold mb-2 ">OTP Verification</h2>
                            <p className=' font-normal text-sm text-[#495057]'>Enter the OTP Shared on dummyemail@gmail.com</p>
                        </div>
                    </div>
                    {/* <form  className='space-y-7'> */}
                    <form className=" space-y-7">
                        <div className="flex mb-2 space-x-2 rtl:space-x-reverse">


                            {codes.map((code, index) => (
                                <div key={index}>
                                    <label htmlFor={`code-${index + 1}`} className="sr-only">{`Code ${index + 1}`}</label>
                                    <input
                                        type="text"
                                        maxLength="1"
                                        id={`code-${index + 1}`}
                                        ref={input => inputRefs.current[index] = input}
                                        className="block w-[6.438rem] h-[6.438rem] py-3 text-3xl font-extrabold text-center text-[#495057] bg-[#ffffff] bg-opacity-45 border border-[#495057] rounded "
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
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors"
                        >
                            Verify
                        </button>

                    </form>
                    <div className="mt-6 text-center font-medium">
                        <p className=' font-medium text-[#F47A7A]'>01:40</p>
                        <p className="text-[#A1A1A1] flex justify-center">
                            Didn’t get an OTP?{' '}
                            <p onClick={() => navigate('/Signup')} className="text-[#063E50] cursor-pointer hover:underline">
                                Resend
                            </p>
                        </p>
                    </div>


                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1] flex justify-center">
                            Already have an account?{' '}
                            <p onClick={() => navigate('/Signup')} className="text-[#063E50] cursor-pointer hover:underline">
                                Signup
                            </p>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Otp

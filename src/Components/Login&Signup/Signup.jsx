// import React from 'react'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/ApexLogo.svg'
import Google from '../../assets/icon/Google.svg'
import Facebook from '../../assets/icon/Facebook.svg'
import CardImg from '../../assets/img/CardImg.svg'

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        mobile: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form Data Submitted:', formData);
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
                <div className="w-[45vw] mr-28 space-y-7">

                    <h2 className=" text-[#525252] text-4xl font-bold mb-6 ">Log In To Your Account </h2>
                    <form onSubmit={handleSubmit} className='space-y-7'>
                    <div className="mb-6">
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057]  placeholder:font-medium"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                                placeholder="Mobile Number"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium"
                                placeholder="Password"
                                required
                            />
                        </div>
                    
                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className=' flex justify-center mt-6'>
                        <p className=' text-[#ADB5BD] font-medium'>- OR -</p>
                    </div>

                    <div className="mt-6 flex">
                        <button className="w-full flex justify-center gap-3 font-semibold items-center text-[#A1A1A1] rounded-lg ">
                            <img src={Google} alt='Google' />
                            Continue with Google
                        </button>
                        <button className="w-full flex justify-center gap-3 font-semibold items-center text-[#A1A1A1] rounded-lg">
                            <img src={Facebook} alt='Facebook' />
                            Continue with Facebook
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1] flex justify-center">
                            Already have an account?{' '}
                            <p onClick={() => navigate('/login')} className="text-[#063E50] cursor-pointer hover:underline">
                                Login
                            </p>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signup

// src/Components/Forgetpass.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApexLogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import CardImg from '../../assets/img/CardImg.svg';

// Firebase imports
import { auth } from '../../firebase'; // Ensure correct path
import { sendPasswordResetEmail } from 'firebase/auth';

const Forgetpass = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Please check your inbox.');
            setEmail('');
        } catch (err) {
            console.error('Error sending password reset email:', err);
            switch (err.code) {
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/user-not-found':
                    setError('No user found with this email.');
                    break;
                default:
                    setError('Failed to send password reset email. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
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
                        <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">Forgot Password</h2>
                        <img className='md:hidden block w-36' src={Apexlogoblue} alt='ApexLogo' />
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                            {message}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Password Reset Form */}
                    <form onSubmit={handleSubmit} className='space-y-7'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="sr-only">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                                placeholder="Enter your registered email"
                                required
                                aria-invalid={error ? "true" : "false"}
                                aria-describedby={error ? "email-error" : undefined}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 text-lg md:text-base font-semibold rounded-lg hover:bg-[#053748] transition-colors flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        ></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1]">
                            Remembered your password?{' '}
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

};

export default Forgetpass;
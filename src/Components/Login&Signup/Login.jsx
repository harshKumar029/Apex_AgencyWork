// src/Components/Login&Signup/Login.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApexLogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import Google from '../../assets/icon/Google.svg';
import CardImg from '../../assets/img/CardImg.svg';

// Firebase imports
import { auth } from '../../firebase'; // Ensure the correct path to your firebase.js file
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    sendEmailVerification, 
    signOut 
} from 'firebase/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State for form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // State for messages
    const [message, setMessage] = useState({
        type: '', // 'success' or 'error'
        text: '',
    });

    // State for loading indicators
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission for Email/Password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' }); // Reset messages

        try {
            // Sign in with Email and Password
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log('User logged in:', user.uid); // Debugging

            if (user.emailVerified) {
                // Email is verified, proceed to dashboard
                setMessage({
                    type: 'success',
                    text: 'Login successful! Redirecting to Dashboard...',
                });

                // Redirect after a short delay to allow user to read the message
                setTimeout(() => {
                    navigate('/dashboard'); // Ensure this route exists in your App.jsx
                }, 2000); // 2 seconds delay
            } else {
                // Email not verified, send verification email and inform the user
                await sendEmailVerification(user);
                console.log('Verification email sent to:', user.email); // Debugging

                setMessage({
                    type: 'error',
                    text: 'Email not verified. A verification email has been sent to your email address.',
                });

                // Sign out the user to prevent access
                await signOut(auth);
            }
        } catch (error) {
            console.error('Login error:', error); // Debugging

            // Determine error message based on error code
            let errorMsg = 'An error occurred during login. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMsg = 'No user found with this email.';
            } else if (error.code === 'auth/wrong-password') {
                errorMsg = 'Incorrect password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = 'Invalid email address.';
            }

            // Set error message
            setMessage({
                type: 'error',
                text: errorMsg,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        setMessage({ type: '', text: '' }); // Reset messages

        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User logged in with Google:', user.uid); // Debugging

            if (user.emailVerified) {
                // Email is verified, proceed to dashboard
                setMessage({
                    type: 'success',
                    text: 'Login successful! Redirecting to Dashboard...',
                });

                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/dashboard'); // Ensure this route exists in your App.jsx
                }, 2000); // 2 seconds delay
            } else {
                // Email not verified (rare for Google), send verification email
                await sendEmailVerification(user);
                console.log('Verification email sent to:', user.email); // Debugging

                setMessage({
                    type: 'error',
                    text: 'Email not verified. A verification email has been sent to your email address.',
                });

                // Sign out the user to prevent access
                await signOut(auth);
            }
        } catch (error) {
            console.error('Google Sign-In error:', error); // Debugging

            // Set error message
            setMessage({
                type: 'error',
                text: 'Google Sign-In failed. Please try again.',
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    // Redirect authenticated users to Dashboard only if email is verified
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                // User is signed in and email is verified, redirect to Dashboard
                navigate('/dashboard');
            } else if (user && !user.emailVerified) {
                // User is signed in but email not verified
                setMessage({
                    type: 'error',
                    text: 'Please verify your email to access the Dashboard.',
                });
                // Optionally, send verification email if not already sent
                sendEmailVerification(user)
                    .then(() => {
                        console.log('Verification email sent to:', user.email);
                        setMessage({
                            type: 'error',
                            text: 'Email not verified. A verification email has been sent to your email address.',
                        });
                        // Sign out the user to prevent access
                        signOut(auth);
                    })
                    .catch((error) => {
                        console.error('Error sending verification email:', error);
                        setMessage({
                            type: 'error',
                            text: 'Failed to send verification email. Please try again later.',
                        });
                    });
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='md:bg-blue-primary bg-white flex flex-col md:flex-row h-auto md:h-screen overflow-hidden'>
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
                        <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">Log In to Your Account</h2>
                        <img className='md:hidden block w-36' src={Apexlogoblue} alt='ApexLogo' />
                    </div>

                    {/* Display Messages */}
                    {message.text && (
                        <div
                            className={`p-4 mb-4 text-sm ${
                                message.type === 'success'
                                    ? 'text-green-700 bg-green-100 rounded-lg'
                                    : 'text-red-700 bg-red-100 rounded-lg'
                            }`}
                            role="alert"
                        >
                            {message.text}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className='space-y-7'>
                        {/* Email Input */}
                        <div className="mb-6">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                                placeholder="Email"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-6">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                                placeholder="Password"
                                required
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className='flex justify-end'>
                            <p onClick={() => navigate('/password/reset')} className='cursor-pointer font-medium text-[#063E50] hover:underline'>
                                Forgot Password?
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 text-lg md:text-base font-semibold rounded-lg hover:bg-[#053748] transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className='flex justify-center mt-6'>
                        <p className='text-[#ADB5BD] font-medium'>- OR -</p>
                    </div>

                    {/* Google Sign-In Button */}
                    <div className="mt-6 flex">
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full flex justify-center gap-3 font-semibold items-center text-[#A1A1A1] rounded-lg border border-[#DEE2E6] hover:bg-gray-100 transition-colors"
                            disabled={isGoogleLoading}
                        >
                            <img src={Google} alt='Google' />
                            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-[#A1A1A1] flex justify-center">
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/signup')}
                                className="text-[#063E50] cursor-pointer hover:underline ml-1"
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );

};

export default Login;
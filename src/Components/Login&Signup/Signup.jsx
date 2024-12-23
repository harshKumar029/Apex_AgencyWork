// src/Components/Login&Signup/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Apexlogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import CardImg from '../../assets/img/CardImg.svg';

// Import Firebase functions
import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    password: '',
    referralCode: '',
    referralCode: '',
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [message, setMessage] = useState({
    type: '', // 'success' or 'error'
    text: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAcceptTerms(checked);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAcceptTerms(checked);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Generates a unique six-digit ID.
   * Checks Firestore to ensure uniqueness.
   */
  const generateUniqueID = async () => {
    let uniqueID;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 5;

    while (exists && attempts < maxAttempts) {
      uniqueID = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a six-digit string
      const q = query(
        collection(db, 'users'),
        where('uniqueID', '==', uniqueID)
      );
      const q = query(
        collection(db, 'users'),
        where('uniqueID', '==', uniqueID)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        exists = false;
      }
      attempts++;
    }

    if (exists) {
      throw new Error('Failed to generate a unique ID. Please try again.');
      throw new Error('Failed to generate a unique ID. Please try again.');
    }

    return uniqueID;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Check if terms and conditions are accepted
    if (!acceptTerms) {
      setMessage({
        type: 'error',
        text: 'You must accept the terms and conditions to proceed.',
      });
      return;
    }

    // Check if terms and conditions are accepted
    if (!acceptTerms) {
      setMessage({
        type: 'error',
        text: 'You must accept the terms and conditions to proceed.',
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' }); // Reset message

    try {
      // Validate referral code if provided
      let referringUserUid = null;

      if (formData.referralCode) {
        const referralQuery = query(
          collection(db, 'users'),
          where('uniqueID', '==', formData.referralCode)
        );
        const referralSnapshot = await getDocs(referralQuery);

        if (!referralSnapshot.empty) {
          // Referral code is valid
          const referringUserDoc = referralSnapshot.docs[0];
          referringUserUid = referringUserDoc.id;
        } else {
          // Referral code is invalid
          setMessage({
            type: 'error',
            text: 'Invalid referral code. Please check and try again.',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Validate referral code if provided
      let referringUserUid = null;

      if (formData.referralCode) {
        const referralQuery = query(
          collection(db, 'users'),
          where('uniqueID', '==', formData.referralCode)
        );
        const referralSnapshot = await getDocs(referralQuery);

        if (!referralSnapshot.empty) {
          // Referral code is valid
          const referringUserDoc = referralSnapshot.docs[0];
          referringUserUid = referringUserDoc.id;
        } else {
          // Referral code is invalid
          setMessage({
            type: 'error',
            text: 'Invalid referral code. Please check and try again.',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Generate unique six-digit ID
      const uniqueID = await generateUniqueID();

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log('User created:', user.uid); // Debugging

      // Send email verification
      await sendEmailVerification(user);
      console.log('Email verification sent to:', user.email); // Debugging

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullname: formData.fullname,
        mobile: formData.mobile,
        email: formData.email,
        uid: user.uid,
        uniqueID: uniqueID,
        emailVerified: user.emailVerified, // Initially false
        createdAt: new Date(), // Timestamp
        referredUserId: referringUserUid || '', // Include referredUserId if available
        role: 'user', // Added role as 'user'
        earnings: 0, // Initialize earnings to 0
        referredUserId: referringUserUid || '', // Include referredUserId if available
        role: 'user', // Added role as 'user'
        earnings: 0, // Initialize earnings to 0
      });
      console.log('User data saved to Firestore'); // Debugging

      // If referred by someone, add entry to referrals collection
      if (referringUserUid) {
        await setDoc(doc(collection(db, 'referrals')), {
          referringUserId: referringUserUid,
          referredUserId: user.uid,
          status: 'pending', // Added status field as 'pending'
          dateReferred: new Date(),
        });
        console.log('Referral data saved to Firestore'); // Debugging
      }

      // If referred by someone, add entry to referrals collection
      if (referringUserUid) {
        await setDoc(doc(collection(db, 'referrals')), {
          referringUserId: referringUserUid,
          referredUserId: user.uid,
          status: 'pending', // Added status field as 'pending'
          dateReferred: new Date(),
        });
        console.log('Referral data saved to Firestore'); // Debugging
      }

      // Set success message
      setMessage({
        type: 'success',
        text: 'Registration successful! A verification email has been sent. Please verify your email before logging in.',
      });

      // Optionally, log out the user until email is verified
      // await auth.signOut();

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 5000); // 5 seconds delay
    } catch (error) {
      console.error('Signup error:', error); // Debugging

      if (error.code === 'auth/email-already-in-use') {
        // Set info message
        setMessage({
          type: 'error',
          text: 'Email already in use. Redirecting to login page...',
        });

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 3000); // 3 seconds delay
      } else if (error.code === 'auth/weak-password') {
        setMessage({
          type: 'error',
          text: 'Password should be at least 6 characters.',
        });
      } else {
        // Set error message for other errors
        setMessage({
          type: 'error',
          text: error.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='md:bg-blue-primary bg-white flex flex-col md:flex-row h-auto h-screen overflow-hidden'>
      {/* Left Section */}
      <section className="pt-4 hidden md:block pb-8 px-14 space-y-3 relative md:w-[45vw] h-full">
        <img className="w-36" src={Apexlogo} alt="ApexLogo" />
        <div className="text-white">
          <h1 className="text-[2.5rem] font-medium">
            Your <b className="font-extrabold">Financial Future</b> Starts Here
          </h1>
          <h3>Join our growing community of successful agents.</h3>
          <img
            className="absolute w-[32rem] left-0 bottom-20 hidden md:block"
            src={CardImg}
            alt="CardImg"
          />
          <img
            className="absolute w-[32rem] left-0 bottom-20 hidden md:block"
            src={CardImg}
            alt="CardImg"
          />
        </div>
      </section>

      {/* Right Section */}
      <section className="w-full md:w-[55vw] h-auto md:h-full mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
        <div className="md:w-[45vw] w-full px-5 md:mr-28 space-y-14 md:space-y-7">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">

      {/* Right Section */}
      <section className="w-full md:w-[55vw] h-auto md:h-full mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end">
        <div className="md:w-[45vw] w-full px-5 md:mr-28 space-y-14 md:space-y-7">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="self-end md:self-auto text-[#525252] text-4xl font-bold mb-6">
              Create Account
            </h2>
            <img
              className="md:hidden block w-36"
              src={Apexlogoblue}
              alt="ApexLogo"
            />
            <img
              className="md:hidden block w-36"
              src={Apexlogoblue}
              alt="ApexLogo"
            />
          </div>

          {/* Display message if exists */}
          {message.text && (
            <div
              className={`p-4 mb-4 text-sm ${
                message.type === 'success'
                  ? 'text-green-700 bg-green-100 rounded-lg'
                  : message.type === 'error'
                  ? 'text-red-700 bg-red-100 rounded-lg'
                  : 'text-gray-700 bg-gray-100 rounded-lg'
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Full Name Input */}
            <div className="mb-6">
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Full Name Input */}
            <div className="mb-6">
              <input
                type="text"
                id="fullname"
                name="fullname"
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Full Name"
                required
              />
            </div>

            {/* Mobile Number Input */}
            <div className="mb-6">

            {/* Mobile Number Input */}
            <div className="mb-6">
              <input
                type="tel"
                id="mobile"
                name="mobile"
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                pattern="[0-9]{10}" // Basic validation for 10-digit mobile number
                title="Please enter a valid 10-digit mobile number."
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Mobile Number (10 digits)"
                pattern="[0-9]{10}" // Basic validation for 10-digit mobile number
                title="Please enter a valid 10-digit mobile number."
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Mobile Number (10 digits)"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-6">

            {/* Email Input */}
            <div className="mb-6">
              <input
                type="email"
                id="email"
                name="email"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Email"
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Email"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">

            {/* Password Input */}
            <div className="mb-6">
              <input
                type="password"
                id="password"
                name="password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Password (Min 6 characters)"
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Password (Min 6 characters)"
                required
                minLength={6}
              />
            </div>

            {/* Referral Code Input */}
            <div className="mb-6">
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Referral Code (Optional)"
                maxLength={6}
              />
            </div>

            {/* Accept Terms and Conditions */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={acceptTerms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="acceptTerms" className="text-[#495057]">
                I accept the{' '}
                <a
                  href="https://apexin.in/terms-conditions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#063E50] hover:underline"
                >
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}

            {/* Referral Code Input */}
            <div className="mb-6">
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#DEE2E6] rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium bg-gray-50"
                placeholder="Referral Code (Optional)"
                maxLength={6}
              />
            </div>

            {/* Accept Terms and Conditions */}
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={acceptTerms}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <label htmlFor="acceptTerms" className="text-[#495057]">
                I accept the{' '}
                <a
                  href="https://apexin.in/terms-conditions.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#063E50] hover:underline"
                >
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors flex items-center justify-center"
              type="submit"
              className="w-full bg-blue-primary text-white py-3 md:py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
              {isSubmitting ? (
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-[#A1A1A1] flex justify-center">
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-[#A1A1A1] flex justify-center">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-[#063E50] cursor-pointer hover:underline ml-1"
                className="text-[#063E50] cursor-pointer hover:underline ml-1"
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

export default Signup;
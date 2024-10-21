<<<<<<< HEAD
// src/Components/Login&Signup/Signup.jsx

=======
// Signup.jsx
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Apexlogo from '../../assets/icon/Apexlogo.svg';
import Apexlogoblue from '../../assets/icon/Apexlogoblue.svg';
import CardImg from '../../assets/img/CardImg.svg';

// Import Firebase functions
import { auth, db } from '../../firebase'; // Ensure the correct path
<<<<<<< HEAD
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
=======
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState({
    type: '', // 'success' or 'error'
    text: '',
  });

<<<<<<< HEAD
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      const q = query(collection(db, "users"), where("uniqueID", "==", uniqueID));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        exists = false;
      }
      attempts++;
    }

    if (exists) {
      throw new Error("Failed to generate a unique ID. Please try again.");
    }

    return uniqueID;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage({ type: '', text: '' }); // Reset message

    try {
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
      });
      console.log('User data saved to Firestore'); // Debugging

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
=======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form:', formData); // Debugging

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      console.log('User created:', user.uid); // Debugging

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullname: formData.fullname,
        mobile: formData.mobile,
        email: formData.email,
        uid: user.uid,
      });
      console.log('User data saved to Firestore'); // Debugging

      // Set success message
      setMessage({
        type: 'success',
        text: 'Registration successful! Redirecting to login...',
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000); // 3 seconds delay
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
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
<<<<<<< HEAD
      } else if (error.code === 'auth/weak-password') {
        setMessage({
          type: 'error',
          text: 'Password should be at least 6 characters.',
        });
      } else {
        // Set error message for other errors
=======
      } else {
        // Set error message
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
        setMessage({
          type: 'error',
          text: error.message,
        });
      }
<<<<<<< HEAD
    } finally {
      setIsSubmitting(false);
=======
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
    }
  };

  return (
    <div className='md:bg-blue-primary bg-white flex h-[100vh]'>
<<<<<<< HEAD
      <section className='pt-4 hidden md:block pb-8 px-14 space-y-3 relative'>
=======
      <section className='pt-4 hidden md:block pb-8 px-14 space-y-3'>
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
        <img className='w-36' src={Apexlogo} alt='ApexLogo' />
        <div className='text-white'>
          <h1 className='text-[2.3rem] font-medium'>
            Your <b className='font-extrabold'>Financial Future</b> Starts Here
          </h1>
          <h3>Join our growing community of successful agents.</h3>
          <img className='absolute w-[32rem] left-0 bottom-20' src={CardImg} alt='CardImg' />
        </div>
      </section>
      <section className='w-[120vw] h-screen mt-10 md:mt-0 bg-white rounded-l-[2.738rem] flex md:items-center justify-center md:justify-end'>
        <div className='md:w-[45vw] w-[90vw] px-5 md:mr-28 space-y-14 md:space-y-7'>
          <div className='flex justify-between'>
            <h2 className='self-end md:self-auto text-[#525252] text-4xl font-bold mb-6'>
              Create Account
            </h2>
            <img className='md:hidden block w-36' src={Apexlogoblue} alt='ApexLogo' />
          </div>

          {/* Display message if exists */}
          {message.text && (
            <div
              className={`p-4 mb-4 text-sm ${
                message.type === 'success'
                  ? 'text-green-700 bg-green-100 rounded-lg'
<<<<<<< HEAD
                  : message.type === 'error'
                  ? 'text-red-700 bg-red-100 rounded-lg'
                  : 'text-gray-700 bg-gray-100 rounded-lg'
=======
                  : 'text-red-700 bg-red-100 rounded-lg'
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-7'>
            <div className='mb-6'>
              <input
                type='text'
                id='fullname'
                name='fullname'
                value={formData.fullname}
                onChange={handleChange}
                className='w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium'
                placeholder='Full Name'
                required
              />
            </div>
            <div className='mb-6'>
              <input
                type='tel'
                id='mobile'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
<<<<<<< HEAD
                pattern='[0-9]{10}' // Basic validation for 10-digit mobile number
                title='Please enter a valid 10-digit mobile number.'
                className='w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium'
                placeholder='Mobile Number (10 digits)'
=======
                className='w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium'
                placeholder='Mobile Number'
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
                required
              />
            </div>
            <div className='mb-6'>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium'
                placeholder='Email'
                required
              />
            </div>
            <div className='mb-6'>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full pl-0 pr-4 py-2 border-b-2 border-[#DEE2E6] focus:outline-none focus:ring-0 focus:border-blue-500 placeholder-[#495057] placeholder:font-medium'
<<<<<<< HEAD
                placeholder='Password (Min 6 characters)'
                required
                minLength={6}
=======
                placeholder='Password'
                required
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
              />
            </div>
            <button
              type='submit'
              className='w-full bg-blue-primary text-white py-3 md:py-2 px-4 font-semibold rounded-lg hover:bg-[#053748] transition-colors'
<<<<<<< HEAD
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
=======
            >
              Create Account
>>>>>>> c7b04dd54cfade69b83121d995af012e86f783b2
            </button>
          </form>

          {/* Removed Google and Facebook login buttons */}

          <div className='mt-6 text-center'>
            <p className='text-[#A1A1A1] flex justify-center'>
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className='text-[#063E50] cursor-pointer hover:underline ml-1'
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
// src/Components/Setting.jsx

import React, { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import placeholderImage from '../assets/icon/profile-img.svg';
import { compressImage } from '../utils/compressImage';
<<<<<<< HEAD
=======

// Import the compression utility
import { compressImage } from '../utils/compressImage';
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611

const Setting = () => {
  const [activeTab, setActiveTab] = useState('editProfile');
  const [formData, setFormData] = useState({
    fullname: '',
    mobileNumber: '',
    email: '',
    dob: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    occupation: '',
    workExperience: '',
    profilePhotoURL: '',
  });
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
=======
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
=======
  const [isLoading, setIsLoading] = useState(true); // Changed from 'loading'
  // Removed 'error' state
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
  // State for handling form submissions
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setProfileSuccess('');
    setProfileError('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Fetch user data from Firestore with retry mechanism
  useEffect(() => {
<<<<<<< HEAD
    let isMounted = true;
=======
<<<<<<< HEAD
    let isMounted = true;
=======
    let isMounted = true; // To prevent setting state on unmounted component
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          let userData = {};
          if (userDoc.exists()) {
            const data = userDoc.data();
            userData.fullname = data.fullname || data.name || '';
            userData.mobileNumber = data.mobile || '';
            userData.email = data.email || user.email || '';
          }

          const profileDocRef = doc(db, 'users', user.uid, 'Details&Documents', 'ProfileDetails');
          const profileDoc = await getDoc(profileDocRef);

          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            if (isMounted) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
              setFormData((prevData) => ({
                ...prevData,
                ...userData,
                ...profileData,
              }));
<<<<<<< HEAD
=======
=======
              setFormData({
                ...formData,
                ...userData,
                ...profileData,
              });
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
              setIsLoading(false);
            }
          } else {
            if (isMounted) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
              setFormData((prevData) => ({
                ...prevData,
                ...userData,
              }));
<<<<<<< HEAD
=======
=======
              setFormData({
                ...formData,
                ...userData,
              });
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
              setIsLoading(false);
            }
          }
        } else {
          console.warn('No authenticated user found!');
<<<<<<< HEAD
          window.location.href = '/login';
=======
<<<<<<< HEAD
          window.location.href = '/login';
=======
          // Redirect to login if user is not authenticated
          window.location.href = '/login'; // Alternatively, use navigate if using react-router
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (isMounted) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
          // Retry after 3 seconds
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
          setTimeout(fetchUserData, 3000);
        }
      }
    };

    fetchUserData();

    return () => {
<<<<<<< HEAD
      isMounted = false;
    };
=======
<<<<<<< HEAD
      isMounted = false;
    };
=======
      isMounted = false; // Cleanup flag
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsSavingProfile(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            fullname: formData.fullname,
            mobile: formData.mobileNumber,
          },
          { merge: true }
        );

        const profileDocRef = doc(db, 'users', user.uid, 'Details&Documents', 'ProfileDetails');
        const {
          fullname,
          mobileNumber,
          email,
          ...profileData
        } = formData; // exclude fields stored in userDoc

        await setDoc(profileDocRef, profileData, { merge: true });

        setProfileSuccess('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setProfileError('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsSavingPassword(true);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      setIsSavingPassword(false);
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        setPasswordError('Current password is incorrect.');
      } else if (err.code === 'auth/weak-password') {
        setPasswordError('New password is too weak.');
      } else {
        setPasswordError('Failed to change password.');
      }
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadProfilePhoto(file);
    }
  };

  const uploadProfilePhoto = async (file) => {
    setUploadingPhoto(true);
    try {
      const user = auth.currentUser;
      const fileExtension = file.name.split('.').pop();
      const storagePath = `users/${user.uid}/ProfilePhoto/profilePhoto.${fileExtension}`;
      const storageRef = ref(storage, storagePath);

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
      const compressedFile = await compressImage(file, 150);
      const metadata = {
        contentType: compressedFile.type,
      };

<<<<<<< HEAD
=======
=======
      // Compress the image before uploading
      const compressedFile = await compressImage(file, 150); // Compress to 150KB

      // Delete the old profile photo if it exists
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
      await deleteObject(storageRef).catch((error) => {
        console.error('Error deleting old profile photo:', error);
      });

<<<<<<< HEAD
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, metadata);
=======
<<<<<<< HEAD
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, metadata);
=======
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optionally track progress
        },
        (error) => {
          console.error('Error uploading file:', error);
          setProfileError('Failed to upload profile photo.');
          setUploadingPhoto(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const profileDocRef = doc(db, 'users', user.uid, 'Details&Documents', 'ProfileDetails');
          await setDoc(
            profileDocRef,
            { profilePhotoURL: downloadURL },
            { merge: true }
          );

          setFormData((prevData) => ({
            ...prevData,
            profilePhotoURL: downloadURL,
          }));

          setUploadingPhoto(false);
          setProfileSuccess('Profile photo updated successfully!');
        }
      );
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      setProfileError('Failed to upload profile photo.');
      setUploadingPhoto(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  return (
    <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
      {/* Tabs */}
      <div className="flex justify-center sm:justify-start space-x-4 mb-5">
        <button
          onClick={() => handleTabChange('editProfile')}
          className={`py-2 px-4 text-lg font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'editProfile'
              ? 'border-b-2 border-[#063E50] text-[#063E50]'
              : 'text-[#718EBF] hover:text-[#063E50]'
          }`}
        >
          Profile
        </button>
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
        {/* <button
          onClick={() => handleTabChange('security')}
          className={`py-2 px-4 text-lg font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'security'
              ? 'border-b-2 border-[#063E50] text-[#063E50]'
              : 'text-[#718EBF] hover:text-[#063E50]'
          }`}
        >
          Security
        </button> */}
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
        <button
          onClick={() => handleTabChange('changePassword')}
          className={`py-2 px-4 text-lg font-medium rounded-t-lg transition-colors duration-200 ${
            activeTab === 'changePassword'
              ? 'border-b-2 border-[#063E50] text-[#063E50]'
              : 'text-[#718EBF] hover:text-[#063E50]'
          }`}
        >
          Password
        </button>
      </div>

      {activeTab === 'editProfile' && (
        <div>
          {profileSuccess && (
            <div className="flex items-center mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
              <svg
                className="w-6 h-6 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-700">{profileSuccess}</span>
            </div>
          )}
          {profileError && (
            <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-200 rounded-md">
              <svg
                className="w-6 h-6 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-red-700">{profileError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center md:items-start">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[rgb(166,205,217)]">
                  <img
                    src={formData.profilePhotoURL || placeholderImage}
                    alt="Profile"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => document.getElementById('profilePhotoInput').click()}
                  />
                </div>
                <input
                  type="file"
                  id="profilePhotoInput"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
                {uploadingPhoto && (
                  <div className="mt-2 text-sm text-gray-600">
                    Uploading photo...
                  </div>
                )}
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="fullname">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Your Mobile Number"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="youremail@example.com"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                    disabled
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="border placeholder-[#718EBF] border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your Address"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your City"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Your Postal Code"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Your Country"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="occupation">
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your Occupation"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="workExperience">
                    Work Experience
                  </label>
                  <input
                    type="text"
                    id="workExperience"
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleChange}
                    placeholder="Your Work Experience"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end mt-8">
              <button
                type="submit"
                className={`bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                  isSavingProfile ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'changePassword' && (
        <div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-bold text-[#063E50]">Change Password</h2>

            {passwordSuccess && (
              <div className="flex items-center mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
                <svg
                  className="w-6 h-6 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700">
                  {passwordSuccess}
                </span>
              </div>
            )}
            {passwordError && (
              <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-200 rounded-md">
                <svg
                  className="w-6 h-6 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-700">
                  {passwordError}
                </span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="flex flex-col md:flex-col md:w-1/3 space-y-4">
                <div className="flex flex-col space-y-2 w-full">
                  <label className="text-[#212529]" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <label className="text-[#212529]" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <label className="text-[#212529]" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center sm:justify-end mt-8">
                <button
                  type="submit"
                  className={`bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                    isSavingPassword ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? (
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
                </div>
                <input
                  type="file"
                  id="profilePhotoInput"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {/* Full Name */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="fullname">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Your Mobile Number"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="youremail@example.com"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                    disabled
                  />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="dob">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="border placeholder-[#718EBF] border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="address">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your Address"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="city">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your City"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Postal Code */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Your Postal Code"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="country">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Your Country"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Occupation */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="occupation">
                    Occupation
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Your Occupation"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>

                {/* Work Experience */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[#212529]" htmlFor="workExperience">
                    Work Experience
                  </label>
                  <input
                    type="text"
                    id="workExperience"
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleChange}
                    placeholder="Your Work Experience"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none w-full"
                  />
                </div>
              </div>
            </div>
            {/* Save Button */}
            <div className="flex justify-center sm:justify-end mt-8">
              <button
                type="submit"
                className={`bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                  isSavingProfile ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? (
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
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content for Security Tab */}
      {activeTab === 'security' && (
        <div>
          <div className="flex flex-col space-y-4">
            {/* Two-Factor Authentication Section */}
            <h2 className="text-lg font-bold text-[#063E50]">
              Two-factor Authentication
            </h2>

            {/* Toggle Button */}
            <label className="inline-flex items-center mb-5 cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-[#d2d2d2] peer-focus:ring-4 peer-focus:ring-[#063E50] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#063E50]"></div>
              <span className="ms-3 text-base font-normal text-[#212529]">
                Enable or disable two-factor authentication
              </span>
            </label>
          </div>
          {/* Save Button */}
          <div className="flex justify-center sm:justify-end mt-8">
            <button
              className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Content for Change Password Tab */}
      {activeTab === 'changePassword' && (
        <div>
          <div className="flex flex-col space-y-4">
            {/* Change Password Section */}
            <h2 className="text-lg font-bold text-[#063E50]">
              Change Password
            </h2>

            {/* Display Success or Error Message */}
            {passwordSuccess && (
              <div className="flex items-center mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
                <svg
                  className="w-6 h-6 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-700">
                  {passwordSuccess}
                </span>
              </div>
            )}
            {passwordError && (
              <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-200 rounded-md">
                <svg
                  className="w-6 h-6 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-red-700">
                  {passwordError}
                </span>
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="flex flex-col md:flex-col md:w-1/3 space-y-4">
                <div className="flex flex-col space-y-2 w-full">
                  <label
                    className="text-[#212529]"
                    htmlFor="currentPassword"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Current Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <label
                    className="text-[#212529]"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="New Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-2 w-full">
                  <label
                    className="text-[#212529]"
                    htmlFor="confirmPassword"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm New Password"
                    className="placeholder-[#718EBF] border border-[#DEE2E6] rounded-lg px-4 py-2 outline-none"
                    required
                  />
                </div>
              </div>
              {/* Save Button */}
              <div className="flex justify-center sm:justify-end mt-8">
                <button
                  type="submit"
                  className={`bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                    isSavingPassword ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? (
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
>>>>>>> d90602401d1c06139f1417587e52cb38e0232611
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
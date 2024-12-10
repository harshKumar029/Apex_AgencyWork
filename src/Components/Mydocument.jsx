// src/Components/Mydocument.jsx

import React, { useRef, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Import the compression utility
import { compressImage } from '../utils/compressImage';

const Mydocument = () => {
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);

  // Old File Names (from Firestore)
  const [aadhaarFrontOldFileName, setAadhaarFrontOldFileName] = useState('');
  const [aadhaarBackOldFileName, setAadhaarBackOldFileName] = useState('');
  const [passportPhotoOldFileName, setPassportPhotoOldFileName] = useState('');

  // Displaying File Names
  const [aadhaarFrontName, setAadhaarFrontName] = useState('');
  const [aadhaarBackName, setAadhaarBackName] = useState('');
  const [passportPhotoName, setPassportPhotoName] = useState('');

  // URLs of the documents from Firestore (for viewing)
  const [aadhaarFrontURL, setAadhaarFrontURL] = useState('');
  const [aadhaarBackURL, setAadhaarBackURL] = useState('');
  const [passportPhotoURL, setPassportPhotoURL] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentURL, setModalContentURL] = useState('');
  const [modalFileName, setModalFileName] = useState('');

  const aadhaarFrontRef = useRef(null);
  const aadhaarBackRef = useRef(null);
  const passportPhotoRef = useRef(null);

  const handleFileChange = (event, setFile, setFileName) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name);
    }
  };

  // Fetch existing document names and URLs from Firestore
  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(
            db,
            'users',
            user.uid,
            'Details&Documents',
            'Documents'
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Aadhaar Front
            if (data.aadhaarFrontName) {
              setAadhaarFrontName(data.aadhaarFrontName);
              setAadhaarFrontOldFileName(data.aadhaarFrontName);
            }
            if (data.aadhaarFront) {
              setAadhaarFrontURL(data.aadhaarFront);
            }

            // Aadhaar Back
            if (data.aadhaarBackName) {
              setAadhaarBackName(data.aadhaarBackName);
              setAadhaarBackOldFileName(data.aadhaarBackName);
            }
            if (data.aadhaarBack) {
              setAadhaarBackURL(data.aadhaarBack);
            }

            // Passport Photo
            if (data.passportPhotoName) {
              setPassportPhotoName(data.passportPhotoName);
              setPassportPhotoOldFileName(data.passportPhotoName);
            }
            if (data.passportPhoto) {
              setPassportPhotoURL(data.passportPhoto);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching document names:', err);
      }
    };

    fetchDocumentData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setUploading(true);
    setUploadProgress(0);

    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated.');
      setUploading(false);
      return;
    }

    try {
      const filesToUpload = [
        {
          file: aadhaarFrontFile,
          name: 'aadhaarFront',
          fileName: aadhaarFrontName,
          oldFileName: aadhaarFrontOldFileName,
          setOldFileName: setAadhaarFrontOldFileName,
        },
        {
          file: aadhaarBackFile,
          name: 'aadhaarBack',
          fileName: aadhaarBackName,
          oldFileName: aadhaarBackOldFileName,
          setOldFileName: setAadhaarBackOldFileName,
        },
        {
          file: passportPhotoFile,
          name: 'passportPhoto',
          fileName: passportPhotoName,
          oldFileName: passportPhotoOldFileName,
          setOldFileName: setPassportPhotoOldFileName,
        },
      ];

      const uploadPromises = filesToUpload.map(
        async ({ file, name, fileName, oldFileName, setOldFileName }) => {
          if (file) {
<<<<<<< HEAD
            // Compress the image before uploading (to ~150KB)
            const compressedFile = await compressImage(file, 150);

            // Delete old file if exists
=======
            // Compress the image before uploading
            const compressedFile = await compressImage(file, 150); // Compress to 150KB

            // Before uploading the new file, delete the existing file if it exists
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
            if (oldFileName) {
              const oldFileRef = ref(
                storage,
                `users/${user.uid}/Documents/${name}/${oldFileName}`
              );
              await deleteObject(oldFileRef).catch((error) => {
                console.error(`Error deleting old ${name} file:`, error);
              });
            }

            // Upload new file
            const storageRef = ref(
              storage,
              `users/${user.uid}/Documents/${name}/${compressedFile.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, compressedFile);

            return new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadProgress((prevProgress) => {
<<<<<<< HEAD
=======
                    // Calculate the average progress across all uploads
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
                    const totalFiles = filesToUpload.filter((f) => f.file).length;
                    const newProgress =
                      (prevProgress * (totalFiles - 1) + progress) / totalFiles;
                    return newProgress;
                  });
                },
                (error) => {
                  console.error(`Error uploading ${name}:`, error);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                  // Update the old file name to the new one
                  setOldFileName(compressedFile.name);
                  resolve({
                    [`${name}`]: downloadURL,
                    [`${name}Name`]: compressedFile.name,
                  });
                }
              );
            });
          }

          // If no new file is chosen, do not overwrite existing fields
          return {};
        }
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Merge all non-empty results into one object
      const downloadURLs = uploadResults.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

      // If we have new data to update, do so
      if (Object.keys(downloadURLs).length > 0) {
        const docRef = doc(db, 'users', user.uid, 'Details&Documents', 'Documents');
        await setDoc(docRef, downloadURLs, { merge: true });

        // Update local state with new URLs if files were uploaded
        if (downloadURLs.aadhaarFront) setAadhaarFrontURL(downloadURLs.aadhaarFront);
        if (downloadURLs.aadhaarBack) setAadhaarBackURL(downloadURLs.aadhaarBack);
        if (downloadURLs.passportPhoto) setPassportPhotoURL(downloadURLs.passportPhoto);
      }

      setSuccessMessage('Documents uploaded successfully!');
    } catch (err) {
      console.error('Error uploading documents:', err);
      setError('Failed to upload documents.');
    } finally {
      setUploading(false);
    }
  };

  // Function to open modal
  const openModal = (url, fileName) => {
    setModalContentURL(url);
    setModalFileName(fileName);
    setIsModalOpen(true);
  };

  // Determine if a file is a PDF
  const isPDF = (fileName) => {
    return fileName?.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">
        ID Proof Documents
      </h1>

      {/* Display Success or Error Message */}
      {successMessage && (
        <div className="flex items-center mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
          <svg
            className="w-6 h-6 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center mb-4 p-4 bg-red-100 border border-red-200 rounded-md">
          <svg
            className="w-6 h-6 text-red-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:w-[50%]">
          {/* Aadhaar Front */}
          <div>
            <label className="block text-black mb-1" htmlFor="aadhaarFront">
              Upload Your Aadhaar Card (Front) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="file"
                id="aadhaarFront"
                ref={aadhaarFrontRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileChange(e, setAadhaarFrontFile, setAadhaarFrontName)
                }
                required={!aadhaarFrontName} // Required if no file uploaded yet
              />
              <input
                type="text"
                value={aadhaarFrontName}
                placeholder="Choose file"
                className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
                onClick={() => aadhaarFrontRef.current.click()}
                readOnly
              />
<<<<<<< HEAD
              {aadhaarFrontURL && (
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => openModal(aadhaarFrontURL, aadhaarFrontName)}
                  title="View Document"
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z"
                      fill="#A726A7"
                    />
                  </svg>
                </span>
              )}
=======
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => aadhaarFrontRef.current.click()}
              >
                {/* Icon here */}
                {/* Example SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#718EBF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-4.553a1 1 0 011.414 1.414L16.414 12l4.553 4.553a1 1 0 01-1.414 1.414L15 13.414l-4.553 4.553a1 1 0 01-1.414-1.414L13.586 12 9.033 7.447a1 1 0 011.414-1.414L15 10z" />
                </svg>
              </span>
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
            </div>
          </div>

          {/* Aadhaar Back */}
          <div>
            <label className="block text-black mb-1" htmlFor="aadhaarBack">
              Upload Your Aadhaar Card (Back) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="file"
                id="aadhaarBack"
                ref={aadhaarBackRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileChange(e, setAadhaarBackFile, setAadhaarBackName)
                }
                required={!aadhaarBackName} // Required if no file uploaded yet
              />
              <input
                type="text"
                value={aadhaarBackName}
                placeholder="Choose file"
                className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
                onClick={() => aadhaarBackRef.current.click()}
                readOnly
              />
<<<<<<< HEAD
              {aadhaarBackURL && (
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => openModal(aadhaarBackURL, aadhaarBackName)}
                  title="View Document"
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z"
                      fill="#A726A7"
                    />
                  </svg>
                </span>
              )}
=======
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => aadhaarBackRef.current.click()}
              >
                {/* Icon here */}
                {/* Example SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#718EBF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-4.553a1 1 0 011.414 1.414L16.414 12l4.553 4.553a1 1 0 01-1.414 1.414L15 13.414l-4.553 4.553a1 1 0 01-1.414-1.414L13.586 12 9.033 7.447a1 1 0 011.414-1.414L15 10z" />
                </svg>
              </span>
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
            </div>
          </div>

          {/* Passport Photo */}
          <div>
            <label className="block text-black mb-1">
              Upload Your Passport Size Photo <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="file"
                id="passportPhoto"
                ref={passportPhotoRef}
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileChange(e, setPassportPhotoFile, setPassportPhotoName)
                }
                required={!passportPhotoName} // Required if no file uploaded yet
              />
              <input
                type="text"
                value={passportPhotoName}
                placeholder="Choose file"
                className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
                onClick={() => passportPhotoRef.current.click()}
                readOnly
              />
<<<<<<< HEAD
              {passportPhotoURL && (
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => openModal(passportPhotoURL, passportPhotoName)}
                  title="View Document"
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 6.5C8.41146 6.5 8.79948 6.57812 9.16406 6.73438C9.52865 6.89062 9.84635 7.10417 10.1172 7.375C10.388 7.64583 10.6042 7.96615 10.7656 8.33594C10.9271 8.70573 11.0052 9.09375 11 9.5C11 9.91667 10.9219 10.3047 10.7656 10.6641C10.6094 11.0234 10.3958 11.3411 10.125 11.6172C9.85417 11.8932 9.53385 12.1094 9.16406 12.2656C8.79427 12.4219 8.40625 12.5 8 12.5C7.58333 12.5 7.19531 12.4219 6.83594 12.2656C6.47656 12.1094 6.15885 11.8958 5.88281 11.625C5.60677 11.3542 5.39062 11.0365 5.23438 10.6719C5.07812 10.3073 5 9.91667 5 9.5C5 9.08854 5.07812 8.70052 5.23438 8.33594C5.39062 7.97135 5.60417 7.65365 5.875 7.38281C6.14583 7.11198 6.46354 6.89583 6.82812 6.73438C7.19271 6.57292 7.58333 6.49479 8 6.5ZM8 11.5C8.27604 11.5 8.53385 11.4479 8.77344 11.3438C9.01302 11.2396 9.22656 11.0964 9.41406 10.9141C9.60156 10.7318 9.74479 10.5208 9.84375 10.2812C9.94271 10.0417 9.99479 9.78125 10 9.5C10 9.22396 9.94792 8.96615 9.84375 8.72656C9.73958 8.48698 9.59635 8.27344 9.41406 8.08594C9.23177 7.89844 9.02083 7.75521 8.78125 7.65625C8.54167 7.55729 8.28125 7.50521 8 7.5C7.72396 7.5 7.46615 7.55208 7.22656 7.65625C6.98698 7.76042 6.77344 7.90365 6.58594 8.08594C6.39844 8.26823 6.25521 8.47917 6.15625 8.71875C6.05729 8.95833 6.00521 9.21875 6 9.5C6 9.77604 6.05208 10.0339 6.15625 10.2734C6.26042 10.513 6.40365 10.7266 6.58594 10.9141C6.76823 11.1016 6.97917 11.2448 7.21875 11.3438C7.45833 11.4427 7.71875 11.4948 8 11.5ZM8 2.5C8.74479 2.5 9.48438 2.59115 10.2188 2.77344C10.9531 2.95573 11.6458 3.22917 12.2969 3.59375C12.9479 3.95833 13.5365 4.40104 14.0625 4.92188C14.5885 5.44271 15.0208 6.05208 15.3594 6.75C15.5677 7.18229 15.7266 7.6276 15.8359 8.08594C15.9453 8.54427 16 9.01562 16 9.5H15C15 8.88542 14.9062 8.3099 14.7188 7.77344C14.5312 7.23698 14.2734 6.7474 13.9453 6.30469C13.6172 5.86198 13.2266 5.46615 12.7734 5.11719C12.3203 4.76823 11.8385 4.47396 11.3281 4.23438C10.8177 3.99479 10.2734 3.8125 9.69531 3.6875C9.11719 3.5625 8.55208 3.5 8 3.5C7.4375 3.5 6.8724 3.5625 6.30469 3.6875C5.73698 3.8125 5.19531 3.99479 4.67969 4.23438C4.16406 4.47396 3.67969 4.76823 3.22656 5.11719C2.77344 5.46615 2.38542 5.86198 2.0625 6.30469C1.73958 6.7474 1.47917 7.23698 1.28125 7.77344C1.08333 8.3099 0.989583 8.88542 1 9.5H0C0 9.02083 0.0546875 8.55208 0.164062 8.09375C0.273438 7.63542 0.432292 7.1875 0.640625 6.75C0.973958 6.0625 1.40365 5.45573 1.92969 4.92969C2.45573 4.40365 3.04688 3.95833 3.70312 3.59375C4.35938 3.22917 5.05208 2.95833 5.78125 2.78125C6.51042 2.60417 7.25 2.51042 8 2.5Z"
                      fill="#A726A7"
                    />
                  </svg>
                </span>
              )}
=======
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => passportPhotoRef.current.click()}
              >
                {/* Icon here */}
                {/* Example SVG Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#718EBF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-4.553a1 1 0 011.414 1.414L16.414 12l4.553 4.553a1 1 0 01-1.414 1.414L15 13.414l-4.553 4.553a1 1 0 01-1.414-1.414L13.586 12 9.033 7.447a1 1 0 011.414-1.414L15 10z" />
                </svg>
              </span>
>>>>>>> 777b62fe33d77e3739b4767937f818147576845b
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end mt-8">
          <button
            type="submit"
            className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full"
            disabled={uploading}
          >
            {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Save'}
          </button>
        </div>
      </form>

      {/* Modal for viewing documents */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-4 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Viewing: {modalFileName || 'Document'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="overflow-auto max-h-[80vh]">
              {isPDF(modalFileName) ? (
                <iframe
                  src={modalContentURL}
                  title="document"
                  className="w-full h-[80vh]"
                />
              ) : (
                <img
                  src={modalContentURL}
                  alt={modalFileName || 'Document'}
                  className="w-full h-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mydocument;
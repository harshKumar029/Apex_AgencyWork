import React, { useRef, useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase'; // Ensure storage is imported
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Mydocument = () => {
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);

  // New State Variables for Old File Names
  const [aadhaarFrontOldFileName, setAadhaarFrontOldFileName] = useState('');
  const [aadhaarBackOldFileName, setAadhaarBackOldFileName] = useState('');
  const [passportPhotoOldFileName, setPassportPhotoOldFileName] = useState('');

  // State Variables for Displaying File Names
  const [aadhaarFrontName, setAadhaarFrontName] = useState('');
  const [aadhaarBackName, setAadhaarBackName] = useState('');
  const [passportPhotoName, setPassportPhotoName] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const aadhaarFrontRef = useRef(null);
  const aadhaarBackRef = useRef(null);
  const passportPhotoRef = useRef(null);

  const handleFileChange = (event, setFile, setFileName) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setFileName(file.name); // Update display name
      // Do not update old file name here
    }
  };

  // Fetch existing document names from Firestore
  useEffect(() => {
    const fetchDocumentNames = async () => {
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
            if (data.aadhaarFrontName) {
              setAadhaarFrontName(data.aadhaarFrontName);
              setAadhaarFrontOldFileName(data.aadhaarFrontName);
            }
            if (data.aadhaarBackName) {
              setAadhaarBackName(data.aadhaarBackName);
              setAadhaarBackOldFileName(data.aadhaarBackName);
            }
            if (data.passportPhotoName) {
              setPassportPhotoName(data.passportPhotoName);
              setPassportPhotoOldFileName(data.passportPhotoName);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching document names:', err);
      }
    };

    fetchDocumentNames();
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
            // Before uploading the new file, delete the existing file if it exists
            if (oldFileName) {
              const oldFileRef = ref(
                storage,
                `users/${user.uid}/Documents/${name}/${oldFileName}`
              );
              await deleteObject(oldFileRef).catch((error) => {
                console.error(`Error deleting old ${name} file:`, error);
              });
            }

            // Proceed to upload the new file
            const storageRef = ref(
              storage,
              `users/${user.uid}/Documents/${name}/${file.name}`
            );
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadProgress(progress);
                },
                (error) => {
                  console.error(`Error uploading ${name}:`, error);
                  reject(error);
                },
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  // Update the old file name to the new one
                  setOldFileName(file.name);
                  resolve({
                    [`${name}`]: downloadURL,
                    [`${name}Name`]: file.name,
                  });
                }
              );
            });
          }
          return {
            [`${name}`]: null,
            [`${name}Name`]: fileName || '',
          }; // Keep existing file name if not changed
        }
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Combine all the results into one object
      const downloadURLs = uploadResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      // Save the download URLs and file names to Firestore
      const docRef = doc(db, 'users', user.uid, 'Details&Documents', 'Documents');
      await setDoc(docRef, downloadURLs, { merge: true });

      setSuccessMessage('Documents uploaded successfully!');
    } catch (err) {
      console.error('Error uploading documents:', err);
      setError('Failed to upload documents.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Documents</h1>

      {/* Display Success or Error Message */}
      {successMessage && (
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Input Fields */}
        <div className="space-y-4 sm:w-[50%]">
          {/* Aadhaar Card (Front) */}
          <div>
            <label className="block text-black mb-1" htmlFor="aadhaarFront">
              Upload Your Aadhaar Card (Front) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
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
                onClick={() => aadhaarFrontRef.current.click()} // Open file dialog on click
                readOnly
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => aadhaarFrontRef.current.click()}
              >
                {/* Icon here */}
                {/* ... SVG icon ... */}
              </span>
            </div>
          </div>

          {/* Aadhaar Card (Back) */}
          <div>
            <label className="block text-black mb-1" htmlFor="aadhaarBack">
              Upload Your Aadhaar Card (Back) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
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
                onClick={() => aadhaarBackRef.current.click()} // Open file dialog on click
                readOnly
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => aadhaarBackRef.current.click()}
              >
                {/* Icon here */}
                {/* ... SVG icon ... */}
              </span>
            </div>
          </div>

          {/* Passport Size Photo */}
          <div>
            <label className="block text-black mb-1">
              Upload Your Passport Size Photo{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                id="passportPhoto"
                ref={passportPhotoRef}
                className="hidden"
                accept="image/*"
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
                onClick={() => passportPhotoRef.current.click()} // Open file dialog on click
                readOnly
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => passportPhotoRef.current.click()}
              >
                {/* Icon here */}
                {/* ... SVG icon ... */}
              </span>
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
    </div>
  );
};

export default Mydocument;

import React, { useRef, useState } from 'react';

const Mydocument = () => {
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState('');
  const [aadhaarBackFile, setAadhaarBackFile] = useState('');
  const [passportPhotoFile, setPassportPhotoFile] = useState('');

  const aadhaarFrontRef = useRef(null);
  const aadhaarBackRef = useRef(null);
  const passportPhotoRef = useRef(null);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file.name); // Store the name of the selected file
    }
  };

  return (
    <div className='w-[95%] m-auto mt-5'>
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Documents</h1>

      {/* Input Fields */}
      <div className="space-y-4 sm:w-[50%]">
        {/* Aadhaar Card (Front) */}
        <div>
          <label className="block text-black mb-1" htmlFor="aadhaarFront">
            Upload Your Aadhaar Card (Front) <span className="text-red-500">*</span>
          </label>
          <div className='relative'>
            <input
              type="file"
              id="aadhaarFront"
              ref={aadhaarFrontRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, setAadhaarFrontFile)}
              required
            />
            <input
              type="text"
              value={aadhaarFrontFile}
              placeholder="Choose file"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
              onClick={() => aadhaarFrontRef.current.click()} // Open file dialog on click
              readOnly
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {/* Icon here */}
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.375 13.125V16.625C18.375 17.0891 18.1906 17.5342 17.8624 17.8624C17.5342 18.1906 17.0891 18.375 16.625 18.375L4.375 18.375C3.91087 18.375 3.46575 18.1906 3.13756 17.8624C2.80937 17.5342 2.625 17.0891 2.625 16.625L2.625 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.875 7L10.5 2.625L6.125 7"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 2.625L10.5 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Aadhaar Card (Back) */}
        <div >
          <label className="block text-black mb-1" htmlFor="aadhaarBack">
            Upload Your Aadhaar Card (Back) <span className="text-red-500">*</span>
          </label>
          <div className='relative'>
            <input
              type="file"
              id="aadhaarBack"
              ref={aadhaarBackRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, setAadhaarBackFile)}
              required
            />
            <input
              type="text"
              value={aadhaarBackFile}
              placeholder="Choose file"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
              onClick={() => aadhaarBackRef.current.click()} // Open file dialog on click
              readOnly
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {/* Icon here */}
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.375 13.125V16.625C18.375 17.0891 18.1906 17.5342 17.8624 17.8624C17.5342 18.1906 17.0891 18.375 16.625 18.375L4.375 18.375C3.91087 18.375 3.46575 18.1906 3.13756 17.8624C2.80937 17.5342 2.625 17.0891 2.625 16.625L2.625 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.875 7L10.5 2.625L6.125 7"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 2.625L10.5 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Passport Size Photo */}
        <div>
          <label className="block text-black mb-1" >
            Upload Your Passport Size Photo <span className="text-red-500">*</span>
          </label>
          <div className='relative'>
            <input
              type="file"
              id="passportPhoto"
              ref={passportPhotoRef}
              className="hidden"
              onChange={(e) => handleFileChange(e, setPassportPhotoFile)}
              required
            />
            <input
              type="text"
              value={passportPhotoFile}
              placeholder="Choose file"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF] pr-10 cursor-pointer"
              onClick={() => passportPhotoRef.current.click()} // Open file dialog on click
              readOnly
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
              {/* Icon here */}
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.375 13.125V16.625C18.375 17.0891 18.1906 17.5342 17.8624 17.8624C17.5342 18.1906 17.0891 18.375 16.625 18.375L4.375 18.375C3.91087 18.375 3.46575 18.1906 3.13756 17.8624C2.80937 17.5342 2.625 17.0891 2.625 16.625L2.625 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.875 7L10.5 2.625L6.125 7"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5 2.625L10.5 13.125"
                  stroke="#ADB5BD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center sm:justify-end mt-8">
        <button className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full">
          Save
        </button>
      </div>
    </div>
  );
};

export default Mydocument;

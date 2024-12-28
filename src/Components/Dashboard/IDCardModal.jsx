import React from 'react';

const IDCardModal = ({
  isOpen,
  onClose,
  profilePhotoURL,
  fullname,
  uniqueID,
  mobile,
  address,
  city,
  country,
  postalCode
}) => {
  // Check if all required details are present
  const allDetailsPresent =
    profilePhotoURL &&
    fullname &&
    uniqueID &&
    mobile &&
    address &&
    city &&
    country &&
    postalCode;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
        >
          X
        </button>

        <div className="p-4 mt-20 mb-20">
          {allDetailsPresent ? (
            <div className="id-card-container w-full">
              {/* Use inline styles and classes from original code and adapt to Tailwind/responsive */}
              <div className="id-card text-center bg-white rounded-2xl shadow-md overflow-hidden transform transition-transform">
                <div
                  className="header p-5"
                  style={{
                    background: 'linear-gradient(45deg, #063e50, #065a7a)',
                    color: 'white'
                  }}
                >
                  <div className="logo mb-2">
                    {/* Replace `globe-icon.png` with actual logo image URL */}
                    <img
                      src="/Apexwhite.png"
                      alt="Logo"
                      style={{ width: '50px', display: 'inline-block' }}
                    />
                  </div>
                  <div className="title">
                    <h1 className="text-2xl font-bold text-white">APEX SUPPORT AND SERVICES</h1>
                    <p className="text-sm text-gray-300">
                      D35 Noida sector 2 near Red FM building 201301
                    </p>
                  </div>
                  <div
                    className="badge inline-block mt-3 px-5 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: '#ffd700', color: '#333' }}
                  >
                    Finesse Advisory
                  </div>
                </div>
                <div className="content flex flex-col items-center p-5 bg-gray-100">
                  <div className="profile-image mb-6 mb-1 mr-4">
                    <img
                      src={profilePhotoURL}
                      alt={fullname}
                      className="w-32 h-32 rounded-full border-2 border-[#063e50]"
                    />
                  </div>
                  <div className="details text-center text-base text-gray-700">
                    <p className="mb-2">
                      <strong className="text-[#063e50]">Name:</strong> {fullname}
                    </p>
                    <p className="mb-2">
                      <strong className="text-[#063e50]">Agents ID:</strong> {uniqueID}
                    </p>
                    <p className="mb-2">
                      <strong className="text-[#063e50]">Phone:</strong> {mobile}
                    </p>
                    <p className="mb-2">
                      <strong className="text-[#063e50]">Address:</strong> {address}, {city}, {country} {postalCode}
                    </p>
                  </div>
                </div>
                <div className="footer bg-[#063e50] text-white text-xs py-2">
                  © {new Date().getFullYear()} Apexin.in | All Rights Reserved
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-10">
              <h2 className="text-xl font-semibold mb-4">Complete your profile</h2>
              <p className="text-gray-600">Some required information is missing. Please update your profile details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDCardModal;
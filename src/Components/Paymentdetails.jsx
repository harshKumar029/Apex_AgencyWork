import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Paymentdetails = () => {
  const [formData, setFormData] = useState({
    pan: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setError('');
    setSuccessMessage('');
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch existing payment details from Firestore
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const paymentDocRef = doc(
            db,
            'users',
            user.uid,
            'Details&Documents',
            'Bankdetails'
          );
          const paymentDoc = await getDoc(paymentDocRef);
          if (paymentDoc.exists()) {
            setFormData(paymentDoc.data());
          }
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Failed to load payment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const user = auth.currentUser;
      if (user) {
        // You can perform validation here if necessary
        const paymentDocRef = doc(
          db,
          'users',
          user.uid,
          'Details&Documents',
          'Bankdetails'
        );
        await setDoc(paymentDocRef, formData, { merge: true });
        setSuccessMessage('Payment details saved successfully!');
      }
    } catch (err) {
      console.error('Error saving payment details:', err);
      setError('Failed to save payment details.');
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <img src="/loading.gif" alt="Loading..." style={{ width: '100px', height: '100px' }}/>
      </div>
    );
  }

  return (
    <div className="w-[95%] m-auto mt-5 mb-28 sm:my-5">
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Bank Account Details</h1>

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
        {/* Input Fields Container */}
        <div className="space-y-4 sm:w-[50%]">
          <div>
            <label className="block text-black mb-1" htmlFor="pan">
              PAN Card Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pan"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              placeholder="CDPH678R"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF]"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-1" htmlFor="bankName">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="HDFC Bank"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF]"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-1" htmlFor="accountNumber">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="64788593939"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF]"
              required
            />
          </div>

          <div>
            <label className="block text-black mb-1" htmlFor="ifscCode">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
              placeholder="IDFC6378"
              className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF]"
              required
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end mt-8 w-full">
          <button
            type="submit"
            className="bg-[#063E50] text-white py-2 px-20 sm:px-12 rounded-full transition-transform duration-200 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Paymentdetails;
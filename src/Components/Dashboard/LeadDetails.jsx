// src/Components/Dashboard/LeadDetails.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';

const LeadDetails = () => {
  const navigate = useNavigate();
  const { serviceId, bankId } = useParams();

  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service data
        const serviceDocRef = doc(db, 'services', serviceId);
        const serviceDoc = await getDoc(serviceDocRef);
        if (!serviceDoc.exists()) {
          setError('Service not found.');
          return;
        }
        const sData = serviceDoc.data();
        setServiceData(sData);

        // Fetch earnings data
        const earningsDocRef = doc(db, 'earnings', serviceId);
        const earningsDoc = await getDoc(earningsDocRef);
        if (earningsDoc.exists()) {
          setEarningsData(earningsDoc.data());
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
      }
    };

    fetchData();
  }, [serviceId]);

  const isNonCreditCardService = serviceData && !serviceData.name.toLowerCase().includes('credit card');

  // Fields for credit card services
  const creditCardFields = [
    { label: 'Customer Name', name: 'fullname', placeholder: 'Rohit Sharma' },
    { label: 'Father Name', name: 'fatherName', placeholder: 'Suraj Sharma' },
    { label: 'Mother Name', name: 'motherName', placeholder: 'Sushila Sharma' },
    { label: 'PAN Card Number', name: 'panCardNumber', placeholder: 'CDPH678R' },
    { label: 'Date of Birth', name: 'dob', placeholder: '02/12/1997' },
    { label: 'Adhaar Card Number', name: 'aadhaarNumber', placeholder: '5328910833645' },
    { label: 'Mobile Number', name: 'mobile', placeholder: '9876543210' },
    { label: 'Email ID', name: 'email', placeholder: 'rohit.verma@gmail.com' },
    { label: 'Address', name: 'address', placeholder: 'Delhi, Shastri Park, U Block' },
    { label: 'RESIDENCE LANDMARK', name: 'residenceLandmark', placeholder: 'Gali No-2 opposite radisson blu.' },
    { label: 'Pin Code', name: 'postalCode', placeholder: '110092' },
    { label: 'SALARIED/SELF EMPLOYED', name: 'employmentType', placeholder: 'SALARIED' },
    { label: 'Company Name', name: 'companyName', placeholder: 'Infosys' },
    { label: 'Designation', name: 'designation', placeholder: 'Engineer' },
    { label: 'Company Address', name: 'companyAddress', placeholder: 'Noida' },
    { label: 'COMPANY LANDMARK', name: 'companyLandmark', placeholder: 'Plot No 1,2,5 Knowledge Park-4, Greater Noida' },
    { label: 'COMPANY PINCODE', name: 'companyPincode', placeholder: '110018' },
    { label: 'Official Email ID', name: 'officialEmail', placeholder: 'rohit@infosys.com' },
    { label: 'NET SALARY', name: 'netSalary', placeholder: '12,00,000' },
  ];

  // Fields for non-credit card services
  const nonCreditCardFields = [
    { label: 'Customer Name', name: 'fullname', placeholder: 'Rohit Sharma' },
    { label: 'Mobile Number', name: 'mobile', placeholder: '9876543210' },
    { label: 'Email ID', name: 'email', placeholder: 'rohit.verma@gmail.com' },
    { label: 'Address', name: 'address', placeholder: 'Delhi, Shastri Park, U Block' },
  ];

  const inputFields = isNonCreditCardService ? nonCreditCardFields : creditCardFields;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateLeadId = () => {
    // Generate a 7-digit unique number. For simplicity, we'll just use Math.random.
    // In a production environment, consider a more robust approach.
    const leadId = Math.floor(1000000 + Math.random() * 9000000).toString();
    return leadId;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError('User not authenticated.');
        setIsSubmitting(false);
        return;
      }

      const leadId = generateLeadId();

      const leadData = {
        userId: user.uid,
        serviceId,
        bankId,
        leadId: leadId,
        customerDetails: formData,
        status: 'pending',
        submissionDate: Timestamp.now(),
      };

      // Add earning amount if present
      if (earningsData && earningsData[bankId] !== undefined) {
        leadData.earningAmount = earningsData[bankId];
      }

      const docRef = await addDoc(collection(db, 'leads'), leadData);

      // After submission, navigate to confirmation page
      navigate(`/dashboard/selectbank/${serviceId}/leaddetails/confirmation`, {
        state: { customerName: formData.fullname },
      });
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError('Failed to submit lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <div className="flex items-center py-4 w-full">
        <div className='flex gap-3'>
          <div>
            <svg onClick={() => navigate(-1)} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.6667 11.6665L3.84186 12.4913L3.01703 11.6665L3.84186 10.8416L4.6667 11.6665ZM24.5 20.9998C24.5 21.3092 24.3771 21.606 24.1583 21.8248C23.9395 22.0436 23.6428 22.1665 23.3334 22.1665C23.0239 22.1665 22.7272 22.0436 22.5084 21.8248C22.2896 21.606 22.1667 21.3092 22.1667 20.9998H24.5ZM9.6752 18.3246L3.84186 12.4913L5.49153 10.8416L11.3249 16.675L9.6752 18.3246ZM3.84186 10.8416L9.6752 5.0083L11.3249 6.65797L5.49153 12.4913L3.84186 10.8416ZM4.6667 10.4998H16.3334V12.8331H4.6667V10.4998ZM24.5 18.6665V20.9998H22.1667V18.6665H24.5ZM16.3334 10.4998C18.4993 10.4998 20.5765 11.3602 22.1081 12.8918C23.6396 14.4233 24.5 16.5005 24.5 18.6665H22.1667C22.1667 17.1194 21.5521 15.6356 20.4582 14.5417C19.3642 13.4477 17.8805 12.8331 16.3334 12.8331V10.4998Z" fill="#495057" />
            </svg>
          </div>
          <div>
            <h2 className="text-[#343C6A] font-medium text-2xl">Lead Details</h2>
            <p className="text-[#495057] font-light text-base">
              Fill up the lead details to proceed further
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className='text-red-500 mb-4'>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="block text-[#212529] font-normal text-sm">
              {field.label}
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="w-full mt-1 p-2 border placeholder:text-[#718EBF] border-gray-300 rounded-md"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center sm:justify-end mt-8">
        <button
          onClick={handleSubmit}
          className="bg-[#063E50] text-white py-2 px-20 w-full sm:w-auto sm:px-12 rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
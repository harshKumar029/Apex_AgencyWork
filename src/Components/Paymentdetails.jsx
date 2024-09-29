import React from 'react';

const Paymentdetails = () => {
  return (
    <div className=' w-[95%] m-auto mt-5'>
      <h1 className="text-2xl font-medium text-[#343C6A] mb-4">Payment details</h1>
      
      {/* Input Fields */}
      <div className="space-y-4 sm:w-[50%]">
        <div>
          <label className="block text-black mb-1" htmlFor="pan">
            PAN Card Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pan"
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
            placeholder="IDFC6378"
            className="border border-[#DEE2E6] rounded-lg w-full p-2 placeholder-[#718EBF]"
            required
          />
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

export default Paymentdetails;

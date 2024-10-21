import React, { useState } from 'react';

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleToggle = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
      <h1 className="text-xl font-medium text-[#063E50] mb-4">
        Choose your preferred <br /> language
      </h1>

      {/* Toggle Buttons */}
      <div className="flex flex-col gap-7 ">
        {/* English Toggle */}
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={selectedLanguage === 'English'} 
            onChange={() => handleToggle('English')} 
          />
          <div class="relative w-11 h-6 bg-[#ADB5BD] rounded-full peer dark:bg-[#ADB5BD] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#063E50]"></div>

          <span className="ms-3 text-base font-normal text-[#212529] ">English</span>
        </label>

        {/* Hindi Toggle */}
        <label className="inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={selectedLanguage === 'Hindi'} 
            onChange={() => handleToggle('Hindi')} 
          />
          <div class="relative w-11 h-6 bg-[#ADB5BD] rounded-full peer dark:bg-[#ADB5BD] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#063E50]"></div>
          <span className="ms-3 text-base font-normal text-[#212529] ">Hindi</span>
        </label>
      </div>

      {/* Save Button */}
      <div className="flex justify-end w-[95%] mt-8">
        <button className="bg-[#063E50] text-white py-2 px-12 rounded-full">
          Save
        </button>
      </div>
    </div>
  );
};

export default Language;

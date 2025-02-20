// src/Components/Support.jsx

import React from 'react';

const Support = () => {
    return (
        <div className='w-[95%] m-auto mt-5 mb-28 sm:my-5'>
            <h1 className="text-xl font-medium text-[#063E50] mb-4">Get in Touch with Us.</h1>

            {/* Contact Sections */}
            <div className="flex items-center justify-between mb-4 pb-2">
                <a href="tel:+917042336564" className="flex gap-3 items-center">
                    <svg className=' w-14' viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25.5" cy="25.5" r="25.5" fill="#638692" fillOpacity="0.13" />
                        <path d="M22.7745 23.7615C23.4783 24.9979 24.5021 26.0217 25.7385 26.7255L26.4015 25.797C26.5081 25.6477 26.6658 25.5427 26.8446 25.5017C27.0234 25.4608 27.2111 25.4869 27.372 25.575C28.4327 26.1547 29.6042 26.5033 30.8092 26.598C30.9973 26.6129 31.1729 26.6982 31.3009 26.8367C31.4289 26.9753 31.5 27.1571 31.5 27.3458V30.6923C31.5 30.8779 31.4312 31.0571 31.3068 31.1949C31.1824 31.3328 31.0112 31.4196 30.8265 31.4385C30.429 31.4797 30.0285 31.5 29.625 31.5C23.205 31.5 18 26.295 18 19.875C18 19.4715 18.0203 19.071 18.0615 18.6735C18.0804 18.4888 18.1672 18.3176 18.3051 18.1932C18.4429 18.0688 18.6221 18 18.8078 18H22.1542C22.3429 18 22.5247 18.0711 22.6633 18.1991C22.8018 18.3271 22.8871 18.5027 22.902 18.6908C22.9967 19.8958 23.3453 21.0673 23.925 22.128C24.0131 22.2889 24.0392 22.4766 23.9983 22.6554C23.9573 22.8342 23.8523 22.9919 23.703 23.0985L22.7745 23.7615ZM20.883 23.2687L22.308 22.251C21.9036 21.3781 21.6265 20.4516 21.4852 19.5H19.5075C19.503 19.6245 19.5007 19.7498 19.5007 19.875C19.5 25.467 24.033 30 29.625 30C29.7502 30 29.8755 29.9978 30 29.9925V28.0148C29.0484 27.8735 28.1219 27.5964 27.249 27.192L26.2313 28.617C25.8215 28.4578 25.4235 28.2698 25.0402 28.0545L24.9968 28.0297C23.5257 27.1925 22.3075 25.9743 21.4702 24.5032L21.4455 24.4598C21.2302 24.0765 21.0422 23.6785 20.883 23.2687Z" fill="#063E50" />
                    </svg>
                    <span className="text-[#063E50] font-normal">Call Us</span>
                </a>
            </div>

            <div className="flex items-center justify-between mb-4 pb-2">
                {/* Connect on WhatsApp */}
                <a href="https://wa.me/917042336564" className="flex gap-3 items-center">
                    <svg className=' w-14' viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25.5" cy="25.5" r="25.5" fill="#638692" fillOpacity="0.13" />
                        <path d="M29.6 28.0001C29.4 27.9001 28.1 27.3001 27.9 27.2001C27.7 27.1001 27.5 27.1001 27.3 27.3001C27.1 27.5001 26.7 28.1001 26.5 28.3001C26.4 28.5001 26.2 28.5001 26 28.4001C25.3 28.1001 24.6 27.7001 24 27.2001C23.5 26.7001 23 26.1001 22.6 25.5001C22.5 25.3001 22.6 25.1001 22.7 25.0001C22.8 24.9001 22.9 24.7001 23.1 24.6001C23.2 24.5001 23.3 24.3001 23.3 24.2001C23.4 24.1001 23.4 23.9001 23.3 23.8001C23.2 23.7001 22.7 22.5001 22.5 22.0001C22.4 21.3001 22.2 21.3001 22 21.3001H21.5C21.3 21.3001 21 21.5001 20.9 21.6001C20.3 22.2001 20 22.9001 20 23.7001C20.1 24.6001 20.4 25.5001 21 26.3001C22.1 27.9001 23.5 29.2001 25.2 30.0001C25.7 30.2001 26.1 30.4001 26.6 30.5001C27.1 30.7001 27.6 30.7001 28.2 30.6001C28.9 30.5001 29.5 30.0001 29.9 29.4001C30.1 29.0001 30.1 28.6001 30 28.2001L29.6 28.0001ZM32.1 18.9001C28.2 15.0001 21.9 15.0001 18 18.9001C14.8 22.1001 14.2 27.0001 16.4 30.9001L15 36.0001L20.3 34.6001C21.8 35.4001 23.4 35.8001 25 35.8001C30.5 35.8001 34.9 31.4001 34.9 25.9001C35 23.3001 33.9 20.8001 32.1 18.9001ZM29.4 32.9001C28.1 33.7001 26.6 34.2001 25 34.2001C23.5 34.2001 22.1 33.8001 20.8 33.1001L20.5 32.9001L17.4 33.7001L18.2 30.7001L18 30.4001C15.6 26.4001 16.8 21.4001 20.7 18.9001C24.6 16.4001 29.6 17.7001 32 21.5001C34.4 25.4001 33.3 30.5001 29.4 32.9001Z" fill="#063E50" />
                    </svg>
                    <span className="text-[#063E50] font-normal">Connect on WhatsApp</span>
                </a>
            </div>

            <div className="flex items-center justify-between mb-4 pb-2">
                {/* Connect on Email */}
                <a href="mailto:support@apexin.in" className="flex gap-3 items-center">
                    <svg className=' w-14' viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25.5" cy="25.5" r="25.5" fill="#638692" fillOpacity="0.13" />
                        <path d="M36 19C36 17.9 35.1 17 34 17H18C16.9 17 16 17.9 16 19V31C16 32.1 16.9 33 18 33H34C35.1 33 36 32.1 36 31V19ZM34 19L26 24L18 19H34ZM34 31H18V21L26 26L34 21V31Z" fill="#063E50" />
                    </svg>
                    <span className="text-[#063E50] font-normal">Connect on Email</span>
                </a>
            </div>
        </div>
    );
};

export default Support;

import React from 'react'

const NewsLetter = () => {
  return (
    <div>
         <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className=" py-16 md:pl-20 md:w-full  md:mx-auto p-4 flex flex-col md:flex-row items-center justify-between text-left bg-gradient-to-b from-[#4C0083] to-[#180047]  md:p-10 text-white">
                <div>
                    
                    <h1 className="text-4xl md:text-[46px] max-md:mt-3 text-balance md:leading-[60px] max-w-md font-semibold bg-gradient-to-r from-white to-[#CAABFF] text-transparent bg-clip-text">
                        Join our newsletter & Stay Updated
                    </h1>
                </div>
                <div className="flex items-center gap-2 bg-violet-900 max-md:mt-6 pl-4 h-11 text-sm rounded-full overflow-hidden">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 5.25L9.75675 9.54525C9.52792 9.67816 9.268 9.74817 9.00337 9.74817C8.73875 9.74817 8.47883 9.67816 8.25 9.54525L1.5 5.25" stroke="#CAD5E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 3H3C2.17157 3 1.5 3.67157 1.5 4.5V13.5C1.5 14.3284 2.17157 15 3 15H15C15.8284 15 16.5 14.3284 16.5 13.5V4.5C16.5 3.67157 15.8284 3 15 3Z" stroke="#CAD5E2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input type="text" placeholder="Enter your email..." className="outline-none h-11 bg-transparent" />
                    <button className="px-6 h-10 mr-1 rounded-full border border-violet-600 bg-violet-800">Subscribe</button>
                </div>
            </div>
    </div>
  )
}

export default NewsLetter
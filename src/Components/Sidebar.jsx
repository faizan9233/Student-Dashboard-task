'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { HiMenuAlt1, HiX } from 'react-icons/hi';
import { PiStudentFill } from "react-icons/pi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed h-full top-0 left-0 bg-gray-800 text-white ${isOpen ? 'w-56' : 'w-14'} transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center p-4">
        <div onClick={toggleSidebar} className="cursor-pointer">
          {isOpen ? <HiX className="text-2xl" /> : <HiMenuAlt1 className="text-2xl" />}
        </div>
        {isOpen && <Link href={'/'} className="text-xl font-bold">Dashboard</Link>}
      </div>
      <ul className="text-sm">
        <li className={`p-3 bg-gray-700`}>
          <Link href="/">
            {
                isOpen ?  <p className="block">Students</p> : <PiStudentFill size={30} className='text-white'/>
            }
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

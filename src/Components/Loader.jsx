import React from 'react';
import spinner from '../Assets/spinner.svg';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center  bg-opacity-75 z-50'>
      <Image src={spinner} alt="Loading..."  className='w-[100px]'/>
    </div>
  );
};

export default Loader;

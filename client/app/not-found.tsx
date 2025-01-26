import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen px-4'>
      <h1 className='mt-2 text-center text-lg md:text-xl lg:text-2xl'>Oops, something went wrong...</h1>
      <h1 className='mt-1 text-center text-sm md:text-base lg:text-lg'>Are you sure you&#39;re on the correct path?</h1>
      <Link className='mt-4 rounded-lg bg-slate-800 hover:bg-slate-600 text-slate-400 px-4 py-2 text-lg md:text-xl' href="/">
        Return Home Page
      </Link>
    </div>
  );
}

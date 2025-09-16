import React from 'react';
import { Button } from '../button';
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col justify-center items-center px-4">
      <h1 className="font-extrabold text-[50px] text-center leading-tight py-4">
        AI <span className="text-blue-600">That Plans,</span> <br />
        <span className="text-gray-700">You Just Explore.</span>
      </h1>

      <p className="text-xl text-gray-600 text-center p-5">
        Say goodbye to travel stress — get personalized itineraries in seconds.
      </p>

      <Link to="/create-trip">
        <Button>Get Started, It’s Free</Button>
      </Link>

      <video
  src="Trip_Video.mp4"
  autoPlay
  muted
  loop
  playsInline
  className="max-w-full h-auto rounded-lg shadow-md mt-8"
/>

   <p className='text-center text-gray-400 mt-4 font-bold '>A Product by team Ghummakad</p> </div>
  );
}

export default Hero;

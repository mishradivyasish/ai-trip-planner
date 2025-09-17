import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FaShareAlt } from "react-icons/fa";
import { GetPlaceDetails, getPhotoUrl } from '../../../service/GlobalApi';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from 'react-router-dom';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/travelImage.jpg'); 
  const [reload, setReload] = useState(true); 
  const [copied, setCopied] = useState(false); // state for copy feedback

  useEffect(() => {
    if (trip?.userSelection?.location) {
      GetPlacePhoto();
    }
  }, [trip]);

  useEffect(() => {
    if (trip?.userSelection?.location && reload) {
      GetPlacePhoto();
      setReload(false); 
    }
  }, [trip, reload]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location,
    };
    try {
      const resp = await GetPlaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = getPhotoUrl(photoName);
        setPhotoUrl(url); 
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // 👉 Copy current page URL (you can switch to photoUrl if you prefer)
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div>
      {/* Image with click-to-copy */}
      <div className="relative">
        <img
          src={photoUrl}
          alt={trip?.userSelection?.location || "Travel destination"}
          className="h-[300px] w-full object-cover rounded-xl cursor-pointer"
          onClick={handleCopyAddress}
        />
        {copied && (
          <span className="absolute bottom-3 right-3 bg-black text-white text-xs px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </div>

      {/* Info section */}
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{trip?.userSelection?.location}</h2>
          <div className="flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.noOfDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💸 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🧍🏻 No of travelers: {trip?.userSelection?.noOfPeople} People
            </h2>
          </div>
        </div>

        {/* Share button with Popover */}
        <div className='flex justify-center'>
          <Popover>
            <PopoverTrigger>
              <Button><FaShareAlt /></Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='flex flex-col gap-3'>
               
                <Button onClick={handleCopyAddress} variant="outline">
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

               
                <div className='flex gap-2'>
                  <Link target='_blank' to='https://www.whatsapp.com/'>
                  <img className='h-10 w-10' src='/image1.png' alt="icon" /></Link>
                  <Link target='_blank' to='https://www.instagram.com/'>
                    <img className='h-10 w-10' src='/image.png' alt="Instagram" />
                  </Link>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;

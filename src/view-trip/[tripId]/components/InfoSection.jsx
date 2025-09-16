import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FaShareAlt } from "react-icons/fa";
import { GetPlaceDetails } from '../../../service/GlobalApi';
import { getPhotoUrl } from '../../../service/GlobalApi';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/travelImage.jpg'); 
  const [reload, setReload] = useState(true); // reload flag

  useEffect(() => {
    if (trip?.userSelection?.location) {
      GetPlacePhoto();
    }
  }, [trip]);

  useEffect(() => {
    if (trip?.userSelection?.location && reload) {
      GetPlacePhoto();
      setReload(false); // only run once after first load
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

  return (
    <div>
      <img
        src={photoUrl}
        alt={trip?.userSelection?.location || "Travel destination"}
        className="h-[300px] w-full object-cover rounded-xl"
      />

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
        <Button onClick={GetPlacePhoto}><FaShareAlt /></Button>
      </div>
    </div>
  );
}

export default InfoSection;

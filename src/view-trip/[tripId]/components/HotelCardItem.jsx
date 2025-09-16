import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotoUrl, GetPlaceDetails } from '@/service/GlobalApi';

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/travelImage.jpg'); 

  useEffect(() => {
    if (hotel?.hotelName) {
      GetPlacePhoto();
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel.hotelName
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
      <Link 
        to={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotelName + ' ' + hotel?.address} 
        target="_blank"
      >
        <div className="hover:scale-105 transition-all hover:shadow-2xl hover:rounded-lg cursor-pointer">
          <img src={photoUrl} alt={hotel.hotelName} className="rounded-xl h-[200px] w-full object-cover" />
          <div className="my-2 flex flex-col">
            <h2 className="font-medium">{hotel.hotelName}</h2>
            <h2 className="text-xs text-gray-500">📍 {hotel.address}</h2>
            <h2 className="text-sm">💰 {hotel.price}</h2>
            <h2 className="text-sm">★ {hotel?.ratings} stars</h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;

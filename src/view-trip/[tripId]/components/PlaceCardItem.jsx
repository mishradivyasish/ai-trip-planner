import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, getPhotoUrl } from '@/service/GlobalApi';

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/travelImage.jpg'); // fallback image

  useEffect(() => {
    if (place?.placeName) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = { textQuery: place.placeName };
    try {
      const resp = await GetPlaceDetails(data);
      const photoName = resp.data.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const url = getPhotoUrl(photoName);
        setPhotoUrl(url);
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-150 bg-white">
      {/* Header with Day & Time */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-md">Day {place?.day}</h2>
        <p className="text-sm text-orange-500">🕒 {place?.timeToVisit}</p>
      </div>

      {/* Place Name */}
      <h2 className="font-bold text-md mb-2">{place?.placeName}</h2>

      {/* Flex: Image + Details */}
      <div className="flex gap-4">
        {/* Image */}
        <img
          className="w-full h-[120px] rounded-lg object-cover"
          src={photoUrl}
          alt={place?.placeName || "Place"}
        />

        {/* Details */}
        <div className="flex flex-col justify-between">
          <p className="text-sm text-gray-500">{place?.details}</p>
          <p className="text-sm">⭐ {place?.ratings || "N/A"}</p>
          <p className="text-sm text-gray-600">
            🎟 {place?.ticketPrice || "Free / N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;

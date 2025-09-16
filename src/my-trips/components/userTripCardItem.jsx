// 👇 Fixed casing in import path
import { GetPlaceDetails, getPhotoUrl } from '@/service/GlobalApi';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/trip_placeholder.jpeg');
  const [isLoading, setIsLoading] = useState(true);

  // 👉 Fallback: try travelPlan.location first, then userSelection.location
  const location =
    trip?.tripData?.travelPlan?.location || trip?.userSelection?.location;

  const GetPlacePhoto = useCallback(async () => {
    if (!location) {
      setPhotoUrl('/travelImage.jpg');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        textQuery: location,
        maxResultCount: 1,
      };

      const result = await GetPlaceDetails(data);

      if (result?.data?.places?.[0]?.photos?.length > 0) {
        const firstPhoto = result.data.places[0].photos[0];
        const PhotoUrl = getPhotoUrl(firstPhoto.name);
        setPhotoUrl(PhotoUrl);
      } else {
        setPhotoUrl('/travelImage.jpg'); // fallback if no photos
      }
    } catch (error) {
      console.error('Error fetching place photo:', error);
      setPhotoUrl('/trip_placeholder.jpeg'); // fallback if API fails
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  useEffect(() => {
    GetPlacePhoto();
  }, [GetPlacePhoto]);

  if (!trip) {
    return (
      <div className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
    );
  }

  return (
    <Link to={`/my-trips/${trip.id}`}>
      <div className="hover:scale-105 transition-all">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          <img
            src={photoUrl}
            className="object-cover rounded-xl hover:shadow-xl h-[220px] w-full"
            alt={location || 'Trip destination'}
            onError={(e) => {
              e.currentTarget.src = '/trip_placeholder.jpeg';
              setIsLoading(false);
            }}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div>
          <h2 className="font-bold sm:text-lg text-base text-black">
            {location}
          </h2>
          <h2 className="sm:text-sm text-xs text-gray-600">
            {trip?.tripData?.travelPlan?.numberOfDays ||
              trip?.tripData?.travelPlan?.duration ||
              trip?.userSelection?.noOfDays}{' '}
            Days trip with{' '}
            {trip?.tripData?.travelPlan?.budget || trip?.userSelection?.budget}{' '}
            Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

// ✅ Fixed PropTypes to cover both travelPlan & userSelection
UserTripCardItem.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tripData: PropTypes.shape({
      travelPlan: PropTypes.shape({
        location: PropTypes.string,
        numberOfDays: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        budget: PropTypes.string,
      }),
    }),
    userSelection: PropTypes.shape({
      location: PropTypes.string,
      noOfDays: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      budget: PropTypes.string,
    }),
  }).isRequired,
};

export default UserTripCardItem;

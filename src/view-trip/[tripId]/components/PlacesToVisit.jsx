import React from 'react'
import PlaceCardItem from './PlaceCardItem'
import { Link } from 'react-router-dom';

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className='font-bold text-lg'>Places to Visit</h2>
      <div className='mt-5 grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mr-2'>
        {trip?.tripData?.travelPlan?.itinerary?.map((item, index) => (
                  <Link to={'https://www.google.com/maps/search/?api=1&query='+item?.placeName+item?.userSelection?.location} target='blank'>

          <PlaceCardItem key={index} place={item} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit

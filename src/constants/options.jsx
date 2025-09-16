import { User, Heart, Users, Group } from "lucide-react";

export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A solo traveler in exploration",
    people: "1",
    icon: User, // 👤 single traveler
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    people: "2",
    icon: Heart, // ❤️ couple
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of loved ones traveling together",
    people: "3-5",
    icon: Users, // 👨‍👩‍👧 family
  },
  {
    id: 4,
    title: "Friends",
    desc: "An adventurous squad on the go",
    people: "3+",
    icon: Group, // 👥 friends
  },
];
import { PiggyBank, Wallet, Gem } from "lucide-react";

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Budget-friendly trips with minimal costs",
    icon: PiggyBank, // 🐷 piggy bank icon
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balanced travel with comfort and value",
    icon: Wallet, // 💳 wallet icon
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Premium experiences with top-notch comfort",
    icon: Gem, // 💎 diamond icon
  },
];

export const AI_PROMPT = `Generate a travel plan for location: {location} for {totalDays} days for {traveler} people with a {budget} budget.

Provide the response in JSON format with the following structure:

1. Hotel Options: Include HotelName, Address, Price, hotel image url (use real hotel booking site URLs like booking.com, hotels.com, or actual hotel website image URLs - NOT placeholder URLs), geo coordinates, ratings, descriptions.

2. Itinerary: Include place names to visit, time to visit, ticket prices, details, image url (use real image URLs from tourism websites, Wikipedia, or official attraction websites - NOT placeholder URLs like www.example.com), geo coordinates, ratings.

Important: For image URLs, provide actual working URLs from:
- For hotels: Use URLs from booking.com, hotels.com, marriott.com, hilton.com, etc.
- For attractions: Use URLs from official tourism sites, Wikipedia, TripAdvisor, or attraction official websites
- If you cannot find a real URL, use: "https://via.placeholder.com/400x300?text=Image+Not+Available"

Ensure all URLs are complete and functional. Do not use example.com or placeholder domains.

Return the response in this exact JSON format:
{
  "travelPlan": {
    "location": "{location}",
    "duration": "{totalDays} days",
    "budget": "{budget}",
    "travelers": "{travelers}",
    "hotelOptions": [
      {
        "hotelName": "Hotel Name",
        "address": "Complete Address",
        "price": "$X per night",
        "imageURL": "Real working image URL",
        "geoCoordinates": {
          "latitude": 0.0,
          "longitude": 0.0
        },
        "ratings": 4.5,
        "description": "Hotel description"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "placeName": "Attraction Name",
        "details": "Detailed description",
        "timeToVisit": "Best time to visit",
        "ticketPrice": "Entry fee or Free",
        "imageURL": "Real working image URL",
        "geoCoordinates": {
          "latitude": 0.0,
          "longitude": 0.0
        },
        "ratings": 4.8
      }
    ]
  }
}`;
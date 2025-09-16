import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from '../components/ui/input';
import React, { useEffect, useState } from 'react';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { doc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { setDoc } from 'firebase/firestore';
import { useNavigate, useNavigation } from 'react-router-dom';
function Createtrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    noOfDays: '',
    budget: '',
    noOfPeople: '' // store as string, coerce when validating
  });
  const [openDialog, setOpenDailog] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navigate=useNavigate();
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log('formData:', formData);
  }, [formData]);
  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: 'Applcation/json'
        }
      }).then((resp) => {
        console.log(resp);
        localStorage.setItem('user', JSON.stringify(resp.data));
        setOpenDailog(false);
        onGenerateTrip();
      })
  }
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const saveAiTrip = async (TripData) => {
    setLoading(true);
    // Add a new document in collection "cities"
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString()
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  }
  // Coerce to numbers where needed
  const days = Number(formData.noOfDays);
  const people = Number(formData.noOfPeople);

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      setOpenDailog(true)
      return;

    }

    // Basic completeness checks
    if (
      !formData.location?.trim() ||
      !formData.budget ||
      !formData.noOfDays ||
      !formData.noOfPeople
    ) {
      toast('Please fill all the fields');
      return;
    }

    // Numeric validation
    if (!Number.isFinite(days) || days <= 0) {
      toast('Please enter a valid number of days');
      return;
    }
    if (days > 30) {
      toast('Number of days should be less than or equal to 30');
      return;
    }
    setLoading(true);
    // Build the prompt with correct placeholders/keys
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData.location)
      .replace('{totalDays}', String(days))
      .replace('{travelers}', String(people))
      .replace('{budget}', formData.budget);

    console.log('FINAL_PROMPT:', FINAL_PROMPT);


    const result = await chatSession.sendMessage(FINAL_PROMPT);

    // Some SDKs expose .text(), some expose .text
    console.log("--", result?.response?.text());
    setLoading(false);
    saveAiTrip(result?.response?.text());
    
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Hello Ghummakad! Where do you want to travel next ?🏕️🌴
      </h2>
      <p className="mt-3 text-gray- text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preference
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What do you think where should we plan our next trip ?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              placeholder: 'Search for a destination...',
              value: place,
              onChange: (p) => {
                setPlace(p);
                handleInputChange('location', p?.label || '');
              }
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you going to stay</h2>
          <Input
            placeholder="0"
            type="number"
            value={formData.noOfDays}
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl my-3 font-medium">What is your budget ?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-2xl flex flex-col items-center text-center ${formData.budget === item.title && 'shadow-lg border-black'
                }`}
            >
              <item.icon className="w-10 h-10 text-blue-600 mb-2" />
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>

        <h2 className="text-xl my-3 font-medium">
          Who do you plan on travelling with on your next adventure
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("noOfPeople", item.people.toString())}

              className={`p-4 border rounded-lg cursor-pointer hover:shadow-2xl flex flex-col items-center text-center ${formData.noOfPeople === String(item.people) ? "shadow-lg border-black" : ""
                }`}

            >
              <item.icon className="w-10 h-10 text-blue-600 mb-2" />
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-5 justify-end flex">
        <Button
          disabled={loading}
          onClick={onGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='h-8 w-8 animate-spin' />
            : 'Generate Trip'}
        </Button>
      </div>
      <Dialog open={openDialog}>

        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className='flex '><img src='/logo.svg' alt='Logo' /><span className='mt-5 text-bold text-2xl'><p className='text-red-400'>h<span className='text-yellow-400'>u</span><span className='text-green-500'>m</span><span className='text-blue-500'>m</span><span className='text-red-500'>a</span><span className='text-yellow-400'>k</span><span className='text-green-400'>a</span><span className='text-blue-'>d</span></p>
      </span></div>
              <h2 className='font-bold text-lg text-center mt-7'>Sign In With Google</h2>
              <p className='text-center'>Sign in to the App with Google authentication securely</p>
              <Button disabled={loading} onClick={login} className='w-full mt-5 flex gap-4 items-center'>
                <FcGoogle className='h7 w-7' />
                Sign in with google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Createtrip;

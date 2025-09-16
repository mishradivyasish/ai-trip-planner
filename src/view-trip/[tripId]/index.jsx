import { View } from 'lucide-react'
import React, { useEffect ,useState} from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import Hotels from './components/Hotels';
import PlacesToVisit from './components/PlacesToVisit';
import Footer from './components/Footer';
function ViewTrip() {
    const {tripId}=useParams();
    const[trip,setTrip]=useState(null);
    //instructions from firebase given in firebase website
   useEffect(()=>{
    tripId&&GetTripData();
   },[tripId])
    const GetTripData=async()=>{
        console.log("fetching trip id",tripId);
        const docRef=doc(db,"AiTrips",tripId);
        const docSnap=await getDoc(docRef);
        if(docSnap.exists()){
             console.log("Document:",docSnap.data());
             setTrip(docSnap.data());
        }
        else{
            console.log("No such document is found");
            toast("No trip Found")
        }

    }
    
  return (
    <div className='p-10 md-px-20 lg:px-44 xl:px-56'>
      {/*Information Section*/}
      <InfoSection trip={trip}/>
      {/* {Hotel details} */}
      <Hotels trip={trip}/>
      {/* Dialy trip plan day wise */}
      <PlacesToVisit trip={trip}/>
      {/* Footer section */}
      <div className='mt-20'>
      <Footer/>
      </div>
    </div>
  )
}

export default ViewTrip

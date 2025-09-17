import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { Link } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { googleLogout, useGoogleLogin } from '@react-oauth/google';

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Log user data on mount
  useEffect(() => {
    console.log(user);
  }, [user]);

  // Google login
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => fetchUserProfile(tokenResponse),
    onError: (error) => console.error(error),
  });

  // Fetch user profile from Google
  const fetchUserProfile = async (tokenInfo) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: 'application/json',
          },
        }
      );

      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    setUser(null);
    window.location.href='/';
    
  };

  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <div className='flex '><img src='/logo.svg' alt='Logo' /><span className='mt-5 text-bold text-2xl'><p className='text-red-400'>h<span className='text-yellow-400'>u</span><span className='text-green-500'>m</span><span className='text-blue-500'>m</span><span className='text-red-500'>a</span><span className='text-yellow-400'>k</span><span className='text-'>a</span>d</p>
      </span></div>

      <div>
        {user ? (
          <div className='flex items-center gap-5'>
          <a href='/my-trips'>
            <Button variant="outline" className='rounded-full'>
              My Trip
            </Button></a>
          <a href='/create-trip'>
            <Button variant="outline" className='rounded-full'>+Create Trip</Button>
          </a>
            <Popover>
              <PopoverTrigger>
              
                <img
                  src={user.picture}
                  referrerPolicy="no-referrer"
                  className='h-[35px] w-[35px] rounded-full'
                  alt='User'
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className='cursor-pointer'
                  onClick={handleLogout}
                >
                  Log Out
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className='text-center'>
             <div className='flex'> <img src='/logo.svg' alt='Logo' /><p className='mt-5 text-2xl text-red-500'><span className='mt-5 text-bold text-2xl'>h</span><span className='text-yellow-400'>u</span><span className='text-green-500'>m</span><span className='text-blue-500'>m</span><span className='text-red-500'>a</span><span className='text-yellow-400'>k</span><span className='text-green-400'>a</span><span className='text-blue-'>d</span></p></div>
              <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>

              <Button
                disabled={loading}
                onClick={login}
                className='w-full mt-5 flex gap-4 items-center justify-center'
              >
                <FcGoogle className='h-7 w-7' />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;

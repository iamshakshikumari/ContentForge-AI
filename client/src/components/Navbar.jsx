import { assets } from '@/assets/assets'
import { authState } from '@/state/authState';
import axios from 'axios';
import { ArrowRight, LogOut } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useRecoilState(authState);
  const { isLoggedIn, username, loading } = auth;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth/check-auth", { withCredentials: true });
        setAuth({
          isLoggedIn: response.data.loggedIn,
          username: response.data.username || "",
          userId: response.data.userId,
          loading: false
        })
      } catch (error) {
        setAuth({
          isLoggedIn: false,
          username: "",
          loading: false
        })
      }
    }
    checkAuth();
  }, [setAuth]);

  if (loading) return <p className='flex justify-center items-center'>Loading...</p>;

  function handleGetStarted() {
    if (isLoggedIn) navigate("/ai");
    else navigate("/login");
  }

  const handleLogout = async () => {
    try {
      await axios.post(`/api/auth/logout`, {}, { withCredentials: true });
      setAuth({
        isLoggedIn: false,
        username: "",
        loading: false
      })
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className='fixed z-5 w-full h-20 backdrop-blur-2xl bg-[#1b1b1bff] border-b border-gray-700 flex justify-around items-center py-8 px-4 shadow-[0_4px_6px_rgba(255,255,255,0.09)]'>
      <img src={assets.mylogo} alt='logo' className='h-16 w-auto cursor-pointer' onClick={() => navigate("/")} />

      {isLoggedIn ? <div onClick={handleLogout} className="flex px-8 py-2 gap-3 cursor-pointer">
        <div><FaUserCircle className=" w-8 h-8 rounded-full" /></div>
        <div className=" w-full flex gap-3 justify-center items-center">
          <h1>{username}</h1>
          <LogOut className="w-5 h-5" />
        </div>
      </div>
        : <button className='flex items-center gap-2 rounded-full text-sm cursor-pointer text-white px-10 py-2.5 bg-gradient-to-r from-purple-500 to-purple-900' onClick={handleGetStarted}>Get Started <ArrowRight className='w-4 h-4' /> </button>
      }

    </div>
  )
}

export default Navbar

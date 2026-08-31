import React, { useState } from 'react'
import { HiOutlineMail } from "react-icons/hi";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { LuEyeClosed } from "react-icons/lu";
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL ;

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate() ;

    const handleSignup = async (e) => {
        {
            e.preventDefault();

            if (confirmPassword !== password) return toast.error('confirm password does not match');

            try {
                const response = await axios.post("/api/auth/signup", {
                    full_name: fullName,
                    email,
                    password
                }, { withCredentials: true }
                )

                console.log("Signup successful:", response.data);
                toast.success(response.data.message);
                navigate("/login") ;
                
            } catch (error) {
                const message =
                    error.response?.data?.message || 
                    error.response?.data?.error ||  
                    error.message;                  

                toast.error(message); 
                console.error("Signup error:", message);
            }
        };
    }

    return (
        <div className='flex items-center justify-center min-h-screen w-screen pt-20'>
            <div className='flex flex-col border-2 max-w-md w-full items-center justify-center border-gray-800 rounded-lg p-6 shadow-[0_0_20px_rgba(168,85,247,0.4)]'>
                <div >
                    <h1 className='font-semibold text-3xl mb-6 mt-4'>Create Your Account</h1>

                    <button className='flex border-2 border-gray-600 px-4 py-1 mb-6 items-center justify-center rounded-md w-full h-10' >
                        <img src='https://www.svgrepo.com/show/355037/google.svg' alt='Google'
                            className='w-6 h-6 mt-1 ml-3' />
                        <span className='p-1 px-3 text-l '>Continue with Google</span>
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full mb-8 ">
                    <div className="flex-1 border-t border-gray-600"></div>
                    <span className="text-gray-500 text-sm">or sign up with email</span>
                    <div className="flex-1 border-t border-gray-600"></div>
                </div>

                <div className='max-w-md w-full flex flex-col items-center'>
                    <div className='max-w-xs w-full mb-6'>
                        <div className='flex items-center border border-gray-600 rounded-sm'>
                            <CiUser className='ml-4 text-gray-400 h-6 w-6' />
                            <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" className='h-8 w-full ml-8 text-gray-300 focus:outline-none' placeholder='Enter your full name' />
                        </div>
                    </div>

                    <div className='max-w-xs w-full mb-6'>
                        <div className='flex items-center border border-gray-600 rounded-sm'>
                            <HiOutlineMail className='ml-4 text-gray-500 h-6 w-6' />
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='h-8 w-full ml-8 text-gray-300 focus:outline-none' placeholder='Enter your Email' />
                        </div>
                    </div>

                    <div className='max-w-xs w-full mb-6'>
                        <div className='flex items-center border border-gray-600 rounded-sm'>
                            <CiLock className='ml-4 text-gray-400 h-6 w-6' />
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='h-8 w-full ml-8 text-gray-300 focus:outline-none' placeholder='Enter your Password' />
                        </div>
                    </div>

                    <div className='max-w-xs w-full mb-6'>
                        <div className='flex items-center border border-gray-600 rounded-sm'>
                            <LuEyeClosed className='ml-4 text-gray-500 h-6 w-6' />
                            <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className='h-8 w-full ml-8 text-gray-300 focus:outline-none' placeholder='Confirm your password' />
                        </div>
                    </div>

                </div>

                <div className='max-w-md w-full flex justify-center mt-4'>
                    <button onClick={handleSignup} className='border border-gray-500 rounded-full w-48 h-8 bg-gradient-to-r from-purple-500 to-purple-900 px-5  cursor-pointer text-center'>Sign Up</button>
                </div>

                <div className='flex max-w-md w-xs justify-center mt-6 mb-4'>
                    <div className='text-gray-400 text-xs'>
                        Already have an account? <span className='ml-1 text-blue-400 hover:underline'><Link to="/login">log in</Link></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
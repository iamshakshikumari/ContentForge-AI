import axios from 'axios';
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/auth/check-auth", { withCredentials: true })
            .then(res => {
                setIsLoggedIn(res.data.loggedIn);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    function handleStartNow() {
        if (isLoggedIn) navigate("/ai");
        else navigate("/login");
    }

    return (
        <div className='px-4 pt-60 flex flex-col w-full justify-center'>

            <div className='text-center mb-6'>
                <h1 className='text-7xl font-semibold mx-auto leading-[1.2] '>Turn creativity into reality <br /> with <span className='text-primary'> AI tools</span></h1>
                <p className='mt-4 max-w-xl m-auto text-gray-500'>Revolutionize your content workflow with our all-in-one AI platform—create articles, generate visuals, and streamline your productivity.</p>
            </div>

            <div className='flex justify-center gap-4'>
                <button onClick={handleStartNow} className='flex items-center bg-gradient-to-r from-purple-500 to-purple-900 px-5 py-2.5 rounded-lg cursor-pointer'>Start creating now<ArrowRight className='w-4 h-4 ml-2' /></button>

                <button className='flex items-center bg-gradient-to-r from-purple-500 to-purple-900 px-5 py-2.5 rounded-lg cursor-pointer'>watch demo <ArrowRight className='w-4 h-4 ml-2' /></button>
            </div>

        </div>
    )
}

export default Hero

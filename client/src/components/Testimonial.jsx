import { dummyTestimonialData } from '@/assets/assets'
import React from 'react'
import { RiStarSLine, RiStarSFill } from "react-icons/ri";


const Testimonial = () => {
    return (
        <div className='pt-30 flex flex-col px-4 flex flex-col w-full justify-center'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-slate-300'>Trusted by <span className='bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500 text-transparent bg-clip-text'>Thousands of Creators</span></h1>
                <p className='mt-3 m-auto text-gray-500'>Inspiration from those shaping the future of content.</p>
            </div>

            <div className='flex flex-wrap justify-content m-12 items-center justify-center'>
                <div className='flex flex-wrap justify-center gap-4'>
                    {dummyTestimonialData.map((review, index) => {
                        return (
                            <div key={index} className='p-6 pt-2 m-4 max-w-xs rounded-2xl border border-gray-700 cursor-pointer hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transition-all ease-in-out duration-200'
                                onClick={() => navigate(review.path)}>
                                <div className='flex pt-3'>
                                    {[1, 2, 3, 4, 5].map((num) =>
                                        num <= review.rating ? (
                                            <RiStarSFill key={num} className="text-yellow-400 text-xl" />
                                        ) : (
                                            <RiStarSLine key={num} className="text-yellow-300 text-xl" />
                                        )
                                    )}
                                </div>

                                <div className='mt-2 text-[#EEEEEE] italic'>{review.content}</div>

                                {/* for underline */}
                                <div className='mt-4'>
                                    <div className='flex-1 border-t text-gray-500'></div>
                                </div>

                                <div className='flex gap-4'>
                                    <div className=' mt-4'>
                                        <img src={review.image} className='h-12 w-12 rounded-full' />
                                    </div>

                                    <div className='mt-4 flex flex-col'>
                                        <div className='text-md'>{review.name}</div>
                                        <div>
                                            <p className='text-xs text-gray-400'>{review.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Testimonial

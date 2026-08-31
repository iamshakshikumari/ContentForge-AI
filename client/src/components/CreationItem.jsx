import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const deleteCreation = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/delete-item",
        { id },
        { withCredentials: true }
      );

      if (data.success) {
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div onClick={() => setExpanded(!expanded)} className='p-4 max-w-5xl text-md border-1 border-gray-400  rounded-xl cursor-pointer 
      bg-gradient-to-r from-[#1F1C2C] to-[#928DAB] text-white'>
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h1 className='font-semibold text-lg '>{item.prompt}</h1>
          <p className='font-semibold '>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <div>
          <button className='border mr-2  font-medium px-4  py-1 rounded-2xl cursor-pointer'>{item.type}</button>
          <button className='border  font-medium px-4  py-1 rounded-2xl cursor-pointer' onClick={() => deleteCreation(item.id)}>Delete</button>
        </div>
      </div>

      {expanded && (
        <div className=''>
          {item.type === 'image' ? (
            <div className='mt-3 overflow-y-scroll max-h-[500px]'>
              <img src={item.content} alt='Image' className='mt-3 w-full h-full max-w-md' />
            </div>
          ) : (
            <div className='mt-3 overflow-y-scroll text-sm h-48 text-[#FFE797]'>
              <div className='reset-tw font-medium '>
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem

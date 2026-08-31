import { AiToolsData } from '@/assets/assets'
import { authState } from '@/state/authState';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil';

const AiTools = () => {
  const navigate = useNavigate() ;
  const auth = useRecoilValue(authState) ;
  const {isLoggedIn, username, loading} = auth ;

  return (

    <div className='pt-30 flex flex-col px-4 flex flex-col w-full justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>Ultimate AI Toolkit</h1>
        <p className='mt-3 m-auto text-gray-500'>Craft smarter, better, and faster content with AI.</p>
      </div>
 
      <div className='flex flex-wrap justify-center m-12 items-center'>
        <div className='flex flex-wrap justify-center gap-4'>
          {AiToolsData.map((tool, index) => {
          return (
            <div key={index} className='p-6 m-4 max-w-xs rounded-2xl border border-gray-700 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:scale-101 transition-all duration-200'
            onClick={()=>isLoggedIn ? navigate(tool.path) : navigate("/login")}>
              <tool.Icon className='w-12 h-12 p-3 text-white rounded-md' style={{background:`linear-gradient(to bottom, ${tool.bg.from},${tool.bg.to})`}} />

              <div className='pt-6 font-semibold text-xl '>{tool.title}</div>

              <div className='mt-4 text-gray-400'>{tool.description}</div>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}

export default AiTools

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { RecoilRoot } from 'recoil';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className=' bg-[#171616] min-h-screen text-white'>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </div>
  </BrowserRouter>
)

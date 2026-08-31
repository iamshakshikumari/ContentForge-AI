import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const AppLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default AppLayout

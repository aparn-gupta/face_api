import React from 'react'
import { useLocation } from 'react-router-dom'

function Dashboard () {

    const location  = useLocation()

    const userData = location.state





    return (
        <div>
            <h1 className="text-4xl p-4 bg-teal-200">Dashboard</h1>
            <div className='h-screen bg-pink-100 mt-4'>
               <h1> {userData.username}</h1>

            </div>
        </div>
    )
}

export default Dashboard
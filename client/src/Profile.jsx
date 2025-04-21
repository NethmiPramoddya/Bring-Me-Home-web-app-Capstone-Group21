import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Profile() {
    const [user, setUser] = useState([]);
    const navigate = useNavigate()

    const userId = localStorage.getItem("userId")

    useEffect(()=>{
        axios.get(`http://localhost:3002/profile/${userId}`)
        .then(result=>{
            console.log(result.data);
            setUser(result.data)})
        .catch(err=>console.log(err))
    },[userId])

    
  const handleLogout = () => {
    localStorage.removeItem("userId"); // or other auth token
    navigate("/login"); // redirect to login
  };

    if (!user.name) {
        return <div>Loading...</div>; // Show loading message while data is being fetched
    }


  return (
    <div className="container p-6 mx-auto">
    {/* Profile Header */}
    <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome, {user.name}</h1>
        <p className="text-xl text-gray-500">{user.email}</p>
    </div>

    {/* Profile Details */}
    <div className="flex flex-col items-center justify-center space-x-8 md:flex-row">
        {/* Profile Picture */}
        <div className="w-40 h-40 mb-4 md:mb-0">
            {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="object-cover w-full h-full rounded-full" />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white bg-gray-300 rounded-full">
                    {user.name[0]}
                </div>
            )}
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-start space-y-4">
            <div>
                <h3 className="text-xl font-semibold text-gray-700">About Me</h3>
                <p className="text-gray-600">{user.about || 'No description provided'}</p>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-700">Contact Info</h3>
                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-600"><strong>Phone:</strong> {user.phone || 'Not available'}</p>
            </div> 

            <div>
                <h3 className="text-xl font-semibold text-gray-700">Other Info</h3>
                <p className="text-gray-600"><strong>Location:</strong> {user.location || 'Not specified'}</p>
            </div>
        </div>
    </div>

    {/* Profile Actions */}
    <div className="flex justify-center mt-8 space-x-4">
        <button className="px-6 py-2 text-white transition duration-200 bg-blue-500 rounded-lg hover:bg-blue-600">
            Edit Profile
        </button>
        <button onClick={handleLogout} className="px-6 py-2 text-white transition duration-200 bg-red-500 rounded-lg hover:bg-red-600">
            Logout
        </button>
    </div>
</div>
  )
}

export default Profile

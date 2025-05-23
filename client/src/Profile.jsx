import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function Profile() {
    const [user, setUser] = useState([]);
    const [wallet, setWallet] = useState(null);
    const navigate = useNavigate()

    const userId = localStorage.getItem("userId")

    useEffect(()=>{
        if (!userId) {
            navigate("/login"); // Redirect to login if userId is null
            return;
        }
        if(userId){
            axios.get(`http://localhost:3002/profile/${userId}`)
            .then(result=>{
                console.log(result.data);
                setUser(result.data)})
            .catch(err=>console.log(err))

            // Fetch wallet info
                axios.get(`http://localhost:3002/wallet/${userId}`)
                .then(res => {
                    setWallet(res.data);
                })
                .catch(err => {
                    console.log("Wallet not found or error fetching wallet:", err);
                    setWallet(null);
                });
        }
    },[userId, navigate])

    
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
    <div className="flex justify-center mt-8 mb-10 space-x-4">
        <button 
        onClick={() => navigate("/edit-profile")}
        className="px-6 py-2 text-white transition duration-200 bg-blue-500 rounded-lg hover:bg-blue-600">
            Edit Profile
        </button>
        <button onClick={handleLogout} className="px-6 py-2 text-white transition duration-200 bg-red-500 rounded-lg hover:bg-red-600">
            Logout
        </button>
    </div>

        {/* Wallet Info */}
{wallet && (
  <div className="max-w-md p-6 mx-auto mb-8 transition-shadow duration-300 ease-in-out transform bg-white shadow-lg cursor-pointer rounded-xl hover:shadow-2xl hover:-translate-y-1">
    <h2 className="mb-4 text-3xl font-extrabold text-center text-indigo-600">Wallet Details</h2>
    <div className="flex items-center justify-between space-x-6">
      <div className="flex items-center space-x-4">
        {/* Icon: wallet */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a4 4 0 00-8 0v2M3 13v2a4 4 0 004 4h10a4 4 0 004-4v-2M7 13h10" />
        </svg>
        <div>
          <p className="text-lg font-semibold text-gray-700">Actual Amount</p>
          <p className="text-2xl font-bold text-gray-900">${wallet.actual_amount?.toFixed(2) ?? "0.00"}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Icon: cash */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-lg font-semibold text-gray-700">Can Withdraw Amount</p>
          <p className="text-2xl font-bold text-gray-900">${wallet.can_withdrawal_amount?.toFixed(2) ?? "0.00"}</p>
        </div>
      </div>
    </div>
  </div>
)}


</div>
  )
}

export default Profile

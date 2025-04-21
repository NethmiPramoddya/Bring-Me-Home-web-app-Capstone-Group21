import React,{useEffect, useState} from 'react'
import axios from 'axios'

function MyTravelingData() {
     const [myTravelingData, setMyTravelingData] =useState([])
         const userId = localStorage.getItem("userId")
        
            useEffect(()=>{
                axios.get(`http://localhost:3002/travelingData/${userId}`)
                .then(result=>{
                    console.log(result.data);
                    setMyTravelingData(result.data)})
                .catch(err=>console.log(err))
            },[userId])
    
            const handleDelete = async (id) => {
                try {
                    await axios.delete(`http://localhost:3002/deleteSenderRequest/${id}`);
            
                    // Make a copy of the current list
                    const updatedList = myTravelingData.filter(request => {
                        return request._id !== id; // Keep only requests that are NOT the deleted one
                    });
            
                    // Update the state with the new list
                    setMyTravelingData(updatedList);
                } catch (err) {
                    console.log("Error deleting request:", err);
                }
            };
  return (
    <div className="p-4">
    <h2 className="mb-4 text-xl font-bold">My Traveling Data</h2>
    {myTravelingData.length === 0 ? (
        <p>No traveling data found.</p>
    ) : (
        <ul className="space-y-4">
            {myTravelingData.map((travelingdata, index) => (
                <li key={index} className="flex items-start justify-between p-4 border rounded shadow-sm">
                    <div>
                        <p><strong>From:</strong> {travelingdata.depature_country}</p>
                        <p><strong>To:</strong> {travelingdata.destination}</p>
                        <p><strong>Arrival Date:</strong> {new Date(travelingdata.arrival_date).toLocaleDateString()}</p>
                        <p><strong>Depature Date:</strong> {new Date(travelingdata.depature_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleDelete(travelingdata._id)}
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            🗑️Delete
                        </button>
                        <button
                            
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                            View More
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )}
</div>
  )
}

export default MyTravelingData
import React,{useEffect, useState} from 'react'
import axios from 'axios'

function MySenderRequests() {
    const [mySenderRequests, setMySenderRequests] =useState([])
     const userId = localStorage.getItem("userId")
    
        useEffect(()=>{
            axios.get(`http://localhost:3002/mySenderRequests/${userId}`)
            .then(result=>{
                console.log(result.data);
                setMySenderRequests(result.data)})
            .catch(err=>console.log(err))
        },[userId])

        const handleDelete = async (id) => {
            try {
                await axios.delete(`http://localhost:3002/deleteSenderRequest/${id}`);
        
                // Make a copy of the current list
                const updatedList = mySenderRequests.filter(request => {
                    return request._id !== id; // Keep only requests that are NOT the deleted one
                });
        
                // Update the state with the new list
                setMySenderRequests(updatedList);
            } catch (err) {
                console.log("Error deleting request:", err);
            }
        };
  return (
    <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">My Sender Requests</h2>
            {mySenderRequests.length === 0 ? (
                <p>No sender requests found.</p>
            ) : (
                <ul className="space-y-4">
                    {mySenderRequests.map((request, index) => (
                        <li key={index} className="flex items-start justify-between p-4 border rounded shadow-sm">
                            <div>
                                <p><strong>Item:</strong> {request.item}</p>
                                <p><strong>From:</strong> {request.fcountry}</p>
                                <p><strong>To:</strong> {request.dcountry}</p>
                                <p><strong>Delivery Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                                <p><strong>Recipient:</strong> {request.rname} ({request.remail})</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleDelete(request._id)}
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    Delete
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

export default MySenderRequests
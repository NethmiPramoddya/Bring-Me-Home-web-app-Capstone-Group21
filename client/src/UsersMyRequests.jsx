import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function UsersMyRequests() {
  const [requests,setRequests] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:3002")
    .then(result => setRequests(result.data))
    .catch(err => console.log(err))
  },[])

  const handleDelete = (id) =>{
    axios.delete('http://localhost:3002/deleteRequest/'+id)
    .then(res =>{ console.log(res)
      window.location.reload()
    })
    .catch(err => console.log(err))
  }

  // Function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-500";
      case "Accepted":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Requests</h1>
        <Link to="/create" className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-lg">
          <span className="text-lg">➕</span> Post New Request
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => (
          <div key={request.id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{request.item}</h2>
              <span className={`${getStatusColor(request.status)} font-medium`}>
                {request.status}
              </span>
            </div>
            <p className="text-gray-600">
              {request.fcountry} → {request.dcountry}
            </p>
            <p className="text-sm text-gray-500">Requested Date: {request.date}</p>
            <div className="flex gap-2 mt-4">
              <Link to={`/edit/${request._id}`} className="flex items-center gap-1 px-4 py-2 border rounded-lg">
                ✏️ Edit
              </Link>
              <button className="flex items-center gap-1 px-4 py-2 text-white bg-red-500 rounded-lg" onClick={(e)=>handleDelete(request._id)}>
                🗑️ Delete
              </button>
              <button className="flex items-center gap-1 px-4 py-2 text-white bg-black rounded-lg">
                ✈️ Track
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersMyRequests;

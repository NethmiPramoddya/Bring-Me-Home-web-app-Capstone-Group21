import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function UsersMyRequests() {
  const [requests, setRequests] = useState([]);
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      Navigate('/login');
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3002")
      .then(result => setRequests(result.data))
      .catch(err => console.log(err))
  }, []);

  // const handleDelete = (id) => {
  //   axios.delete('http://localhost:3002/deleteRequest/' + id)
  //     .then(res => {
  //       console.log(res);
  //       window.location.reload()
  //     })
  //     .catch(err => console.log(err))
  // }

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

  // Filtering logic
  const filteredRequests = requests.filter((request) => {
    const fromMatch = request.fcountry && request.fcountry.toLowerCase().includes(fromFilter.toLowerCase());
    const toMatch = request.dcountry && request.dcountry.toLowerCase().includes(toFilter.toLowerCase());
    return fromMatch && toMatch;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Senders Requests</h1>
        <Link to="/create" className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-lg">
          <span className="text-lg">➕</span> Post a New Request Here
        </Link>
      </div>

      {/* 🔍 Filter Inputs */}
      <div className="flex justify-end mb-6">
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <input
            type="text"
            placeholder="From Country"
            value={fromFilter}
            onChange={(e) => setFromFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="To Country"
            value={toFilter}
            onChange={(e) => setToFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredRequests.map((request) => (
          <div key={request.id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{request.item}</h2>
              <span className={`${getStatusColor(request.status)} font-medium`}>
                {request.status}
              </span>
            </div>
            <p className="text-red-600">
            🌍✈️🌎{request.fcountry} → {request.dcountry}
            </p>
            <p className="text-sm font-bold text-gray-500">Requested Date: {request.date}</p>
            <p className="text-sm text-gray-500">⚖️Weight of {request.item}(kg): {request.weight}</p>
            <p className="text-sm text-gray-500">📦➡️Length of {request.item}(cm): {request.length}</p>
            <p className="text-sm text-gray-500">📦⬆️⬇️Height of {request.item}(cm): {request.height}</p>
            <p className="text-sm text-gray-500">📦⬅️➡️Width of {request.item}(cm): {request.width}</p>
            <div className="flex gap-2 mt-4">
              {/* <Link to={`/edit/${request._id}`} className="flex items-center gap-1 px-4 py-2 border rounded-lg">
                ✏️ Edit
              </Link> */}
              {/* <button className="flex items-center gap-1 px-4 py-2 text-white bg-red-500 rounded-lg" onClick={(e)=>handleDelete(request._id)}>
                🗑️ Delete
              </button> */}
              <Link to={`/more_info/${request._id}`} className="flex items-center gap-1 px-4 py-2 text-white bg-black rounded-lg">
              ❓ Need more info?
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersMyRequests;

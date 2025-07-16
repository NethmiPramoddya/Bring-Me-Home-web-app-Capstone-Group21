import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

function MySenderRequests() {
    const [mySenderRequests, setMySenderRequests] =useState([])
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
        
                
                const updatedList = mySenderRequests.filter(request => {
                    return request._id !== id; 
                });
        
                
                setMySenderRequests(updatedList);
            } catch (err) {
                console.log("Error deleting request:", err);
            }
        };

        // const handleViewMore = (request) => {
        //     setSelectedRequest(request);
        //     setShowModal(true);
        //   };

          const closeModal = () => {
            setShowModal(false);
            setSelectedRequest(null);
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
                                {
                                    request.status !== 'accepted' && (
                                        <button
                                    onClick={() => handleDelete(request._id)}
                                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    🗑️Delete
                                </button>
                                    )
                                }
                                {
                                    request.status === 'accepted' && (
                                        <button
                                       disabled
                                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                        Accepted
                                    </button>
                                    )
                                }
                                
                                
                                <Link to={`/view_more/${request._id}`}
                                    
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                >
                                    View More
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && selectedRequest && (
                    <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                    >
                    <div
                        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                    >
                        <h3 className="mb-4 text-lg font-bold">Request Details</h3>
                        <p><strong>Item:</strong> {selectedRequest.item}</p>
                        <p><strong>From:</strong> {selectedRequest.fcountry}</p>
                        <p><strong>To:</strong> {selectedRequest.dcountry}</p>
                        <p><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</p>
                        <p><strong>Recipient:</strong> {selectedRequest.rname} ({selectedRequest.remail})</p>
                        <p><strong>Message:</strong> {selectedRequest.message || 'No message'}</p>

                        <button
                        onClick={closeModal}
                        className="px-4 py-2 mt-6 text-white bg-gray-700 rounded hover:bg-gray-800"
                        >
                        Close
                        </button>
                    </div>
                    </div>
                )}
        </div>
  )
}

export default MySenderRequests
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

import { useNavigate } from 'react-router-dom';

export default function AdminSenderRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);


    const navigate = useNavigate()
        
        const adminId = localStorage.getItem("adminId")
        
        useEffect(() => {
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            if (!isLoggedIn || isLoggedIn === "false" || !adminId ) {
              navigate('/admin/login');
            }
          }, [adminId, navigate]);

  useEffect(() => {
    fetchSenderRequests();
  }, []);

  const fetchSenderRequests = async () => {
    try {
      const res = await fetch("http://localhost:3002/sender-requests");
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sender requests", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(`http://localhost:3002/sender-request/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Error deleting request", error);
    }
  };

  const handleView = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-50">
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="block mb-4 md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 text-white bg-red-600 rounded"
          >
            Toggle Menu
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-semibold text-red-700">Sender Request Details</h2>

        {loading ? (
          <p className="text-gray-500">Loading sender requests...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3">From → To</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Tip</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-t">
                    <td className="p-3">{req.sname}</td>
                    <td className="p-3">{req.rname}</td>
                    <td className="p-3">{req.fcountry} → {req.dcountry}</td>
                    <td className="p-3">{req.item}</td>
                    <td className="p-3">${req.tip}</td>
                    <td className="p-3">{req.status}</td>
                    <td className="p-3 space-x-2">
                      <button
                        className="px-2 py-1 mb-3 text-white bg-blue-500 rounded"
                        onClick={() => handleView(req)}
                      >
                        View
                      </button>
                      <button
                        className="px-2 py-1 text-white bg-red-500 rounded"
                        onClick={() => handleDelete(req._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedRequest && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[80vh]">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Request Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {Object.entries(selectedRequest).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong>{" "}
                    {typeof value === "object" && value !== null && "$date" in value
                      ? new Date(value["$date"]).toLocaleString()
                      : value?.toString()}
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 text-white bg-red-600 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function AdminTravelers() {
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate()
      
      const adminId = localStorage.getItem("adminId")
      
      useEffect(() => {
          const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
          if (!isLoggedIn || isLoggedIn === "false" || !adminId ) {
            navigate('/admin/login');
          }
        }, [adminId, navigate]);

  useEffect(() => {
    fetchTravelers();
  }, []);

  const fetchTravelers = async () => {
    try {
      const res = await fetch("http://localhost:3002/travelers");
      const data = await res.json();
      setTravelers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching travelers", error);
    }
  };

  const openModal = (traveler) => {
    setSelectedTraveler(traveler);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTraveler(null);
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

        <h2 className="mb-4 text-2xl font-semibold text-red-700">Traveler Form Submissions</h2>

        {loading ? (
          <p className="text-gray-500">Loading traveler forms...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">From → To</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {travelers.map((traveler) => (
                  <tr key={traveler._id} className="border-t">
                    <td className="p-3">{traveler.tname}</td>
                    <td className="p-3">{traveler.temail}</td>
                    <td className="p-3">
                      {traveler.depature_country} → {traveler.destination}
                    </td>
                    <td className="p-3">{traveler.note}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openModal(traveler)}
                        className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedTraveler && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded shadow-lg">
              <button
                className="absolute text-gray-600 top-2 right-2 hover:text-red-600"
                onClick={closeModal}
              >
                &#10005;
              </button>
              <h2 className="mb-4 text-xl font-semibold text-red-700">Traveler Details</h2>
              <p><strong>Name:</strong> {selectedTraveler.tname}</p>
              <p><strong>Email:</strong> {selectedTraveler.temail}</p>
              <p><strong>From:</strong> {selectedTraveler.depature_country}</p>
              <p><strong>To:</strong> {selectedTraveler.destination}</p>
              <p><strong>Luggage Space:</strong> {selectedTraveler.Luggage_space}</p>
              <p><strong>Departure Date:</strong> {new Date(selectedTraveler.depature_date).toLocaleDateString()}</p>
              <p><strong>Arrival Date:</strong> {new Date(selectedTraveler.arrival_date).toLocaleDateString()}</p>
              <p><strong>Post Date:</strong> {new Date(selectedTraveler.post_date).toLocaleDateString()}</p>
              <p><strong>Contact (Dep):</strong> {selectedTraveler.contactinfo_d}</p>
              <p><strong>Contact (Arr):</strong> {selectedTraveler.contactinfo_a}</p>
              <p><strong>Profiles:</strong> {selectedTraveler.profile1}, {selectedTraveler.profile2}</p>
              <p><strong>Notes:</strong> {selectedTraveler.note}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminOngoingTasks() {
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
    fetchOngoingTasks();
  }, []);

  const fetchOngoingTasks = async () => {
    try {
      const res = await fetch("http://localhost:3002/admin/ongoingTasks");
      const data = await res.json();
      setOngoingTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ongoing tasks", error);
      setLoading(false);
    }
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
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

        <h2 className="mb-4 text-2xl font-semibold text-red-700">All Ongoing Tasks</h2>

        {loading ? (
          <p className="text-gray-500">Loading ongoing tasks...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Traveler</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">From → To</th>
                  <th className="p-3">Delivery Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {ongoingTasks.map((task) => (
                  <tr key={task._id} className="border-t">
                    <td className="p-3">{task.tname}</td>
                    <td className="p-3">{task.sname}</td>
                    <td className="p-3">{task.item}</td>
                    <td className="p-3">
                      {task.fcountry} → {task.dcountry}
                    </td>
                    <td className="p-3">{new Date(task.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">
                        {task.deliveryStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => openModal(task)}
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
        {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded shadow-lg">
              <button
                className="absolute text-gray-600 top-2 right-2 hover:text-red-600"
                onClick={closeModal}
              >
                &#10005;
              </button>
              <h2 className="mb-4 text-xl font-semibold text-red-700">Task Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-2 font-semibold">Traveler Information</h3>
                  <p><strong>Name:</strong> {selectedTask.tname}</p>
                  <p><strong>Contact:</strong> {selectedTask.contactinfo_d}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Sender Information</h3>
                  <p><strong>Name:</strong> {selectedTask.sname}</p>
                  <p><strong>Contact:</strong> {selectedTask.scontact}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Package Details</h3>
                <p><strong>Item:</strong> {selectedTask.item}</p>
                <p><strong>From:</strong> {selectedTask.fcountry}</p>
                <p><strong>To:</strong> {selectedTask.dcountry}</p>
                <p><strong>Delivery Date:</strong> {new Date(selectedTask.date).toLocaleDateString()}</p>
                <p><strong>Weight:</strong> {selectedTask.weight}kg</p>
                <p><strong>Dimensions:</strong> {selectedTask.length}cm × {selectedTask.width}cm × {selectedTask.height}cm</p>
                <p><strong>Payment Status:</strong> {selectedTask.paymentStatus}</p>
                <p><strong>Delivery Status:</strong> {selectedTask.deliveryStatus}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
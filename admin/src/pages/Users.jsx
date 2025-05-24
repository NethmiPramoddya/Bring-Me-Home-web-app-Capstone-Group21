import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3002/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
    }
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

        <h2 className="mb-4 text-2xl font-semibold text-red-700">Registered Users</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full text-left border table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">About</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.location}</td>
                    <td className="p-3">{user.about}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

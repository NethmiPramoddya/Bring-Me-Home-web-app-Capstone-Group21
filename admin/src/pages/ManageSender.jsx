import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageSender() {
  const [manageSender, setManageSender] = useState([{
    sname: "",
    semail: "",
    rname: "",
    remail: "",
    item: "",
    fcountry: "",
    dcountry: "",
    tip: 0,
    needsPurchase: false,
    paymentStatus: "",
    status: ""
  }]);

  useEffect(() => {
    axios.get("http://localhost:3002/manageSenders")
      .then(result => setManageSender(result.data))
      .catch(err => console.log(err))
  }, []);

  const handleEdit = () => {
    alert("Edit button clicked!");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      alert("Deleted!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-blue-500">
      <div className="w-full max-w-screen-xl p-4 bg-white rounded shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Sender Request Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2 border">Sender Name</th>
                <th className="p-2 border">Sender Email</th>
                <th className="p-2 border">Receiver Name</th>
                <th className="p-2 border">Receiver Email</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">From</th>
                <th className="p-2 border">To</th>
                <th className="p-2 border">Tip</th>
                <th className="p-2 border">Needs Purchase?</th>
                <th className="p-2 border">Payment Status</th>
                <th className="p-2 border">Request Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {manageSender.map((sender, index) => {
                return (
                  <tr className="text-gray-700" key={index}>
                    <td className="p-2 border">{sender.sname}</td>
                    <td className="p-2 border">{sender.semail}</td>
                    <td className="p-2 border">{sender.rname}</td>
                    <td className="p-2 border">{sender.remail}</td>
                    <td className="p-2 border">{sender.item}</td>
                    <td className="p-2 border">{sender.fcountry}</td>
                    <td className="p-2 border">{sender.dcountry}</td>
                    <td className="p-2 border">{sender.tip} USD</td>
                    <td className="p-2 border">{sender.needsPurchase ? "Yes" : "No"}</td>
                    <td className="p-2 border">{sender.paymentStatus}</td>
                    <td className="p-2 border">{sender.status}</td>
                    <td className="p-2 space-x-2 border">
                      <button
                        onClick={handleEdit}
                        className="px-3 py-2 mt-2 mb-2 text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-3 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageSender;

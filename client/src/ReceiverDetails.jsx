import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ReceiverDetails() {
  const { id } = useParams(); 
  const [task, setTask] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3002/receiver/${id}`)
      .then(res => setTask(res.data))
      .catch(err => console.error("Error loading task:", err));
  }, [id]);

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleOtpSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:3002/api/payment/verify-otp", {
        sender_request_id: id,
        enteredOtp: otp,
      });

      setMessage(res.data.message);
    } catch (error) {
      const msg = error.response?.data?.message || "Verification failed.";
      setMessage(msg);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 text-red-600">
      <div className="rounded-[2rem] border-4 border-red-600 p-6 w-full max-w-md bg-white shadow">
        {task ? (
          <div className="space-y-3">
            <p><strong>Sender Name:</strong> {task.sname}</p>
            <p><strong>Traveler Name:</strong> {task.tname}</p>
            <p><strong>Package:</strong> {task.item}</p>
            <p><strong>From:</strong> {task.fcountry}</p>
            <p><strong>To:</strong> {task.dcountry}</p>
            <p><strong>Date:</strong> {new Date(task.date).toLocaleDateString()}</p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-400"
            />

            <button
              onClick={handleOtpSubmit}
              className="w-full p-2 text-white transition bg-red-600 rounded hover:bg-red-700"
            >
              Submit OTP
            </button>

            {message && <p className="mt-2 text-center">{message}</p>}
          </div>
        ) : (
          <p>Loading details...</p>
        )}
      </div>
    </div>
  );
}

export default ReceiverDetails;

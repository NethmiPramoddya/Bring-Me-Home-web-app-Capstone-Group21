import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OnGoingTasks() {
    const [onGoingTasks, setOnGoingTasks] = useState([]);
    const [storedUsername, setStoredUsername] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3002/onGoingTasks/${userId}`)
                .then(result => {
                    console.log("Ongoing tasks:", result.data);
                    setOnGoingTasks(result.data);
                })
                .catch(err => console.log("Error fetching tasks:", err));
        }
    }, [userId]);

        useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const uid = localStorage.getItem("userId");
        const username = localStorage.getItem("username");
        if (!isLoggedIn || isLoggedIn === "false" || !uid) {
          alert("Please log in to chat");
          return;
        }
    
        setUserId(uid);
        setStoredUsername(username);
      }, []);

    const handleChat = (roomId) => {
        if (roomId) {
            navigate(`/chat/${roomId}`);
        } else {
            alert("No chat room ID found for this request.");
        }
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Ongoing Tasks</h2>
            {onGoingTasks.length === 0 ? (
                <p>No ongoing tasks found.</p>
            ) : (
                <ul className="space-y-4">
                    {onGoingTasks.map((task, index) => (
                        <li key={index} className="flex items-start justify-between p-4 border rounded shadow-sm">
                            <div>
                                <p><strong>From:</strong> {task.fcountry}</p>
                                <p><strong>To:</strong> {task.dcountry}</p>
                                <p><strong>Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
                                <p><strong>Post Date:</strong> {new Date(task.post_date).toLocaleDateString()}</p>
                                <p><strong>Item:</strong> {task.item}</p>
                                <p><strong>Sender Name:</strong> {task.sname}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleChat(task.roomId)}
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    🗨️ Chat With Sender
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default OnGoingTasks;

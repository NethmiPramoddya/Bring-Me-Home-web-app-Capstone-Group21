import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import * as htmlToImage from 'html-to-image';

function OnGoingTasks() {
    const [onGoingTasks, setOnGoingTasks] = useState([]);
    const [storedUsername, setStoredUsername] = useState("");
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    const qrRefs = useRef({}); 

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

    const downloadQRCode = (requestId) => {
        const node = qrRefs.current[requestId];
        if (!node) return;

        htmlToImage.toPng(node)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `qr-${requestId}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('QR code generation failed:', error);
            });
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Ongoing Tasks</h2>
            {onGoingTasks.length === 0 ? (
                <p>No ongoing tasks found.</p>
            ) : (
                <ul className="space-y-6">
                    {onGoingTasks.map((task, index) => {
                        const qrUrl = `http://localhost:5174/receiver/${task._id}`;
                        return (
                            <li key={index} className="flex flex-col justify-between gap-4 p-4 bg-white border rounded shadow-sm md:flex-row">
                                <div>
                                    <p><strong>From:</strong> {task.fcountry}</p>
                                    <p><strong>To:</strong> {task.dcountry}</p>
                                    <p><strong>Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
                                    <p><strong>Post Date:</strong> {new Date(task.post_date).toLocaleDateString()}</p>
                                    <p><strong>Item:</strong> {task.item}</p>
                                    <p><strong>Sender Name:</strong> {task.sname}</p>
                                    <p><strong>(please download and print this QR code and paste it on package)</strong></p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={() => handleChat(task.roomId)}
                                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                    >
                                        🗨️ Chat With Sender
                                    </button>
                                    <div ref={(el) => (qrRefs.current[task._id] = el)} className="p-2 bg-white border rounded">
                                        <QRCode value={qrUrl} size={128} />
                                    </div>
                                    <button
                                        onClick={() => downloadQRCode(task._id)}
                                        className="px-3 py-1 mt-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                        Download QR
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default OnGoingTasks;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Chats from './Chats';

// Create a singleton socket instance
const socket = io('http://localhost:3002', { autoConnect: false });
const API_URL = 'http://localhost:3002';

function RoomId() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState('');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  
  // Check authentication and get user info
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    
    if (!isLoggedIn || !userId) {
      navigate('/login');
      return;
    }
    
    setUserId(userId);
    setUsername(username || 'User');
  }, [navigate]);
  
  // Set room ID from URL parameter
  useEffect(() => {
    if (roomId) {
      setRoom(roomId);
      localStorage.setItem('currentChatRoom', roomId);
    } else {
      const savedRoom = localStorage.getItem('currentChatRoom');
      if (savedRoom) {
        navigate(`/chat/${savedRoom}`, { replace: true });
      } else {
        setError('No chat room found');
        setLoading(false);
      }
    }
  }, [roomId, navigate]);
  
  // Fetch room details and partner info
  useEffect(() => {
    if (!room || !userId) return;
    
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        
        // First check if room exists
        try {
          const roomResponse = await axios.get(`${API_URL}/chat/room-details/${room}`);
          console.log("Room details:", roomResponse.data);
          
          // Determine who the chat partner is
          const partnerId = roomResponse.data.sender_user_id === userId 
            ? (roomResponse.data.traveler_user_id || roomResponse.data.traveller_user_id)
            : roomResponse.data.sender_user_id;
          
          // Get partner details if we have a partner ID
          if (partnerId) {
            try {
              const userResponse = await axios.get(`${API_URL}/profile/${partnerId}`);
              setChatPartner(userResponse.data);
            } catch (userErr) {
              console.error("Error fetching partner details:", userErr);
              // Continue even if we can't get partner details
            }
          }
          
          setLoading(false);
          setShowChat(true);
          
        } catch (roomErr) {
          console.error("Room not found, checking update_room endpoint:", roomErr);
          
          // If room doesn't exist, try to find it in SenderModel
          const viewMoreId = localStorage.getItem('currentViewMoreId');
          
          if (viewMoreId) {
            try {
              const senderResponse = await axios.get(`${API_URL}/view_more/${viewMoreId}`);
              
              if (senderResponse.data.roomId) {
                // If sender has a roomId but it doesn't match our current one, navigate to it
                if (senderResponse.data.roomId !== room) {
                  navigate(`/chat/${senderResponse.data.roomId}`, { replace: true });
                  return;
                }
              } else {
                setError("This chat room does not exist. Please go back to the sender request.");
                setLoading(false);
              }
            } catch (senderErr) {
              console.error("Error checking sender:", senderErr);
              setError("Could not find chat room. Please try again later.");
              setLoading(false);
            }
          } else {
            setError("Chat room not found. Please go back to the sender request.");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error in room fetching process:", err);
        setError("Could not load chat room. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [room, userId, navigate]);
  
  // Connect to socket.io and join room
  useEffect(() => {
    if (!room || !userId || !username || !showChat) return;
    
    console.log(`Connecting to socket for room: ${room}, user: ${userId}`);
    
    // Disconnect and reconnect to ensure clean state
    socket.disconnect();
    socket.connect();
    
    // Join the room with user ID for read receipts
    socket.emit('join_room', { roomId: room, userId });
    
    socket.on('connect', () => {
      console.log('Socket connected with ID:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError("Could not connect to chat server. Please try again later.");
    });
    
    // Clean up on unmount
    return () => {
      console.log('Disconnecting socket');
      socket.off('connect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [room, userId, username, showChat]);
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="mb-4 text-lg text-red-500">{error}</div>
        <button 
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={() => navigate('/')}
        >
          Return Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {showChat && (
        <div className="w-full max-w-3xl">
          {chatPartner && (
            <div className="p-4 mb-2 bg-white rounded shadow-md">
              <p className="text-lg">
                Chatting with: <span className="font-semibold">{chatPartner.username || chatPartner.name || 'User'}</span>
              </p>
            </div>
          )}
          
          <Chats 
            socket={socket} 
            username={username} 
            userId={userId} 
            room={room}
            partner={chatPartner}
          />
        </div>
      )}
    </div>
  );
}

export default RoomId; 
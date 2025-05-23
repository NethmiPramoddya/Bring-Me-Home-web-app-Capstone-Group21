import React, { useState, useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';

const API_URL = 'http://localhost:3002';

function Chats({ socket, username, userId, room, partner }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  
  // Calculate receiver ID based on chat partner
  const getReceiverId = () => {
    if (partner) {
      return partner._id;
    }
    return null;
  };
  
  // Fetch message history when component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/chat/messages/${room}`);
        setMessageList(response.data);
        setLoading(false);
        
        // Mark messages as read
        if (userId) {
          await axios.post(`${API_URL}/chat/messages/read`, {
            roomId: room,
            userId
          });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Could not load messages");
        setLoading(false);
      }
    };
    
    if (room) {
      fetchMessages();
    }
  }, [room, userId]);
  
  // Listen for socket events
  useEffect(() => {
    if (!socket) return;
    
    // Handle new incoming messages
    const handleReceiveMessage = (data) => {
      setMessageList(prev => [...prev, data]);
      
      // Mark received messages as read immediately
      if (data.receiver_id === userId) {
        axios.post(`${API_URL}/chat/messages/read`, {
          roomId: room,
          userId
        }).catch(err => console.error("Error marking message as read:", err));
      }
    };
    
    // Handle message sent confirmation
    const handleMessageSent = (data) => {
      setMessageList(prev => [...prev, data]);
    };
    
    // Handle errors
    const handleError = (error) => {
      console.error("Socket error:", error);
      setError("There was an error with the chat. Please try again.");
    };
    
    // Register event handlers
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("message_error", handleError);
    socket.on("chat_history", (messages) => {
      setMessageList(messages);
      setLoading(false);
    });
    
    // Clean up
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("message_error", handleError);
      socket.off("chat_history");
    };
  }, [socket, userId, room]);
  
  // Send a message
  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;
    
    // Format the current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // Create message data
    const messageData = {
      room,
      author: username,
      sender_id: userId,
      receiver_id: getReceiverId(),
      message: currentMessage,
      time: `${hours}:${minutes}`,
      is_read: false
    };
    
    // Send the message
    socket.emit("send_message", messageData);
    
    // Clear the input field
    setCurrentMessage("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Show loading spinner while fetching messages
  if (loading) {
    return (
      <div className="w-full chat-window">
        <div className="px-4 py-3 text-white bg-gray-800 rounded-t-lg">
          <p className="font-medium">Loading messages...</p>
        </div>
        <div className="h-[400px] bg-white border border-gray-300 flex items-center justify-center">
          <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  // Show error message if something went wrong
  if (error) {
    return (
      <div className="w-full chat-window">
        <div className="px-4 py-3 text-white bg-gray-800 rounded-t-lg">
          <p className="font-medium">Chat Error</p>
        </div>
        <div className="h-[400px] bg-white border border-gray-300 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg chat-window">
      <div className="px-4 py-3 text-white bg-gray-800">
        <p className="font-medium">Messages</p>
      </div>
      
      {/* Message area with scroll */}
      <div className="h-[400px] border-x border-gray-300">
        <ScrollToBottom className="h-full overflow-x-hidden" ref={scrollRef}>
          <div className="p-4 space-y-3">
            {messageList.map((msg, index) => {
              const isCurrentUser = userId === msg.sender_id;
              
              return (
                <div 
                  key={index} 
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-2 shadow`}
                  >
                    <div className="break-words message-text">{msg.message}</div>
                    
                    <div className={`text-xs mt-1 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="opacity-75">{msg.time}</span>
                      
                      {/* Show read receipts */}
                      {isCurrentUser && (
                        <span className="ml-1 opacity-75">
                          {msg.is_read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show when there are no messages */}
            {messageList.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No messages yet. Start your conversation!
              </div>
            )}
          </div>
        </ScrollToBottom>
      </div>
      
      {/* Message input area */}
      <div className="flex border-t border-gray-300">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          className="flex-grow px-4 py-3 outline-none"
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="px-6 text-white transition bg-blue-500 hover:bg-blue-600"
          disabled={currentMessage.trim() === ""}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chats;

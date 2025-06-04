import React, { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Groq } from 'groq-sdk';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key is not configured. Please add VITE_GROQ_API_KEY to your .env file.');
      }

      const groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true  // Enable browser usage
      });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful, friendly, and knowledgeable assistant for a parcel delivery platform that connects senders and travelers. The platform name is Bring Me Home\n\nYour role is to explain how the system works, guide users through the platform features, and answer questions related to:\n\n- How to register as a sender or traveler\n- Creating and managing parcel requests\n- How travelers can offer to carry packages\n- Tip calculation, weight-based pricing, and platform commission\n- Payment process using PayHere\n- Matching and communication (chat feature)\n- Delivery verification via OTP and QR code\n- Traveler wallet, fund release, and admin approval\n- System security and verification steps\n\nYou must **only answer questions related to the parcel delivery platform**. If a user asks something unrelated (like weather, jokes, or general knowledge), reply:\n\n> \"Sorry, I can only help with topics related to the parcel delivery platform. Please ask about something like registration, payment, delivery, or tips.\"\n\nBe clear, polite, and brief, but provide complete answers. If a question is unclear, politely ask the user to rephrase or provide more details. Don't answer using outside knowledge"
          },
          ...messages,
          { role: 'user', content: userMessage }
        ],
        model: "gemma2-9b-it",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false
      });

      const botResponse = chatCompletion.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while processing your request.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || 'I apologize, but I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="fixed z-50 bottom-4 right-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 text-white transition-all duration-200 ease-in-out bg-blue-500 rounded-full shadow-lg hover:bg-blue-600"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[90vh] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Bring Me Home Assistant</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClose}
                className="flex items-center px-3 py-1 text-sm "
              >
                <XMarkIcon className="w-4 h-4 mr-1 text-red-700" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto"
          >
            {error && (
              <div className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            {messages.length === 0 && (
              <div className="mt-4 text-center text-gray-500">
                <p>👋 Hello! How can I help you with the parcel delivery platform today?</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 text-gray-800 bg-gray-100 rounded-lg">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
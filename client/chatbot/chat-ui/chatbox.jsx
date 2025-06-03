import React, { useState } from "react";

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);

  return (
    <div className="app">
      <div className="header">Chatbot</div>
    </div>
  );
}

<div className="chat-box">
  {messages.map((msg, index) => (
    <div key={index} className="message-container">
      <div className={`message ${msg.role}`}>{msg.content}</div>
    </div>
  ))}
</div>


export default App;
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

const [input, setInput] = useState("");

<div className="input-area">
  <textarea
    rows="1"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message..."
  />
  <button onClick={sendMessage}>Send</button>
</div>



export default App;
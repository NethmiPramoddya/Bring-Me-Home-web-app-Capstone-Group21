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

export default App;
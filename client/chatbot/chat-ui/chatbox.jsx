import React, { useState } from "react";

function App() 
{
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]
);

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
  )
  )}
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

const sendMessage = async () => 
  {
  if (!input.trim()) return;

  const newMessages = [...messages, { role: "user", content: input }];
  setMessages(newMessages);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:8000/chat", 
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    }
  );

    const data = await response.json();

    if (data.messages) {
      setMessages(data.messages);
    } 
    else 
    {
      setMessages(
        [
        ...newMessages,
        { role: "assistant", content: "No response from the server." },
      ]
    );
    }
  } 
  catch (error) 
  {
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Error: Unable to connect to server." },
    ]
  );

  } 
  finally 
  {
    setLoading(false);
  }
};

const [loading, setLoading] = useState(false);
const chatBoxRef = useRef(null);

useEffect(() => {
  chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
}, [messages]);

{loading && <div className="loading">Thinking...</div>}


export default App;
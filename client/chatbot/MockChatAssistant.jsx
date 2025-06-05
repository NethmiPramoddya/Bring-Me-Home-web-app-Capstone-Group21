import React, { useState, useRef, useEffect } from "react";

const getAIReply = (userMessage) => 
    {
  const responses = 
  [
    "That's an interesting question!",
    "Let me think about that...",
    "Can you please elaborate?",
    "I don't have that answer now, but I'm learning!",
    "Here's what I found related to that topic.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const StandaloneChatbotUI = () => 
    {
  const [messages, setMessages] = useState
  (
    [
    { role: "assistant", content: "Hello! How can I help you today?" }
  ]
);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const sendMessage = () => 
    {
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: input };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput("");

    setTimeout(() => 
        {
      const aiReply = { role: "assistant", content: getAIReply(input) };
      setMessages((prev) => [...prev, aiReply]);
    }, 
    800);
  };

  const handleKeyPress = (e) => 
    {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => 
    {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 
  [messages]);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>🤖 Simple Chatbot UI</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style=
            {
                {
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#d1e7dd" : "#f8d7da",
            }
        }
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        )
        )
        }
        <div ref={chatRef} />
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = 
{
  wrapper: 
  {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    border: "2px solid #ccc",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  title: 
  {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "20px",
  },

  chatBox: 
  {
    height: "300px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "12px",
  },

  message: 
  {
    padding: "10px 14px",
    borderRadius: "18px",
    marginBottom: "10px",
    maxWidth: "75%",
    wordBreak: "break-word",
  },

  inputArea: 
  {
    display: "flex",
    gap: "10px",
  },

  input:
   {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },

  button: 
  {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default StandaloneChatbotUI;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // SEND TEXT MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('https://chat-bot-backend-pfvc.onrender.com/mcp/infer', {
        prompt: input,
      });

      const botMessage = {
        sender: 'bot',
        text: response.data.response || 'No response from server',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        sender: 'bot',
        text: '⚠️ Could not connect to the AI server. Is it running?',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setInput('');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) sendMessage();
  };

  return (
    <div
      style={{
        maxWidth: 850,
        margin: 'auto',
        padding: 30,
        fontFamily: 'Segoe UI, sans-serif',
        background: darkMode
          ? '#1e1e2f'
          : 'linear-gradient(to bottom right, #d0eaff, #e0d4fd)',
        color: darkMode ? '#ffffff' : '#000000',
        minHeight: '100vh',
        position: 'relative',
      }}
    >

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(prev => !prev)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '6px 12px',
          backgroundColor: darkMode ? '#444' : '#eee',
          color: darkMode ? '#fff' : '#333',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 30
      }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712104.png"
          alt="AI Logo"
          style={{ width: 50, height: 50 }}
        />
        <h1 style={{
          fontSize: 28,
          color: darkMode ? '#ffffff' : '#1f3a93',
          margin: 0,
          letterSpacing: 1
        }}>
          🎓 AI Assistant & Q&A Chatbot
        </h1>
      </div>

      {/* Chat Window */}
      <div style={{
        background: darkMode ? '#2a2a40' : '#ffffffcc',
        borderRadius: 12,
        padding: 20,
        height: 450,
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: 25,
        border: '1px solid #c3dafe'
      }}>

        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>💬 Start a conversation...</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left',
                margin: '12px 0',
              }}
            >
             <span
  style={{
    display: 'inline-block',
    backgroundColor: msg.sender === 'user'
      ? '#5c7cfa'
      : darkMode ? '#3b3b5c' : '#edf2ff',
    color: msg.sender === 'user' ? '#fff' : darkMode ? '#eee' : '#1e1e2f',
    padding: '12px 18px',
    borderRadius: 18,
    maxWidth: '75%',
    fontSize: 16,
    boxShadow: msg.sender === 'user'
      ? '2px 2px 8px rgba(92, 124, 250, 0.3)'
      : '1px 1px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  }}
  dangerouslySetInnerHTML={
    msg.sender === 'bot'
      ? { __html: msg.text } // render HTML from backend
      : undefined
  }
>
  {msg.sender === 'user' ? msg.text : null}
</span>

            </div>
          ))
        )}

        {loading && (
          <p style={{ color: '#999', fontStyle: 'italic' }}>🤖 AI is typing...</p>
        )}
      </div>

      {/* Input + Send Button */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '14px 18px',
            borderRadius: 10,
            border: '2px solid #a3bffa',
            fontSize: 16,
            outline: 'none',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '14px 24px',
            fontSize: 16,
            backgroundColor: loading ? '#a8dfb4' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default App;

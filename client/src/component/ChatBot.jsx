import React, { useState, useEffect, useRef } from "react";
import api from "../Services/Api";

const ChatBot = ({ chatLang }) => {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Namaste! I’m Lencho, your KishanSetu farm assistant. \n\nAsk me about:\n🌱 Crop recommendations\n💧 Irrigation tips\n💰 Market prices",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  /* Auto Scroll to Bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Handle Send */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/v1/chatBot/", {
        message: userMessage,
        language: chatLang || "en",
      });

      const botReply = res?.data?.data || "I didn't catch that. Could you say it again?";
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Connection error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN PAGE CONTAINER - Gray background to make the chat card pop
    <div className="h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      
      {/* CHAT CARD */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full border border-gray-200">
        
        {/* 1. HEADER */}
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              {/* Bot Icon */}
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Lencho Assistant</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500 font-medium">Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear Chat
          </button>
        </div>

        {/* 2. MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.from === "user" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"
              }`}>
                 {msg.from === "user" ? (
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                     <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                   </svg>
                 ) : (
                   <span className="text-sm">🤖</span>
                 )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.from === "user"
                    ? "bg-green-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                🤖
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* 3. INPUT FOOTER */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 px-2 py-2 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500 transition-all shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question about farming..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 px-4 py-1 text-base placeholder:text-gray-400"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                !input.trim() || loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transform active:scale-95"
              }`}
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">Lencho can make mistakes. Consider checking important info.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChatBot;
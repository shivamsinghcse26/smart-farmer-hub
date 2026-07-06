// ChatBotWrapper.jsx
import React, { useState } from "react";
import ChatBot from "./ChatBot";
import lenchoIcon from "../assets/ai_bot_artificial_intelligence_robort_icon_259912.png";

const ChatBotWrapper = ({ chatLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center hover:scale-110 hover:shadow-xl transition-transform duration-300 z-50"
        >
          <img src={lenchoIcon} alt="Lencho" className="w-10 h-10" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transform transition-transform duration-300 animate-slide-up z-50">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
            <h3 className="font-bold text-lg">Lencho - Farm Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white font-extrabold text-xl hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 h-72 md:h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
            <ChatBot chatLang={chatLang} />
          </div>
        </div>
      )}

      {/* Tailwind animation for slide-up */}
      <style>
        {`
          @keyframes slide-up {
            0% { transform: translateY(200px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
          }
        `}
      </style>
    </>
  );
};

export default ChatBotWrapper;

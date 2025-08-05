"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Moon, Sun, Bot } from "lucide-react";
import PdfUploadButton from "../components/PDFUploadButton";
import ChatMessage from "../components/ChatMessage";

interface Message {
  type: "user" | "bot" | "system";
  text: string;
}

interface Chat {
  title: string;
  messages: Message[];
}

export default function ChatPage() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      const parsed: Chat[] = JSON.parse(stored);
      setChatHistory(parsed);
      setCurrentChatIndex(parsed.length - 1);
    } else {
      const initialChat: Chat = {
        title: "New Chat",
        messages: [
          { type: "system", text: "Ask anything based on your documents." },
          { type: "system", text: "Please upload a PDF file before asking questions. Otherwise, you’ll get: “No answer found.”" },
        ],
      };
      setChatHistory([initialChat]);
      setCurrentChatIndex(0);
    }
  }, []);

  const currentChat = chatHistory[currentChatIndex];

  const updateLocalStorage = (updatedChats: Chat[]) => {
    localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    setInput("");
    setIsTyping(true);

    const userMsg: Message = { type: "user", text: userInput };

    const updatedMessages = [...currentChat.messages, userMsg];
    const generatedTitle =
      currentChat.title === "New Chat"
        ? userInput.split(" ").slice(0, 6).join(" ").slice(0, 40)
        : currentChat.title;

    const updatedChat: Chat = {
      ...currentChat,
      title: generatedTitle,
      messages: updatedMessages,
    };

    const updatedChatHistory = chatHistory.map((chat, idx) =>
      idx === currentChatIndex ? updatedChat : chat
    );
    setChatHistory(updatedChatHistory);
    updateLocalStorage(updatedChatHistory);

    const bodyPayload = {
      question: userInput,
      session_id: sessionId,
    };

    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      const botMsg: Message = {
        type: "bot",
        text: data.answer || data.error || "No answer found.",
      };

      const newChat: Chat = {
        ...updatedChat,
        messages: [...updatedMessages, botMsg],
      };

      const finalChatHistory = chatHistory.map((chat, idx) =>
        idx === currentChatIndex ? newChat : chat
      );
      setChatHistory(finalChatHistory);
      updateLocalStorage(finalChatHistory);
    } catch (error) {
      const errorMsg: Message = {
        type: "bot",
        text: "Error occurred while fetching response.",
      };

      const newChat: Chat = {
        ...updatedChat,
        messages: [...updatedMessages, errorMsg],
      };

      const finalChatHistory = chatHistory.map((chat, idx) =>
        idx === currentChatIndex ? newChat : chat
      );
      setChatHistory(finalChatHistory);
      updateLocalStorage(finalChatHistory);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      title: "New Chat",
      messages: [
        { type: "system", text: "Ask anything based on your documents." },
        { type: "system", text: "Please upload a PDF file before asking questions. Otherwise, you’ll get: “No answer found.”" },
      ],
    };
    const updated = [...chatHistory, newChat];
    setChatHistory(updated);
    setCurrentChatIndex(updated.length - 1);
    updateLocalStorage(updated);
  };

  const handleSelectChat = (index: number) => setCurrentChatIndex(index);

  const handleRenameChat = (index: number, newTitle: string) => {
    const updated = chatHistory.map((chat, idx) =>
      idx === index ? { ...chat, title: newTitle } : chat
    );
    setChatHistory(updated);
    updateLocalStorage(updated);
  };

  const handleDeleteChat = (index: number) => {
    const updated = chatHistory.filter((_, idx) => idx !== index);
    setChatHistory(updated);
    const newIndex = Math.max(0, updated.length - 1);
    setCurrentChatIndex(newIndex);
    updateLocalStorage(updated);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
        <Sidebar
          chatHistory={chatHistory}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onRename={handleRenameChat}
          onDelete={handleDeleteChat}
        />

        <div className="flex-1 flex flex-col p-6 bg-white dark:bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              AutoRAG Assistant
            </h1>
            <button
              onClick={toggleTheme}
              className={`
                p-2 rounded-full border 
                transition duration-200
                ${darkMode
                  ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-800'}
              `}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {Array.isArray(currentChat?.messages) && currentChat.messages.length > 0 ? (
              currentChat.messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ChatMessage type={msg.type} text={msg.text} />
                </motion.div>
              ))
            ) : (
              <div className="text-gray-400 text-center mt-10">
                Start a chat to see messages
              </div>
            )}

            {isTyping && (
              <motion.div
                className="flex items-center space-x-2 mt-2 text-gray-500 dark:text-gray-400 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Bot size={20} />
                <span className="animate-pulse">Generating...</span>
              </motion.div>
            )}
          </div>


          <div className="mt-4 flex items-center gap-2 relative w-full">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <PdfUploadButton
                  setSessionId={setSessionId}
                  onFileUploaded={(filename) => setInput(filename)}
                />
              </span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 focus:outline-none dark:bg-gray-800 dark:text-white"
                placeholder="Type your question..."
              />
            </div>

            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

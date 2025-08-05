// Sidebar.tsx
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Chat {
  title: string;
  messages: { type: string; text: string }[];
}

interface SidebarProps {
  chatHistory: Chat[];
  onSelect: (index: number) => void;
  onNewChat: () => void;
  onRename: (index: number, newTitle: string) => void;
  onDelete: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatHistory,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
    <button
      onClick={onNewChat}
      className="w-full mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      + New Chat
    </button>
    <ul className="space-y-3">
      {chatHistory.map((chat, index) => (
        <li
            key={index}
            className="group flex justify-between items-center px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 truncate"
          >
          {editingIndex === index ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => {
                onRename(index, editTitle.trim() || "Untitled");
                setEditingIndex(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onRename(index, editTitle.trim() || "Untitled");
                  setEditingIndex(null);
                }
              }}
              autoFocus
              className="bg-transparent border-b border-gray-400 dark:border-gray-600 text-sm flex-1 mr-2 focus:outline-none"
            />
          ) : (
            <span
              onClick={() => onSelect(index)}
              className="flex-1 cursor-pointer truncate font-medium"
            >
              {chat.title}
            </span>
          )}

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              title="Rename"
              onClick={() => {
                setEditingIndex(index);
                setEditTitle(chat.title);
              }}
            >
              <Pencil size={14} />
            </button>
            <button title="Delete" onClick={() => onDelete(index)}>
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default Sidebar;

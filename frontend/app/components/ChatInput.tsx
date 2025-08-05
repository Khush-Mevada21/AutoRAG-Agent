"use client";
import { useState } from 'react';

export default function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t bg-white">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="Type your question..."
        className="flex-1 border rounded-xl px-4 py-2 text-sm"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
}

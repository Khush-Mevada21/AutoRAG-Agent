
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Copy } from 'lucide-react';

interface Props {
  type: 'user' | 'bot' | 'system';
  text: string;
}

const ChatMessage = ({ type, text }: Props) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const isUser = type === 'user';
  const isBot = type === 'bot';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className={`my-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          relative px-4 py-3 rounded-xl max-w-[80%] text-sm shadow-md group
          ${type === 'system'
            ? 'bg-gray-100 text-black mx-auto dark:bg-gray-600 dark:text-white'
            : isUser
            ? 'bg-gray-300 text-black dark:bg-gray-500 dark:text-white' 
            : 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'}
        `}
      >
        <p className="whitespace-pre-wrap">{text}</p>

        {isBot && (
          <div className="absolute -bottom-7 right-2 flex space-x-2 text-gray-400 dark:text-gray-500 text-xs items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`hover:text-blue-600 transition-colors duration-200`}
              title="Thumbs up"
            >
              <ThumbsUp
                size={16}
                fill={feedback === 'up' ? 'currentColor' : 'none'}
              />
            </button>
            <button
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`hover:text-red-600 transition-colors duration-200`}
              title="Thumbs down"
            >
              <ThumbsDown
                size={16}
                fill={feedback === 'down' ? 'currentColor' : 'none'}
              />
            </button>
            <button
              onClick={handleCopy}
              className="hover:text-green-600 transition-colors duration-200"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;

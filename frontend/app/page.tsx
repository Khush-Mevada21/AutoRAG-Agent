'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStartChat = async () => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email.');
      return;
    }

    try {
      await fetch('http://localhost:8000/api/track-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      router.push(`/chat?email=${encodeURIComponent(email)}`);
    } catch (e) {
      console.error('Failed to save email:', e);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white px-4">
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0"
        options={{
          preset: 'links',
          background: {
            color: { value: '#000000' },
          },
          particles: {
            links: {
              enable: true,
              color: '#9CA3AF',
              distance: 120,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
            },
            size: {
              value: { min: 1, max: 3 },
            },
            number: {
              value: 80,
              density: {
                enable: true,
              },
            },
          },
        }}
      />

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10 w-full max-w-lg mx-auto p-8 bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 text-center"
      >
        <div className="flex justify-center mb-6">
          <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AutoRAG
          </span>{' '}
          Research Assistant
        </h1>

        <p className="mb-8 text-gray-400 text-lg">
          Upload your documents, ask anything, and get intelligent answers powered by local RAG + Ollama.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="px-5 py-3 w-full sm:w-auto rounded-full border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
          <button
            onClick={handleStartChat}
            className="px-8 py-3 w-full sm:w-auto bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Start Chatting <span aria-hidden="true">→</span>
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </main>
  );
}

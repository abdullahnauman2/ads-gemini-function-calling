"use client";

import { useState } from 'react';

interface ChatResponse {
  response: string;
  data?: any;
  functionCalled?: boolean;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data: ChatResponse = await response.json();
      setChatResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setChatResponse({ response: 'Sorry, there was an error processing your request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Google Ads Gemini Demo</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your Google Ads data... (e.g., 'What are my top performing campaigns?')"
          className="w-full p-3 border rounded-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>

      {chatResponse && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">AI Response:</h3>
            <p className="text-blue-900">{chatResponse.response}</p>
          </div>

          {chatResponse.functionCalled && chatResponse.data && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-2">Raw Data Used:</h3>
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(chatResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-bold text-yellow-800 mb-2">Try asking:</h3>
        <ul className="text-yellow-700 space-y-1">
          <li>• "What are my top 3 campaigns by ROAS?"</li>
          <li>• "Show me all paused campaigns"</li>
          <li>• "Which campaign has the highest cost?"</li>
          <li>• "What's the total spend across all campaigns?"</li>
        </ul>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { useChatState } from './hooks/useChatState';
import { ChatMessage } from './components/ChatMessage';
import { LoadingIndicator } from './components/LoadingIndicator';
import { InputBar } from './components/InputBar';

export default function Home() {
  const { message, setMessage, messages, loading, handleSubmit } = useChatState();
  const [showDebug] = useState(true);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #ccc',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>Google</h1>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: '1', overflowY: 'auto', padding: '0 20px' }}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '30px', maxWidth: '400px' }}>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 0' }}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} showDebug={showDebug} />
            ))}
          </div>
        )}
      </div>

      {loading && <LoadingIndicator />}

      <InputBar
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        loading={loading}
        messagesLength={messages.length}
      />
    </div>
  );
}
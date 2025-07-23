"use client";

import { useState } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  debugInfo?: {
    functionCalled: boolean;
    rawData?: any;
    processingTime?: number;
  };
}

interface ChatResponse {
  response: string;
  data?: any;
  functionCalled?: boolean;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDebug] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: message.trim(),
          history: messages
        }),
      });

      const data: ChatResponse = await response.json();
      const processingTime = Date.now() - startTime;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        debugInfo: {
          functionCalled: data.functionCalled || false,
          rawData: data.data,
          processingTime
        }
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };


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
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: '0', fontSize: '18px', fontWeight: 'bold'}}>Google</h1>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{flex: '1', overflowY: 'auto', padding: '0 20px'}}>
        {messages.length === 0 ? (
          <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{marginBottom: '30px', maxWidth: '400px'}}>
            </div>
          </div>
        ) : (
          <div style={{padding: '20px 0'}}>
            {messages.map((msg) => (
              <div key={msg.id} style={{marginBottom: '20px'}}>
                {/* Message */}
                <div style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '10px 15px',
                    backgroundColor: msg.type === 'user' ? '#4169e1' : 'white',
                    color: msg.type === 'user' ? 'white' : 'black',
                    border: msg.type === 'user' ? '1px solid #4169e1' : '1px solid #ccc',
                    fontSize: '14px'
                  }}>
                    <p style={{margin: '0', whiteSpace: 'pre-wrap'}}>{msg.content}</p>
                    <div style={{
                      fontSize: '11px',
                      marginTop: '5px',
                      color: msg.type === 'user' ? '#cce6ff' : '#999'
                    }}>
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Debug Info */}
                {msg.type === 'assistant' && msg.debugInfo && showDebug && (
                  <div style={{marginLeft: '20px'}}>
                    {/* Processing Stats */}
                    <div style={{
                      backgroundColor: '#f8f8f8',
                      padding: '10px',
                      border: '1px solid #ddd',
                      marginBottom: '10px'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h4 style={{margin: '0', fontSize: '12px', fontWeight: 'bold'}}>Debug Information</h4>
                        <div style={{fontSize: '11px', color: '#666'}}>
                          <span style={{marginRight: '15px'}}>⚡ {msg.debugInfo.processingTime}ms</span>
                          <span style={{color: msg.debugInfo.functionCalled ? 'green' : '#999'}}>
                            ● Function {msg.debugInfo.functionCalled ? 'Called' : 'Not Called'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Raw Data */}
                    {msg.debugInfo.functionCalled && msg.debugInfo.rawData && (
                      <div style={{
                        backgroundColor: '#000',
                        color: '#00ff00',
                        padding: '10px',
                        border: '1px solid #333',
                        fontFamily: 'Courier New, monospace'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                          <h4 style={{margin: '0', fontSize: '12px', color: '#ccc'}}>Raw Data Response</h4>
                          <span style={{fontSize: '11px', color: '#999'}}>JSON</span>
                        </div>
                        <pre style={{
                          margin: '0',
                          fontSize: '11px',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          color: '#00ff00'
                        }}>
                          {JSON.stringify(msg.debugInfo.rawData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{padding: '0 20px 10px 20px'}}>
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: '10px 15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{marginRight: '10px', fontSize: '14px'}}>...</span>
              <span style={{fontSize: '12px', color: '#666'}}>Analyzing your data...</span>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div style={{
        backgroundColor: 'white',
        borderTop: '1px solid #ccc',
        padding: '15px 20px'
      }}>
        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px'}}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messages.length === 0 ? "I'm feeling lucky" : "Ask a follow up"}
            style={{
              flex: '1',
              padding: '10px',
              border: '1px solid #ccc',
              resize: 'none',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              marginBottom: '16px'
            }}
            rows={1}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as React.FormEvent);
              }
            }}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            style={{
              backgroundColor: loading || !message.trim() ? '#ccc' : '#4169e1',
              color: 'white',
              border: '1px solid #333',
              padding: '10px 20px',
              fontWeight: 'bold',
              cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
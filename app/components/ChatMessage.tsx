import { ChatMessage as ChatMessageType } from '@/lib/types';
import { DebugInfo } from './DebugInfo';

interface ChatMessageProps {
  message: ChatMessageType;
  showDebug: boolean;
}

export const ChatMessage = ({ message, showDebug }: ChatMessageProps) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Message */}
      <div style={{
        display: 'flex',
        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '10px'
      }}>
        <div style={{
          maxWidth: '70%',
          padding: '10px 15px',
          backgroundColor: message.type === 'user' ? '#4169e1' : 'white',
          color: message.type === 'user' ? 'white' : 'black',
          border: message.type === 'user' ? '1px solid #4169e1' : '1px solid #ccc',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0', whiteSpace: 'pre-wrap' }}>{message.content}</p>
          <div style={{
            fontSize: '11px',
            marginTop: '5px',
            color: message.type === 'user' ? '#cce6ff' : '#999'
          }}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <DebugInfo message={message} showDebug={showDebug} />
    </div>
  );
};
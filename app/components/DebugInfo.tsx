import { ChatMessage } from '@/lib/types';

interface DebugInfoProps {
  message: ChatMessage;
  showDebug: boolean;
}

export const DebugInfo = ({ message, showDebug }: DebugInfoProps) => {
  if (message.type !== 'assistant' || !message.debugInfo || !showDebug) {
    return null;
  }

  return (
    <div style={{ marginLeft: '20px' }}>
      {/* Processing Stats */}
      <div style={{
        backgroundColor: '#f8f8f8',
        padding: '10px',
        border: '1px solid #ddd',
        marginBottom: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: '0', fontSize: '12px', fontWeight: 'bold' }}>Debug Information</h4>
          <div style={{ fontSize: '11px', color: '#666' }}>
            <span style={{ marginRight: '15px' }}>⚡ {message.debugInfo.processingTime}ms</span>
            <span style={{ color: message.debugInfo.functionCalled ? 'green' : '#999' }}>
              ● Function {message.debugInfo.functionCalled ? 'Called' : 'Not Called'}
            </span>
          </div>
        </div>
      </div>

      {/* Raw Data */}
      {message.debugInfo.functionCalled && message.debugInfo.rawData && (
        <div style={{
          backgroundColor: '#000',
          color: '#00ff00',
          padding: '10px',
          border: '1px solid #333',
          fontFamily: 'Courier New, monospace'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <h4 style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>Raw Data Response</h4>
            <span style={{ fontSize: '11px', color: '#999' }}>JSON</span>
          </div>
          <pre style={{
            margin: '0',
            fontSize: '11px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            color: '#00ff00'
          }}>
            {JSON.stringify(message.debugInfo.rawData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
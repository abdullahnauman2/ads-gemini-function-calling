interface InputBarProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  messagesLength: number;
}

export const InputBar = ({ message, setMessage, onSubmit, loading, messagesLength }: InputBarProps) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderTop: '1px solid #ccc',
      padding: '15px 20px'
    }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={messagesLength === 0 ? "I'm feeling lucky" : "Ask a follow up"}
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
              onSubmit(e as React.FormEvent);
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
  );
};
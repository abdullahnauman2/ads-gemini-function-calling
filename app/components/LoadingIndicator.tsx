export const LoadingIndicator = () => {
  return (
    <div style={{ padding: '0 20px 10px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px 15px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '10px', fontSize: '14px' }}>...</span>
          <span style={{ fontSize: '12px', color: '#666' }}>Analyzing your data...</span>
        </div>
      </div>
    </div>
  );
};
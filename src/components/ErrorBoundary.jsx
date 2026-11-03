import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Portfolio ErrorBoundary] Caught uncaught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d0d0f',
          color: '#f0f0f0',
          padding: '32px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#ff6b6b' }}>
            Portfolio View Recovery
          </h2>
          <p style={{ maxWidth: '480px', color: '#a0a0aa', marginBottom: '24px', lineHeight: 1.5 }}>
            A component encountered an issue during display. Click below to refresh the experience.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 22px',
              backgroundColor: '#ff4d4d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 77, 77, 0.4)'
            }}
          >
            Reload Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

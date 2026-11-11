import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LineWaves from './components/LineWaves';
import ErrorBoundary from './components/ErrorBoundary';
import '../styles.css';

function LineWavesPreview() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#090d16', overflow: 'hidden' }}>
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(9,13,22,0.85), transparent)',
          pointerEvents: 'none'
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              backdropFilter: 'blur(8px)'
            }}
          >
            &#8592; Back to Portfolio
          </a>
          <div>
            <h1 style={{ margin: 0, color: '#ffffff', fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 700 }}>
              LineWaves Component
            </h1>
            <p style={{ margin: '2px 0 0 0', color: 'rgba(255, 255, 255, 0.65)', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
              React Bits &#8226; WebGL2 Flowing Wave Shader
            </p>
          </div>
        </div>
        <div style={{ pointerEvents: 'auto', color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
          Interactive: Move cursor &amp; click to send ripples
        </div>
      </header>

      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <LineWaves
          color1="#ffffff"
          color2="#336196"
          color3="#fff7ed"
          speed={0.3}
          lineCount={72}
          lineWidth={1.3}
          highlight={1}
          warpIntensity={1}
          rotation={-33}
          enableMouseInteraction={true}
        />
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <LineWavesPreview />
      </ErrorBoundary>
    </StrictMode>
  );
}

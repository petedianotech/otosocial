import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'OtoSocial - Automated Content Publishing';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: 80,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Accents */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(79, 70, 229, 0.2)', filter: 'blur(80px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'rgba(147, 51, 234, 0.2)', filter: 'blur(80px)', borderRadius: '50%' }} />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
            width: 160,
            height: 160,
            borderRadius: 48,
            color: 'white',
            fontSize: 100,
            fontWeight: 800,
            marginBottom: 48,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}
        >
          O
        </div>
        <h1
          style={{
            fontSize: 90,
            fontWeight: 900,
            background: 'linear-gradient(to right, #818cf8, #c084fc)',
            backgroundClip: 'text',
            color: 'transparent',
            margin: '0 0 24px 0',
            textAlign: 'center',
            letterSpacing: '-0.05em',
          }}
        >
          OtoSocial
        </h1>
        <p style={{ fontSize: 42, color: '#94a3b8', textAlign: 'center', maxWidth: 900, fontWeight: 500, lineHeight: 1.4 }}>
          The Fully Autonomous Content Engine <br/> for the Modern Developer.
        </p>
        
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
           <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: 99, color: '#f8fafc', fontSize: 20, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>Auto-Publishing</div>
           <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: 99, color: '#f8fafc', fontSize: 20, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>AI-Powered</div>
           <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: 99, color: '#f8fafc', fontSize: 20, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>Multi-Platform</div>
        </div>
      </div>
    ),
    { ...size }
  );
}

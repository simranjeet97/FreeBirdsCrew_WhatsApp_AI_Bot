import React from 'react';
import { QrCode, CheckCircle2, Loader2, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QRCodeComponent = ({ status }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass glass-interactive" 
      style={{ padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200%', height: '200%', background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 60%)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Link size={24} color="var(--primary)" />
        </div>
        <h3 className="font-heading" style={{ fontSize: '1.25rem' }}>Device Connection</h3>
      </div>

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.95)', padding: '1.25rem', borderRadius: '24px', display: 'inline-block', minWidth: 240, minHeight: 240, boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.2)' }}>
        <AnimatePresence mode="wait">
          {status.status === 'WAITING_FOR_SCAN' ? (
            <motion.img 
              key="qr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={status.qr} 
              alt="Scan QR Code" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }} 
            />
          ) : status.status === 'READY' ? (
            <motion.div 
              key="ready"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#000', gap: '1.25rem' }}
            >
              <div className="animate-pulse-success" style={{ background: 'var(--success-glow)', borderRadius: '50%' }}>
                <CheckCircle2 size={72} color="var(--success)" />
              </div>
              <p className="font-heading" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1f2937' }}>Linked Successfully</p>
              
              <button 
                onClick={async () => {
                  try {
                    await fetch('http://localhost:3001/api/reset-session', { method: 'POST' });
                  } catch(e) { console.error('Failed to reset session', e); }
                }}
                style={{ marginTop: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.2)', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                Logout / Scan Again
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#000', gap: '1.25rem' }}
            >
              <Loader2 size={56} className="spin" color="var(--primary)" />
              <p className="font-heading" style={{ color: '#4b5563', fontSize: '1rem', fontWeight: 600, textAlign: 'center' }}>
                {status.status === 'DISCONNECTING' ? 'Terminating Session...' : 'Initializing Security...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '2rem', lineHeight: '1.6', position: 'relative', zIndex: 1 }}>
        {status.status === 'WAITING_FOR_SCAN' 
          ? 'Secure your session. Scan this QR code with WhatsApp via Linked Devices.' 
          : status.status === 'READY' 
          ? 'End-to-end connection established. Bot is fully operational.' 
          : 'Negotiating connection with WhatsApp nodes...'}
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1.5s linear infinite; }
      `}</style>
    </motion.div>
  );
};

export default QRCodeComponent;

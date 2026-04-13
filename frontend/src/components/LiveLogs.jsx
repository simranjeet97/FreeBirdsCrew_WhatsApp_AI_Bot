import React, { useEffect, useRef } from 'react';
import { Terminal, Bot, User, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const LiveLogs = ({ logs }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '500px', padding: 0 }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <Terminal size={20} color="var(--primary)" />
        </div>
        <div>
          <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Real-time Trace</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitoring conversation vectors</span>
        </div>
      </div>
      
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {logs.length === 0 && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', gap: '1rem' }}>
            <Zap size={32} style={{ opacity: 0.2 }} />
            Pipeline empty. Waiting for signals.
          </div>
        )}
        
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ 
                display: 'flex', 
                gap: '1.25rem', 
                alignItems: 'flex-start',
                padding: '1rem',
                borderRadius: '16px',
                background: log.type === 'outbound' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: log.type === 'outbound' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: log.type === 'outbound' ? '0 10px 30px rgba(139, 92, 246, 0.05)' : 'none'
              }}
            >
              <div style={{ 
                padding: '0.6rem', 
                borderRadius: '12px', 
                background: log.type === 'outbound' ? 'linear-gradient(135deg, var(--primary) 0%, #6d28d9 100%)' : 'rgba(255,255,255,0.1)',
                color: 'white',
                boxShadow: log.type === 'outbound' ? '0 0 15px var(--primary-glow)' : 'none'
              }}>
                {log.type === 'outbound' ? <Bot size={18} /> : <User size={18} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span className="font-heading" style={{ fontSize: '0.85rem', fontWeight: 600, color: log.type === 'outbound' ? 'var(--primary-hover)' : 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {log.type === 'outbound' ? 'AUTO-AGENT THREAD' : log.sender.split('@')[0]}
                  </span>
                  <div style={{ padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {format(new Date(log.timestamp), 'HH:mm:ss')}
                  </div>
                </div>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', margin: 0, opacity: 0.9 }}>
                  {log.message}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveLogs;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Layout, MessageSquare, ShieldCheck, Activity, Terminal, Plus, Trash2, Power, Info, ShieldAlert } from 'lucide-react';
import QRCodeComponent from './components/QRCode';
import StatsGrid from './components/StatsGrid';
import LiveLogs from './components/LiveLogs';
import RuleManager from './components/RuleManager';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';

const socket = io('http://localhost:3001');

const App = () => {
  const [status, setStatus] = useState({ status: 'DISCONNECTED', qr: null });
  const [stats, setStats] = useState({ totalMessages: 0, automatedReplies: 0, activeRules: 0 });
  const [logs, setLogs] = useState([]);
  const [rules, setRules] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    socket.on('status', (data) => setStatus(data));
    socket.on('stats', (data) => setStats(data));
    socket.on('logs', (data) => setLogs(data));
    socket.on('rules', (data) => setRules(data));
    socket.on('rules_updated', (data) => setRules(data));
    socket.on('message', (msg) => {
      setLogs(prev => [msg, ...prev].slice(0, 50));
    });

    return () => {
      socket.off('status');
      socket.off('stats');
      socket.off('logs');
      socket.off('rules');
      socket.off('rules_updated');
      socket.off('message');
    };
  }, []);

  const NavButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setCurrentView(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.25rem',
        background: currentView === id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
        border: currentView === id ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
        color: currentView === id ? 'var(--primary-hover)' : 'var(--text-muted)',
        borderRadius: '12px',
        fontSize: '0.95rem',
        fontWeight: 600,
        transition: 'all 0.2s',
      }}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="container">
      <header className="responsive-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <h1 className="font-heading text-gradient" style={{ margin: 0, lineHeight: 1.2 }}>
          FreeBirdsCrew AI Bot
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="glass" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '16px' }}>
            <NavButton id="dashboard" icon={Layout} label="Dashboard" />
            <NavButton id="about" icon={Info} label="About Us" />
            <NavButton id="privacy" icon={ShieldAlert} label="Privacy" />
          </div>

          <div className="glass" style={{ 
            padding: '0.75rem 1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            boxShadow: status.status === 'READY' ? '0 0 20px var(--success-glow)' : '0 0 20px rgba(245, 158, 11, 0.2)',
            border: `1px solid ${status.status === 'READY' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            <div className={status.status === 'READY' ? 'animate-pulse-success' : ''} style={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: status.status === 'READY' ? 'var(--success)' : 'var(--warning)', 
            }}></div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.04em', color: 'var(--text-main)' }}>
              {status.status === 'READY' ? 'ACTIVE' : status.status}
            </span>
          </div>
        </div>
      </header>

      <div style={{ marginBottom: '2.5rem', maxWidth: '800px' }}>
        <p style={{ color: 'var(--primary-hover)', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
          (Integrated Andrej Karpathy LLM Wiki Idea)
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 400, marginTop: '0.5rem', lineHeight: 1.6, opacity: 0.9 }}>
          An intelligent WhatsApp automation engine that transcends traditional keyword bots. Powered by Gemini Flash and a local Markdown knowledge base, it synthesizes context-aware, highly personalized responses to naturally assist users in real-time.
        </p>
      </div>

      {currentView === 'dashboard' && (
        <div className="dashboard-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            <StatsGrid stats={stats} />
            <LiveLogs logs={logs} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
            <QRCodeComponent status={status} />
            <RuleManager rules={rules} />
          </div>
        </div>
      )}

      {currentView === 'about' && <AboutUs />}
      {currentView === 'privacy' && <PrivacyPolicy />}
    </div>
  );
};

export default App;

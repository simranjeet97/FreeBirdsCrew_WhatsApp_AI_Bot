import React from 'react';
import { MessageSquare, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="glass glass-interactive" 
    style={{ padding: '2rem', flex: 1, minWidth: '250px', position: 'relative', overflow: 'hidden' }}
  >
    <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: color, filter: 'blur(50px)', opacity: 0.15, borderRadius: '50%' }}></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div style={{ padding: '1rem', borderRadius: '16px', background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`, color, border: `1px solid ${color}30`, boxShadow: `0 8px 32px ${color}15` }}>
        <Icon size={28} />
      </div>
    </div>
    <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{title}</h3>
    <p className="font-heading" style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--text-main)', background: `linear-gradient(135deg, #fff 0%, ${color} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      {value}
    </p>
  </motion.div>
);

const StatsGrid = ({ stats }) => {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
      <StatCard 
        title="Total Messages" 
        value={stats.totalMessages} 
        icon={MessageSquare} 
        color="#3b82f6" 
        delay={0.1}
      />
      <StatCard 
        title="Auto-Replies" 
        value={stats.automatedReplies} 
        icon={ShieldCheck} 
        color="#10b981" 
        delay={0.2}
      />
      <StatCard 
        title="Active Rules" 
        value={stats.activeRules} 
        icon={Activity} 
        color="#8b5cf6" 
        delay={0.3}
      />
    </div>
  );
};

export default StatsGrid;

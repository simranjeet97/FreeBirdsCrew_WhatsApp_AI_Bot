import React, { useState } from 'react';
import { ShieldCheck, Plus, Trash2, Power, Settings2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const RuleManager = ({ rules }) => {
  const [newRule, setNewRule] = useState({ trigger: '', response: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.trigger || !newRule.response) return;
    
    try {
      await axios.post('http://localhost:3001/api/rules', newRule);
      setNewRule({ trigger: '', response: '' });
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add rule', err);
    }
  };

  const handleDeleteRule = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/rules/${id}`);
    } catch (err) {
      console.error('Failed to delete rule', err);
    }
  };

  const handleToggleRule = async (id, enabled) => {
    try {
      await axios.patch(`http://localhost:3001/api/rules/${id}/toggle`, { enabled: !enabled });
    } catch (err) {
      console.error('Failed to toggle rule', err);
    }
  };

  return (
    <div className="glass" style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Settings2 size={20} color="var(--success)" />
          </div>
          <div>
            <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>Automation Engine</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logic triggers & responses</span>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary" 
          style={{ padding: '0.6rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> <span style={{ display: isAdding ? 'none' : 'inline' }}>New Rule</span>
        </button>
      </div>

      <div style={{ padding: '1.5rem', maxHeight: '500px', overflowY: 'auto' }}>
        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddRule} 
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Trigger keyword (e.g. metadata, pricing)" 
                  value={newRule.trigger}
                  onChange={e => setNewRule({ ...newRule, trigger: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem' }}
                />
                <textarea 
                  placeholder="Engine response payload..." 
                  value={newRule.response}
                  onChange={e => setNewRule({ ...newRule, response: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem' }}
                />
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Cancel</button>
                  <button type="submit" className="btn-primary">Deploy Rule</button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {rules.map(rule => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={rule.id} 
                className="glass-interactive" 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '16px',
                  background: rule.enabled ? 'rgba(139, 92, 246, 0.08)' : 'rgba(0,0,0,0.2)', 
                  border: rule.enabled ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                  opacity: rule.enabled ? 1 : 0.6,
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge" style={{ background: rule.enabled ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}>
                      ON MATCH
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600, wordBreak: 'break-word' }}>"{rule.trigger}"</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleToggleRule(rule.id, rule.enabled)}
                      style={{ background: rule.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.1)', color: rule.enabled ? 'var(--success)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '8px' }}
                      title={rule.enabled ? 'Disable' : 'Enable'}
                    >
                      <Power size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteRule(rule.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.5rem', borderRadius: '8px' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  {rule.response}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {rules.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '3rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              Engine logic empty. Deploy your first automation vector.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleManager;

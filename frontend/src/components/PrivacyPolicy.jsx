import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass" 
      style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <ShieldAlert size={36} color="var(--primary)" />
        <h2 className="font-heading text-gradient" style={{ fontSize: '2rem', margin: 0 }}>Privacy & Data Policy</h2>
      </div>

      <div style={{ display: 'grid', gap: '2rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
        <section>
          <h3 style={{ color: 'var(--primary-hover)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>1. Data Logging</h3>
          <p style={{ opacity: 0.9 }}>
            AutoBot logs incoming and outgoing WhatsApp messages exclusively for the purpose of analyzing bot performance, correcting model drift, and retaining chat context. Logs are stored securely within the local SQLite database.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary-hover)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>2. LLM Cloud Processing</h3>
          <p style={{ opacity: 0.9 }}>
            Incoming queries are securely transmitted to Google's Generative AI API (Gemini) for classification and generation. Please refrain from sending sensitive personal identifiers through the proxy.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary-hover)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>3. Local Deployment</h3>
          <p style={{ opacity: 0.9 }}>
            This application is designed to be run locally by the end-user. As the operator, you have total control over the <code>log.md</code> and databases directly situated in your file system. We do not aggregate your usage data remotely.
          </p>
        </section>
        
        <section style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
          <p style={{ margin: 0, color: 'var(--warning)', fontSize: '0.95rem' }}>
            <strong>DISCLAIMER:</strong> Ensure compliance with WhatsApp Terms of Service when running automated bots on personal or business accounts.
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;

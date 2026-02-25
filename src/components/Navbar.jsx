import { useState } from 'react';
import StarLogo from './StarLogo';
import ThemeToggle from './ThemeToggle';

const MORE_ITEMS = [
  'Bridge Terminal',
  'Flight Logs',
  'Migrate Assets',
  'DeFi Staking',
  'Presales',
  'Import Custom Network',
];

export default function Navbar({ page, setPage, theme, setTheme, connectedWallet, onConnectClick }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <nav onClick={() => setShowMore(false)}>
      <div className="nav-logo" onClick={() => setPage('swap')} style={{ cursor: 'pointer' }}>
        <div className="logo-star"><StarLogo /></div>
        RELAY
      </div>

      <div className="nav-links">
        <button className={`nav-link ${page === 'swap' ? 'active' : ''}`} onClick={() => setPage('swap')}>Swap</button>
        {/* <button className={`nav-link ${page === 'vaults' ? 'active' : ''}`} onClick={() => setPage('vaults')}>Vaults</button> */}
        <button className={`nav-link ${page === 'txs' ? 'active' : ''}`} onClick={() => setPage('txs')}>Flight Logs</button>

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
                <div key={item} className="more-item" onClick={() => setShowMore(false)}>{item}</div>
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
            {connectedWallet.icon} {connectedWallet.name.split(' ')[0]}
          </button>
        ) : (
          <button className="connect-btn" onClick={onConnectClick}>Connect</button>
        )}
      </div>
    </nav>
  );
}
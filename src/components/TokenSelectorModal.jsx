import { useState } from 'react';
import { CHAINS, TOKENS } from '../data/constants';

// Flatten all tokens across all chains into one searchable list
const ALL_TOKENS = Object.entries(TOKENS).flatMap(([chainId, tokens]) => {
  const chain = CHAINS.find(c => c.id === chainId);
  return tokens.map(t => ({ ...t, chainId, chainName: chain?.name || chainId, chainIcon: chain?.icon || '', chainColor: chain?.color || '#888' }));
});

const STARRED_CHAINS = ['arbitrum', 'base', 'ethereum', 'solana'];

export default function TokenSelectorModal({ onClose, onSelect, title = 'Select Token' }) {
  const [chainQ, setChainQ] = useState('');
  const [tokQ, setTokQ] = useState('');
  const [selChain, setSelChain] = useState('all');

  const filteredChains = chainQ
    ? CHAINS.filter(c => c.name.toLowerCase().includes(chainQ.toLowerCase()))
    : CHAINS;

  const starredChains = CHAINS.filter(c => STARRED_CHAINS.includes(c.id));
  const azChains = CHAINS.filter(c => !STARRED_CHAINS.includes(c.id));

  const filteredTokens = ALL_TOKENS.filter(t => {
    const matchChain = selChain === 'all' || t.chainId === selChain;
    const q = tokQ.toLowerCase();
    const matchQ = !tokQ || t.sym.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
    return matchChain && matchQ;
  });

  function ChainItem({ chain, isAll = false }) {
    const id = isAll ? 'all' : chain.id;
    return (
      <div
        className={`tsc-chain-item ${selChain === id ? 'sel' : ''}`}
        onClick={() => setSelChain(id)}
      >
        <div className="tsc-chain-ico" style={{ background: isAll ? '#ede9fe' : chain.bg }}>
          {isAll ? '🌐' : chain.icon}
        </div>
        <span>{isAll ? 'All Chains' : chain.name}</span>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="tsc-modal" onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div className="tsc-head">
          <span className="tsc-title">{title}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="tsc-body">
          {/* LEFT — CHAIN PANEL */}
          <div className="tsc-chain-panel">
            <div className="tsc-search-row">
              <span className="tsc-search-icon">🔍</span>
              <input
                autoFocus
                placeholder="Search chains"
                value={chainQ}
                onChange={e => setChainQ(e.target.value)}
              />
            </div>
            <div className="tsc-chain-list">
              {chainQ ? (
                <>
                  {filteredChains.length === 0
                    ? <div className="tsc-empty">No chains found</div>
                    : filteredChains.map(c => <ChainItem key={c.id} chain={c} />)
                  }
                </>
              ) : (
                <>
                  <ChainItem isAll />
                  <div className="tsc-section-label">★ Starred Chains</div>
                  {starredChains.map(c => <ChainItem key={c.id} chain={c} />)}
                  <div className="tsc-section-label">Chains A–Z</div>
                  {azChains.map(c => <ChainItem key={c.id} chain={c} />)}
                </>
              )}
            </div>
          </div>

          {/* RIGHT — TOKEN PANEL */}
          <div className="tsc-token-panel">
            <div className="tsc-search-row">
              <span className="tsc-search-icon">🔍</span>
              <input
                placeholder="Search for a token or paste address"
                value={tokQ}
                onChange={e => setTokQ(e.target.value)}
              />
            </div>
            <div className="tsc-section-label" style={{ padding: '10px 14px 4px' }}>
              Global 24H Volume
            </div>
            <div className="tsc-token-list">
              {filteredTokens.length === 0 ? (
                <div className="tsc-empty">No tokens found</div>
              ) : (
                filteredTokens.map((t, i) => (
                  <div
                    key={`${t.sym}-${t.chainId}-${i}`}
                    className="tsc-token-row"
                    onClick={() => { onSelect(t); onClose(); }}
                  >
                    <div className="tsc-tok-ico-wrap">
                      <div className="tsc-tok-ico" style={{ background: t.bg }}>
                        {t.icon}
                      </div>
                      <div className="tsc-tok-chain-badge" style={{ background: t.bg, color: t.chainColor }}>
                        {t.chainIcon}
                      </div>
                    </div>
                    <div className="tsc-tok-info">
                      <div className="tsc-tok-sym">{t.sym}</div>
                      <div className="tsc-tok-sub">{t.chainName}</div>
                    </div>
                    <div className="tsc-tok-bal">{t.bal}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

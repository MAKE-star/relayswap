import { useState, useEffect, useRef } from 'react';
import { CHAINS, TOKENS, WALLETS, genHash, fmtUSD } from '../data/constants';
import { TokenIcon, ChainIcon, TokenChainIcons } from './Icons';
import TokenSelectorModal from './TokenSelectorModal';
import { saveTransaction } from '../lib/supabase';

const STEP_ORDER = ['loading', 'confirm'];

const COINGECKO_IDS = {
  ETH: 'ethereum', BTC: 'bitcoin', WBTC: 'wrapped-bitcoin', WETH: 'weth',
  USDT: 'tether', USDC: 'usd-coin', USDS: 'usds', DAI: 'dai', BUSD: 'binance-usd',
  BNB: 'binancecoin', SOL: 'solana', AVAX: 'avalanche-2',
  POL: 'matic-network', ARB: 'arbitrum', OP: 'optimism', LINK: 'chainlink',
  UNI: 'uniswap', AAVE: 'aave', CAKE: 'pancakeswap-token', JUP: 'jupiter-exchange-solana',
  stETH: 'staked-ether', cbBTC: 'coinbase-wrapped-btc',
  'SHIBA INU': 'shiba-inu', PEPE: 'pepe', TRX: 'tron', TON: 'the-open-network',
  SUI: 'sui', CRO: 'crypto-com-chain', TRUMP: 'official-trump', RAY: 'raydium',
  NOT: 'notcoin', TWT: 'trust-wallet-token', WBNB: 'wbnb', XRP: 'ripple',
};

async function fetchPrices(symbols) {
  const ids = [...new Set(symbols.map(s => COINGECKO_IDS[s]).filter(Boolean))];
  if (!ids.length) return {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    const prices = {};
    for (const [sym, id] of Object.entries(COINGECKO_IDS)) {
      if (data[id]?.usd) prices[sym] = data[id].usd;
    }
    return prices;
  } catch {
    return {};
  }
}

function ProgressBar({ step }) {
  return (
    <div className="progress-bar-row">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className={`prog-seg ${
          step === 'confirm' ? 'done' :
          step === 'loading' && i === 0 ? 'active' : ''
        }`} />
      ))}
    </div>
  );
}

async function triggerEmail(tx) {
  try {
    await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(tx),
    });
  } catch (e) { console.error('Email trigger failed:', e); }
}

export default function SwapWidget({ connectedWallet, onConnectClick, mode, onModeChange, onViewExplorer, hasImported }) {
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
  const [progress,  setProgress]  = useState(0);
  const [blocksDone,setBlocksDone]= useState([false, false, false]);
  const [loadMsg,   setLoadMsg]   = useState('Broadcasting...');
  const [txHash,    setTxHash]    = useState('');
  const [savedAmt,  setSavedAmt]  = useState('');
  const [savedRec,  setSavedRec]  = useState('');
  const [savedTx,   setSavedTx]   = useState(null);

  const [livePrices, setLivePrices] = useState({});
  const [priceStatus, setPriceStatus] = useState('loading');
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  async function loadPrices() {
    const syms = [fromToken?.sym, toToken?.sym].filter(Boolean);
    const prices = await fetchPrices(syms);
    if (Object.keys(prices).length > 0) {
      setLivePrices(prev => ({ ...prev, ...prices }));
      setPriceStatus('live');
      setLastUpdated(new Date());
    } else {
      setPriceStatus('error');
    }
  }

  useEffect(() => {
    loadPrices();
    intervalRef.current = setInterval(loadPrices, 30000);
    return () => clearInterval(intervalRef.current);
  }, [fromToken?.sym, toToken?.sym]);

  const fromPrice = livePrices[fromToken?.sym] ?? fromToken?.price ?? 0;
  const toPrice   = livePrices[toToken?.sym]   ?? toToken?.price   ?? 0;

  const displaySlip = slippage === 'custom' ? (customSlip || '—') : slippage;
  const rate    = fromPrice && toPrice ? fromPrice / toPrice : 0;
  const rawReceive = amount && rate && toToken ? parseFloat(amount) * rate : null;
  const receive = rawReceive !== null ? (() => {
    const intLen = Math.floor(rawReceive).toString().length;
    const decimals = intLen >= 8 ? 0 : intLen >= 6 ? 1 : intLen >= 4 ? 2 : intLen >= 2 ? 4 : 6;
    return rawReceive.toFixed(decimals);
  })() : '';
  const usdFrom = amount && fromPrice ? fmtUSD(parseFloat(amount) * fromPrice) : '';
  const usdTo   = receive && toPrice  ? fmtUSD(parseFloat(receive) * toPrice)  : '';

  const canProceed = hasImported
    ? amount && parseFloat(amount) > 0 && fromToken && toToken && parseFloat(amount) <= parseFloat(fromToken.bal || '0')
    : amount && parseFloat(amount) > 0 && fromToken && toToken;
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

    const hash = genHash();
    setSavedAmt(amount);
    setSavedRec(receive || '0');
    setTxHash(hash);
    setProgress(0);
    setBlocksDone([false, false, false]);
    setLoadMsg('Broadcasting...');
    setStep('loading');

    let p = 0;
    const msgs = ['Broadcasting...', 'Confirming on-chain...', 'Validating route...', 'Finalizing...'];

    const iv = setInterval(async () => {
      p = Math.min(100, p + Math.random() * 9 + 3);
      setProgress(Math.round(p));
      if (p > 28) setLoadMsg(msgs[1]);
      if (p > 55) { setLoadMsg(msgs[2]); setBlocksDone(b => [true, b[1], b[2]]); }
      if (p > 78) { setLoadMsg(msgs[3]); setBlocksDone(b => [true, true, b[2]]); }
      if (p >= 100) {
        setBlocksDone([true, true, true]);
        clearInterval(iv);
        const txRecord = {
          tx_hash: hash,
          wallet_address: connectedWallet.address || '0xDEMO',
          wallet_name: connectedWallet.name,
          from_token: fromToken.sym,
          to_token: toToken.sym,
          from_amount: parseFloat(amount),
          to_amount: parseFloat(receive || '0'),
          from_chain: fromChain.name,
          to_chain: mode === 'bridge' ? toChain.name : fromChain.name,
          mode, status: 'confirmed',
        };
        const saved = await saveTransaction(txRecord);
        setSavedTx(saved);
        setTimeout(() => setStep('confirm'), 500);
      }
    }, 350);
  }

  async function handleConfirmAction(action) {
    if (savedTx) await triggerEmail(savedTx);
    reset();
    if (action === 'explorer') onViewExplorer?.();
  }

  function reset() {
    setStep('main'); setAmount(''); setProgress(0); setSavedTx(null);
    setToToken(TOKENS[fromChain.id]?.[1] ?? TOKENS[fromChain.id]?.[0] ?? null);
  }

  /* ── MAIN ── */
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

        {/* HEADER */}
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
              </div>
            )}
          </div>
        </div>

        {/* PRICE STATUS BAR */}
        <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: priceStatus === 'live' ? 'var(--green)' : priceStatus === 'error' ? 'var(--red)' : 'var(--orange)',
            animation: priceStatus === 'live' ? 'pulse-dot 2s infinite' : 'none',
          }} />
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', letterSpacing: 0.5 }}>
            {priceStatus === 'live'
              ? `LIVE · refreshes in 30s · ${lastUpdated ? lastUpdated.toLocaleTimeString() : ''}`
              : priceStatus === 'error' ? 'PRICE FEED UNAVAILABLE · using cached prices'
              : 'FETCHING PRICES...'}
          </span>
        </div>

        {/* MODE TABS */}
        <div className="mode-tabs">
          {['swap', 'bridge'].map(m => (
            <button key={m} className={`mode-tab ${mode === m ? 'active' : ''}`}
              onClick={() => handleModeChange(m)}>
              {m === 'swap' ? '⇄ SWAP' : '⛓ BRIDGE'}
            </button>
          ))}
        </div>

        {/* YOU PAY */}
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
              <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                <input className="tb-amount" placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  style={{ opacity: amount.length > 6 ? 0 : 1, position: amount.length > 6 ? 'absolute' : 'relative', right: 0 }} />
                {amount.length > 6 && (
                  <div className="tb-amount" style={{ color: 'var(--text)', pointerEvents: 'none' }}>
                    {amount.slice(0, 6)}…
                  </div>
                )}
                {amount.length > 6 && (
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', marginTop: 2 }}>
                    {amount} {fromToken?.sym}
                  </div>
                )}
              </div>
            </div>
            {usdFrom && <div className="tb-usd">≈ {usdFrom}</div>}
            {fromPrice > 0 && fromToken && (
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', marginTop: 2 }}>
                1 {fromToken.sym} = ${fromPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
            )}
            {amount && fromToken && hasImported && parseFloat(amount) > parseFloat(fromToken.bal || '0') && (
              <div style={{ fontSize: 11, color: '#ff4d4d', fontWeight: 600, marginTop: 6, letterSpacing: 0.5 }}>
                ⚠ Insufficient balance
              </div>
            )}
          </div>
        </div>

        {/* ARROW */}
        <div className="swap-divider">
          <button className="swap-center-btn" onClick={flip}>⇅</button>
        </div>

        {/* YOU RECEIVE */}
        <div className="section-block" style={{ paddingBottom: 8 }}>
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
              <div style={{ flex: 1, textAlign: 'right', minWidth: 0 }}>
                <div className="tb-receive" style={{ color: receive ? 'var(--green)' : 'var(--text3)' }}>
                  {receive && receive.length > 9 ? receive.slice(0, 8) + '…' : (receive || '0.000000')}
                </div>
                {receive && receive.length > 9 && (
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', marginTop: 2 }}>
                    {receive} {toToken?.sym}
                  </div>
                )}
              </div>
            </div>
            {usdTo && <div className="tb-usd" style={{ color: 'var(--green)', opacity: 0.8 }}>≈ {usdTo}</div>}
            {toPrice > 0 && toToken && (
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', marginTop: 2 }}>
                1 {toToken.sym} = ${toPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
            )}
          </div>
        </div>

        {/* QUOTE */}
        <div className="section-block" style={{ paddingBottom: 4 }}>
          <div className="quote-box">
            <div className="quote-row"><span className="qk">Rate</span><span className="qv">{canProceed ? `1 ${fromToken.sym} = ${rate.toFixed(6)} ${toToken?.sym}` : '—'}</span></div>
            <div className="quote-row"><span className="qk">Slippage</span><span className="qv good">{displaySlip}%</span></div>
            <div className="quote-row"><span className="qk">Est. Gas</span><span className="qv">{canProceed ? '~$0.45' : '—'}</span></div>
            <div className="quote-row"><span className="qk">Route</span><span className="qv good">{canProceed ? 'RELAY ▸ BEST' : '—'}</span></div>
            {mode === 'bridge' && <div className="quote-row"><span className="qk">Est. Time</span><span className="qv">{canProceed ? '~2–4s' : '—'}</span></div>}
          </div>
        </div>

        {/* CTA */}
        <button
          className="action-btn purple"
          onClick={startSwap}
          style={{ opacity: canProceed ? 1 : 0.45, cursor: canProceed ? 'pointer' : 'not-allowed' }}
        >
          {ctaLabel}
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
      <ProgressBar step="loading" />
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
      <ProgressBar step="confirm" />
      <div className="confirm-body">
        <div className="success-icon">✓</div>
        <div className="confirm-h">{mode === 'swap' ? 'Swap' : 'Bridge'} Successful</div>
        <div className="confirm-p">Confirmed in ~2.3s · {new Date().toLocaleTimeString()}</div>
        <div className="confirm-table">
          <div className="ct-row"><span className="ct-k">Sold</span><span className="ct-v">{savedAmt} {fromToken?.sym} on {fromChain.name}</span></div>
          <div className="ct-row"><span className="ct-k">Received</span><span className="ct-v green">{savedRec} {toToken?.sym}{mode === 'bridge' ? ` on ${toChain.name}` : ''}</span></div>
          <div className="ct-row"><span className="ct-k">Via</span><span className="ct-v">{connectedWallet?.icon} {connectedWallet?.name}</span></div>
          <div className="ct-row"><span className="ct-k">Status</span><span className="ct-v green">✓ Confirmed (3/3 blocks)</span></div>
        </div>
        <div className="hash-box">Tx Hash<br /><span>{txHash}</span></div>
        <button className="action-btn purple"
          onClick={() => handleConfirmAction('new')}
          style={{ width: '100%', margin: '0 0 8px', display: 'block' }}>
          New Transaction
        </button>
        <button className="action-btn outline"
          onClick={() => handleConfirmAction('explorer')}
          style={{ width: '100%', margin: 0, display: 'block' }}>
          View on Explorer ↗
        </button>
      </div>
    </div>
  );
}
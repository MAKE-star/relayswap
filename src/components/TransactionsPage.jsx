import { useState } from 'react';
import { MOCK_TXS } from '../data/constants';

export default function TransactionsPage() {
  const [filter, setFilter] = useState('');

  const rows = MOCK_TXS.filter(t =>
    !filter ||
    t.from.toLowerCase().includes(filter.toLowerCase()) ||
    t.sender.includes(filter)
  );

  return (
    <div className="tx-page">
      <div className="tx-page-title">Transactions</div>

      <div className="tx-filters">
        <div className="tx-search">
          <span style={{ color: 'var(--text3)' }}>🔍</span>
          <input
            placeholder="Filter by wallet address, ENS, or transaction hash"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="live-label"><div className="live-dot" /> Live</div>
        <div className="filter-select">Route</div>
        <div className="filter-select">From: All Chains ▾</div>
        <div style={{ color: 'var(--text3)', fontSize: 13 }}>⇄</div>
        <div className="filter-select">To: All Chains ▾</div>
      </div>

      <div className="tx-table">
        <div className="tx-thead">
          <div>From</div>
          <div>To</div>
          <div>Transactions</div>
          <div>Status</div>
          <div>Fill Time</div>
        </div>
        {rows.map((tx, i) => (
          <div className="tx-row" key={i}>
            <div className="tx-from">
              <div className="tx-amt">
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: tx.fromColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 }}>
                  {tx.fromIcon}
                </div>
                {tx.from}
              </div>
              <div className="tx-addr">Sender: <span>{tx.sender}</span></div>
            </div>

            <div className="tx-from">
              {tx.to && (
                <div className="tx-amt">
                  {tx.toIcon && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: tx.toColor + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0 }}>
                      {tx.toIcon}
                    </div>
                  )}
                  {tx.to}
                </div>
              )}
              <div className="tx-addr">Recipient: <span>{tx.recipient}</span></div>
            </div>

            <div>
              <div className="tx-hash-cell">Deposit: <span>{tx.deposit}</span></div>
              {tx.fill && <div className="tx-hash-cell">Fill: <span>{tx.fill}</span></div>}
            </div>

            <div>
              <div className={`status-pill ${tx.status}`}>
                {tx.status === 'success' ? '✓ Success' : '⟳ Processing'}
              </div>
              <div className="tx-time" style={{ marginTop: 4 }}>{tx.time}</div>
            </div>

            <div className="tx-time">
              {tx.status === 'success' ? (i % 3 === 0 ? '1s' : i % 3 === 1 ? '2s' : '—') : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

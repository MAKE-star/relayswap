import { useState } from 'react';

export default function Dropdown({ items, onSelect, selected, renderItem, header, searchable, className, style }) {
  const [q, setQ] = useState('');

  const filtered = q
    ? items.filter(i => (i.name || i.sym || i.symbol || '').toLowerCase().includes(q.toLowerCase()))
    : items;

  return (
    <div className={`dd-menu ${className || ''}`} style={style} onClick={e => e.stopPropagation()}>
      {searchable && (
        <div className="dd-search">
          <span style={{ color: 'var(--text3)' }}>🔍</span>
          <input autoFocus placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      )}
      {header && <div className="dd-head">{header}</div>}
      {filtered.map((item, i) => (
        <div
          key={i}
          className={`dd-item ${selected && (selected === item.id || selected === item.sym) ? 'sel' : ''}`}
          onClick={() => onSelect(item)}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export function ChainIcon({ chain, size = 24, style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: chain.bg || '#222',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.45, flexShrink: 0, ...style
    }}>
      {chain.icon}
    </div>
  );
}

export function TokenIcon({ token, size = 24, style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: token.bg || '#222',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.45, flexShrink: 0, ...style
    }}>
      {token.icon}
    </div>
  );
}

export function TokenChainIcons({ token, chain, size = 24 }) {
  return (
    <div style={{ position: 'relative', width: size + 12, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: size, height: size, borderRadius: '50%',
        background: chain.bg || '#222',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.44, zIndex: 1
      }}>
        {chain.icon}
      </div>
      <div style={{
        position: 'absolute', left: size * 0.45, top: 0,
        width: size, height: size, borderRadius: '50%',
        background: token.bg || '#222',
        border: '2px solid var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.44, zIndex: 2
      }}>
        {token.icon}
      </div>
    </div>
  );
}

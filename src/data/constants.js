export const CHAINS = [
  { id: 'ethereum', name: 'Ethereum', short: 'ETH', icon: '⟠', color: '#627EEA', bg: '#1a1f3a' },
  { id: 'base', name: 'Base', short: 'Base', icon: '🔵', color: '#0052FF', bg: '#0d1a3a' },
  { id: 'arbitrum', name: 'Arbitrum', short: 'ARB', icon: '△', color: '#12AAFF', bg: '#0d2030' },
  { id: 'optimism', name: 'Optimism', short: 'OP', icon: '🔴', color: '#FF0420', bg: '#3a0d0d' },
  { id: 'polygon', name: 'Polygon', short: 'MATIC', icon: '⬡', color: '#8247E5', bg: '#1e0d3a' },
  { id: 'bnb', name: 'BNB Chain', short: 'BNB', icon: '◈', color: '#F3BA2F', bg: '#2a2000' },
  { id: 'solana', name: 'Solana', short: 'SOL', icon: '◎', color: '#9945FF', bg: '#1a0d30' },
  { id: 'avalanche', name: 'Avalanche', short: 'AVAX', icon: '▲', color: '#E84142', bg: '#300d0d' },
  { id: 'zksync', name: 'zkSync', short: 'ZK', icon: '⚡', color: '#1755F4', bg: '#0d1530' },
  { id: 'scroll', name: 'Scroll', short: 'SCR', icon: 'S', color: '#EFBA6A', bg: '#2a1e00' },
];

export const TOKENS = {
  ethereum: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '1.248' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '2840.00' },
    { sym: 'USDT', name: 'Tether', price: 1.00, icon: '₮', color: '#26A17B', bg: '#0d2a1e', bal: '500.00' },
    { sym: 'WBTC', name: 'Wrapped BTC', price: 67420, icon: '₿', color: '#F7931A', bg: '#2a1a0d', bal: '0.012' },
    { sym: 'LINK', name: 'Chainlink', price: 14.82, icon: '⬡', color: '#375BD2', bg: '#0d1230', bal: '42.0' },
    { sym: 'UNI', name: 'Uniswap', price: 8.41, icon: '🦄', color: '#FF007A', bg: '#2a0d18', bal: '15.5' },
    { sym: 'PEPE', name: 'Pepe', price: 0.0000138, icon: '🐸', color: '#3cba54', bg: '#0d2a12', bal: '12000000' },
  ],
  base: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.5' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '1200.00' },
    { sym: 'AERO', name: 'Aerodrome', price: 1.24, icon: '✈', color: '#0052FF', bg: '#0d1a3a', bal: '820.0' },
    { sym: 'BRETT', name: 'Brett', price: 0.082, icon: '🎩', color: '#4488cc', bg: '#0d1a2a', bal: '500' },
  ],
  arbitrum: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.8' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '400.00' },
    { sym: 'ARB', name: 'Arbitrum', price: 1.24, icon: '△', color: '#12AAFF', bg: '#0d2030', bal: '300.0' },
    { sym: 'GMX', name: 'GMX', price: 28.4, icon: 'G', color: '#00d4ff', bg: '#001a20', bal: '5.2' },
  ],
  optimism: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.3' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '600.00' },
    { sym: 'OP', name: 'Optimism', price: 2.18, icon: '🔴', color: '#FF0420', bg: '#3a0d0d', bal: '120.0' },
  ],
  polygon: [
    { sym: 'POL', name: 'Polygon', price: 0.892, icon: '⬡', color: '#8247E5', bg: '#1e0d3a', bal: '500.0' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '300.00' },
    { sym: 'WETH', name: 'Wrapped ETH', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.1' },
  ],
  bnb: [
    { sym: 'BNB', name: 'BNB', price: 412.3, icon: '◈', color: '#F3BA2F', bg: '#2a2000', bal: '2.5' },
    { sym: 'USDT', name: 'Tether', price: 1.00, icon: '₮', color: '#26A17B', bg: '#0d2a1e', bal: '800.00' },
    { sym: 'CAKE', name: 'PancakeSwap', price: 2.41, icon: '🥞', color: '#1FC7D4', bg: '#0d2a2a', bal: '40.0' },
  ],
  solana: [
    { sym: 'SOL', name: 'Solana', price: 178.4, icon: '◎', color: '#9945FF', bg: '#1a0d30', bal: '8.2' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '200.00' },
    { sym: 'JUP', name: 'Jupiter', price: 0.82, icon: '♃', color: '#C7B26A', bg: '#2a2000', bal: '500.0' },
  ],
  avalanche: [
    { sym: 'AVAX', name: 'Avalanche', price: 38.72, icon: '▲', color: '#E84142', bg: '#300d0d', bal: '12.0' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '150.00' },
  ],
  zksync: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.2' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '500.00' },
  ],
  scroll: [
    { sym: 'ETH', name: 'Ethereum', price: 3241.5, icon: '⟠', color: '#627EEA', bg: '#1a1f3a', bal: '0.15' },
    { sym: 'USDC', name: 'USD Coin', price: 1.00, icon: '$', color: '#2775CA', bg: '#0d1a2a', bal: '100.00' },
  ],
};

export const WALLETS = [
  { id: 'metamask',      icon: '🦊', name: 'MetaMask',          desc: 'Browser Extension',      badge: 'Installed' },
  { id: 'abstract',      icon: '🎨', name: 'Abstract',          desc: 'Smart Account',           badge: 'Installed' },
  { id: 'coinbase',      icon: '🔵', name: 'Coinbase Wallet',   desc: 'Coinbase Ecosystem' },
  { id: 'walletconnect', icon: '🔗', name: 'WalletConnect',     desc: 'Scan QR Code' },
  { id: 'rainbow',       icon: '🌈', name: 'Rainbow',           desc: 'Mobile & Extension' },
  { id: 'phantom',       icon: '👻', name: 'Phantom',           desc: 'Multichain' },
  { id: 'zerion',        icon: '⚡', name: 'Zerion',            desc: 'DeFi Wallet' },
  { id: 'okx',           icon: '⭕', name: 'OKX Wallet',        desc: 'OKX Ecosystem' },
  { id: 'trust',         icon: '🛡️', name: 'Trust Wallet',      desc: 'Mobile & Extension' },
  { id: 'binance',       icon: '🟡', name: 'Binance Web3',      desc: 'Binance Ecosystem' },
  { id: 'exodus',        icon: '🌌', name: 'Exodus',            desc: 'Desktop & Mobile' },
  { id: 'rabby',         icon: '🐰', name: 'Rabby Wallet',      desc: 'DeFi Focused' },
  { id: 'argent',        icon: '🔷', name: 'Argent',            desc: 'Smart Account' },
  { id: 'zengo',         icon: '🔐', name: 'ZenGo',             desc: 'Keyless Wallet' },
  { id: 'cryptocom',     icon: '🔵', name: 'Crypto.com Wallet', desc: 'Crypto.com Ecosystem' },
  { id: 'atomic',        icon: '⚛️', name: 'Atomic Wallet',     desc: 'Multi-Asset' },
  { id: 'gem',           icon: '💎', name: 'Gem Wallet',        desc: 'XRP & Multi-Chain' },
  { id: 'tangem',        icon: '💳', name: 'Tangem',            desc: 'Hardware Card Wallet' },
  { id: 'solflare',      icon: '🌞', name: 'Solflare',          desc: 'Solana Native' },
  { id: 'kraken',        icon: '🐙', name: 'Kraken Wallet',     desc: 'By Kraken Exchange' },
  { id: 'uphold',        icon: '🔼', name: 'Uphold',            desc: 'Multi-Asset Platform' },
  { id: 'coin98',        icon: '🪙', name: 'Coin98 Wallet',     desc: 'DeFi & GameFi' },
  { id: 'bestwallet',    icon: '⭐', name: 'Best Wallet',       desc: 'Web3 Super App' },
  { id: '1inch',         icon: '🦋', name: '1inch Wallet',      desc: 'DEX Aggregator Wallet' },
  { id: 'safepal',       icon: '🔒', name: 'SafePal',           desc: 'Hardware & Software' },
  { id: 'hotwallet',     icon: '🔥', name: 'Hot Wallet',        desc: 'Solana Ecosystem' },
  { id: 'keplr',         icon: '🌐', name: 'Keplr Wallet',      desc: 'Cosmos Ecosystem' },
  { id: 'tomi',          icon: '🌀', name: 'Tomi Wallet',       desc: 'Web3 Privacy Wallet' },
  { id: 'kucoin',        icon: '🟢', name: 'KuCoin Web3',       desc: 'KuCoin Ecosystem' },
  { id: 'bybit',         icon: '🔶', name: 'Bybit Web3',        desc: 'Bybit Ecosystem' },
  { id: 'ledger',        icon: '📟', name: 'Ledger',            desc: 'Hardware Wallet' },
];

export const TRENDING = [
  { sym: 'PIPPIN', icon: '🐴', color: '#88aaff' },
  { sym: 'RIBBIT', icon: '🐸', color: '#44cc66' },
  { sym: 'NEIRO', icon: '🐕', color: '#ffaa22' },
  { sym: 'MOODENG', icon: '🦛', color: '#cc88ff' },
  { sym: 'VIRTUAL', icon: '⚡', color: '#00ccff' },
];

export const MOCK_TXS = [
  { from: '0.0001 ETH', fromIcon: '⟠', fromColor: '#627EEA', to: '0.0001 ETH', toIcon: '⟠', toColor: '#627EEA', sender: '0x60...1f89', recipient: '0x60...1F89', deposit: '0x21...8884', fill: '', status: 'processing', time: '2s ago' },
  { from: '< 0.0001 WETH', fromIcon: '⟠', fromColor: '#627EEA', to: '0.0279 BERA', toIcon: '🐻', toColor: '#aa8844', sender: '0x61...c330', recipient: '0x61...c330', deposit: '0x6b...2c19', fill: '', status: 'success', time: '4s ago' },
  { from: '1.7 USDC.e', fromIcon: '$', fromColor: '#2775CA', to: '1.6955 USDC', toIcon: '$', toColor: '#2775CA', sender: '0x61...dabd', recipient: '0xe8...8c43', deposit: '0x2e...b267', fill: '0x22...03e2', status: 'success', time: '6s ago' },
  { from: '499.6 USDC', fromIcon: '$', fromColor: '#2775CA', to: '—', toIcon: '', toColor: '', sender: '0xpp...ao.eth', recipient: '0xA7...f1cC', deposit: '0x7d...c2fe', fill: '', status: 'processing', time: '8s ago' },
  { from: '1,107,959 BOTCOIN', fromIcon: '₿', fromColor: '#F7931A', to: '29.696 USDC', toIcon: '$', toColor: '#2775CA', sender: '0x4f...b881', recipient: '95A6...GLe8', deposit: '0xe7...6c65', fill: '5AvZ...rwTv', status: 'success', time: '10s ago' },
  { from: '10 USDC.e', fromIcon: '$', fromColor: '#2775CA', to: '9.9492 USDT', toIcon: '₮', toColor: '#26A17B', sender: '0xf2...080d', recipient: '0xAD...E0cc', deposit: '0x32...6103', fill: '0xc5...a73a', status: 'success', time: '14s ago' },
  { from: '184.74 USDC.e', fromIcon: '$', fromColor: '#2775CA', to: '184.58 USDC', toIcon: '$', toColor: '#2775CA', sender: '0xd2...2856', recipient: '0x71...4e21', deposit: '0xa9...7a0b', fill: '0xad...7b4a', status: 'success', time: '16s ago' },
];

export const VAULTS = [
  { sym: 'ETH', chain: 'Ethereum', chainIcon: '⟠', chainColor: '#627EEA', apy: 3.95, tvlUsd: '$886K', tvlToken: '475.828 ETH' },
  { sym: 'ETH', chain: 'Arbitrum', chainIcon: '△', chainColor: '#12AAFF', apy: 2.61, tvlUsd: '$124K', tvlToken: '66.438 ETH' },
  { sym: 'USDC', chain: 'Base', chainIcon: '🔵', chainColor: '#0052FF', apy: 4.12, tvlUsd: '$2.1M', tvlToken: '2,100,000 USDC' },
  { sym: 'USDC', chain: 'Optimism', chainIcon: '🔴', chainColor: '#FF0420', apy: 3.44, tvlUsd: '$540K', tvlToken: '540,000 USDC' },
];

export const genHash = () =>
  '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');

export const fmtUSD = (n) =>
  n ? `$${parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SwapWidget from './components/SwapWidget';
import TransactionsPage from './components/TransactionsPage';
import VaultsPage from './components/VaultsPage';
import WalletModal from './components/WalletModal';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [page, setPage] = useState('swap');
  const [swapMode, setSwapMode] = useState('swap');
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [tempWallet, setTempWallet] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  function handleWalletConnect() {
    if (connectedWallet) setConnectedWallet(null);
    else setShowWalletModal(true);
  }

  // Called by WalletModal after BIP-39 + address steps complete
  function handleWalletContinue() {
    if (tempWallet) {
      setConnectedWallet(tempWallet);
      setShowWalletModal(false);
      setTempWallet(null);
    }
  }

  const subTitle =
    page === 'txs'        ? 'Flight Logs' :
    swapMode === 'bridge' ? 'Relay Bridge' : 'Relay Swap';

  return (
    <>
      {/* BACKGROUND */}
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      {/* NAVBAR */}
      <Navbar
        page={page}
        setPage={setPage}
        theme={theme}
        setTheme={setTheme}
        connectedWallet={connectedWallet}
        onConnectClick={handleWalletConnect}
      />

      {/* SUB-HEADER */}
      <div className="sub-header">
        <div className="sub-title">
          <div className="sub-title-dot" />
          · {subTitle}
        </div>
        <div className="sub-stats">
          <div className="sub-stat">VOL 24H <span>$2.4B</span></div>
          <div className="sub-stat">TVL <span>$18.7B</span></div>
          <div className="sub-stat">GAS <span>12 GWEI</span></div>
          <div className="sub-stat">BLOCK <span>#21,847,293</span></div>
        </div>
      </div>

      {/* SWAP PAGE */}
      {page === 'swap' && (
        <div className="page-centered">
          <SwapWidget
            connectedWallet={connectedWallet}
            onConnectClick={() => setShowWalletModal(true)}
            mode={swapMode}
            onModeChange={setSwapMode}
            onViewExplorer={() => setPage('txs')}
          />
        </div>
      )}

      {/* {page === 'vaults' && <VaultsPage />} */}
      {page === 'txs' && <TransactionsPage />}

      {/* WALLET MODAL */}
      {showWalletModal && (
        <WalletModal
          onClose={() => { setShowWalletModal(false); setTempWallet(null); }}
          onSelect={setTempWallet}
          selectedWallet={tempWallet}
          showContinue={false}
          onContinue={handleWalletContinue}
        />
      )}

      <ChatWidget />
    </>
  );
}
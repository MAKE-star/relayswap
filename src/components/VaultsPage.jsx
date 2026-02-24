import { VAULTS } from '../data/constants';
import StarLogo from './StarLogo';

export default function VaultsPage() {
  return (
    <div className="vaults-page">
      <div className="vaults-main">
        <div className="section-title">Your Positions</div>
        <div className="positions-empty">
          Connect your wallet to see your positions.
          <a href="#">Connect Wallet</a>
        </div>

        <div className="section-title">Top Vaults</div>
        <div className="vaults-table">
          <div className="vt-head">
            <div>Vault</div>
            <div>APY ⇅</div>
            <div>TVL ⇅</div>
          </div>
          {VAULTS.map((v, i) => (
            <div className="vt-row" key={i}>
              <div className="vt-name">
                <div className="vault-icon-wrap">
                  <div className="vault-icon-back" style={{ background: '#627EEA22' }}>⟠</div>
                  <div className="vault-icon-front" style={{ background: v.chainColor + '22' }}>{v.chainIcon}</div>
                </div>
                <div>
                  <div>{v.sym}</div>
                  <div className="vt-chain">{v.chain}</div>
                </div>
              </div>
              <div className="vt-apy">{v.apy}%</div>
              <div>
                <div className="vt-tvl">{v.tvlUsd}</div>
                <div className="vt-tvl-sub">{v.tvlToken}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vaults-side">
        <div className="side-logo">
          <StarLogo />
          <span className="side-logo-txt">RELAY ✳ Vaults</span>
        </div>
        <div className="side-desc">
          Earn fees by lending funds to the Relay Vault Protocol for use in bridging.
          With Relay Vaults, you'll earn premium bridge yield from bridging fees when
          the bridge is utilized as well as base yield.
        </div>
        <div className="side-link">Learn More →</div>
      </div>
    </div>
  );
}

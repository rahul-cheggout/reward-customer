import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const BRANDS = [
  {
    id: 'amazon',
    name: 'Amazon Shopping Voucher',
    icon: 'shopping_bag',
    badge: 'Most Popular',
    color: '#FF9900',
    denominations: [
      { val: 250, pts: 1000 },
      { val: 500, pts: 2000 },
      { val: 1000, pts: 4000 },
      { val: 2500, pts: 10000 }
    ]
  },
  {
    id: 'flipkart',
    name: 'Flipkart Gift Card',
    icon: 'storefront',
    badge: 'Trending',
    color: '#2874F0',
    denominations: [
      { val: 250, pts: 1000 },
      { val: 500, pts: 2000 },
      { val: 1000, pts: 4000 },
      { val: 2500, pts: 10000 }
    ]
  },
  {
    id: 'swiggy',
    name: 'Swiggy Food & Dineout',
    icon: 'restaurant',
    badge: 'Instant Delivery',
    color: '#FC8019',
    denominations: [
      { val: 250, pts: 1000 },
      { val: 500, pts: 2000 },
      { val: 1000, pts: 4000 }
    ]
  },
  {
    id: 'croma',
    name: 'Croma Electronics',
    icon: 'devices',
    badge: '10% Extra Value',
    color: '#00B5B8',
    denominations: [
      { val: 500, pts: 2000 },
      { val: 1000, pts: 4000 },
      { val: 2500, pts: 10000 },
      { val: 5000, pts: 20000 }
    ]
  }
];

export function RedeemModal({ isOpen, onClose, currentPoints = 14850, onRedeemSuccess }) {
  const toast = useToast();
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [selectedDenom, setSelectedDenom] = useState(BRANDS[0].denominations[1]); // ₹500 default
  const [claimedVoucher, setClaimedVoucher] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const pointsRequired = selectedDenom.pts;
  const remainingPoints = Math.max(0, currentPoints - pointsRequired);
  const canAfford = currentPoints >= pointsRequired;

  const handleClaim = () => {
    if (!canAfford) {
      toast.error('Insufficient points for this voucher.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const code = `${selectedBrand.id.toUpperCase()}-IOB-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setClaimedVoucher({
        brand: selectedBrand.name,
        value: selectedDenom.val,
        points: pointsRequired,
        code
      });
      toast.success(`Successfully claimed ₹${selectedDenom.val} ${selectedBrand.name}!`);
      if (onRedeemSuccess) {
        onRedeemSuccess(pointsRequired, {
          merchant: `${selectedBrand.name} ₹${selectedDenom.val}`,
          date: new Date().toISOString(),
          points: -pointsRequired,
          type: 'redeemed'
        });
      }
    }, 1200);
  };

  const copyVoucherCode = () => {
    if (claimedVoucher?.code) {
      navigator.clipboard.writeText(claimedVoucher.code);
      toast.info('Voucher code copied to clipboard!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card redeem-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="material-icons modal-icon-gold">redeem</span>
            <div>
              <h3>Instant Reward Redemption</h3>
              <p>Redeem your IOB points for official brand gift vouchers</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <span className="material-icons">close</span>
          </button>
        </div>

        {!claimedVoucher ? (
          <>
            {/* Brand Selector */}
            <div className="modal-brand-tabs">
              {BRANDS.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className={`brand-tab-btn ${selectedBrand.id === brand.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedDenom(brand.denominations[0]);
                  }}
                >
                  <span className="material-icons" style={{ color: brand.color }}>
                    {brand.icon}
                  </span>
                  <span>{brand.name.split(' ')[0]}</span>
                  {brand.badge && <span className="tab-badge">{brand.badge}</span>}
                </button>
              ))}
            </div>

            {/* Denomination Selector */}
            <div className="denom-section">
              <label className="section-label">Select Voucher Amount</label>
              <div className="denom-grid">
                {selectedBrand.denominations.map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    className={`denom-btn ${selectedDenom.val === d.val ? 'selected' : ''}`}
                    onClick={() => setSelectedDenom(d)}
                  >
                    <span className="denom-value">₹{d.val}</span>
                    <span className="denom-pts">{d.pts.toLocaleString('en-IN')} Pts</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Points Summary Calculation Card */}
            <div className="redemption-calc-card">
              <div className="calc-row">
                <span>Available Points:</span>
                <strong>{currentPoints.toLocaleString('en-IN')} Pts</strong>
              </div>
              <div className="calc-row text-gold">
                <span>Voucher Points Required:</span>
                <strong>- {pointsRequired.toLocaleString('en-IN')} Pts</strong>
              </div>
              <div className="calc-divider" />
              <div className="calc-row calc-total">
                <span>Points Balance After Claim:</span>
                <span className={canAfford ? 'balance-safe' : 'balance-low'}>
                  {remainingPoints.toLocaleString('en-IN')} Pts
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-btn-confirm"
                disabled={!canAfford || isProcessing}
                onClick={handleClaim}
              >
                {isProcessing ? (
                  <>
                    <span className="btn-spinner" /> Generating Voucher…
                  </>
                ) : (
                  <>
                    <span className="material-icons">check_circle</span>
                    Confirm & Claim (₹{selectedDenom.val})
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Voucher Claimed Success View */
          <div className="voucher-success-box">
            <div className="success-icon-wrap">
              <span className="material-icons success-star">celebration</span>
            </div>
            <h4>Voucher Successfully Generated!</h4>
            <p className="success-sub">
              ₹{claimedVoucher.value} {claimedVoucher.brand} has been issued and credited to your account.
            </p>

            <div className="voucher-display-ticket">
              <span className="ticket-label">VOUCHER CLAIM CODE</span>
              <div className="ticket-code-row">
                <code>{claimedVoucher.code}</code>
                <button
                  type="button"
                  className="ticket-copy-btn"
                  onClick={copyVoucherCode}
                  title="Copy code"
                >
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
              <span className="ticket-validity">Valid for 12 months • Non-transferable</span>
            </div>

            <div className="modal-footer justify-center">
              <button
                type="button"
                className="modal-btn-confirm"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

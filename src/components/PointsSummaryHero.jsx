import React, { useState } from 'react';

export function PointsSummaryHero({ totalPoints, onRefresh, isRefreshing, onQuickRedeem }) {
  const [showBenefits, setShowBenefits] = useState(false);
  const points = totalPoints === null ? 0 : totalPoints;
  const cashEquivalent = (points * 0.25).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  // Calculate milestone to next 5,000 point milestone
  const nextMilestone = Math.ceil((points + 1) / 5000) * 5000;
  const pointsToMilestone = Math.max(0, nextMilestone - points);
  const milestoneProgress = Math.min(100, Math.round(((5000 - pointsToMilestone) / 5000) * 100));

  return (
    <div className="points-summary-hero">
      <div className="hero-glow-ambient" aria-hidden="true" />

      <div className="hero-top-status">
        <div className="tier-badge-gold">
          <span className="material-icons tier-star">workspace_premium</span>
          <span>IOB PLATINUM PRIVILEGE</span>
        </div>
        <div className="tier-account-valid">
          <span className="status-dot-green" />
          <span>Active & Verified Account</span>
        </div>
      </div>

      <div className="hero-content-grid">
        <div className="hero-main-stat">
          <span className="stat-eyebrow">Available Reward Balance</span>
          <div className="stat-odometer-wrap">
            <span className="stat-odometer-val">
              {totalPoints === null ? '—' : points.toLocaleString('en-IN')}
            </span>
            <span className="stat-odometer-unit">Points</span>
          </div>
          <div className="stat-cash-value">
            <span className="material-icons cash-icon">payments</span>
            <span>Approx. value:&nbsp;</span>
            <strong className="cash-amount">₹{cashEquivalent}</strong>
            <span className="conversion-rate">(1 Point = ₹0.25)</span>
          </div>
        </div>

        <div className="hero-actions-panel">
          <button
            type="button"
            className="hero-btn-primary"
            onClick={onQuickRedeem}
          >
            <span className="material-icons">card_giftcard</span>
            <span>Instant Voucher Claim</span>
          </button>

          <button
            type="button"
            className="hero-btn-secondary"
            onClick={() => setShowBenefits(true)}
          >
            <span className="material-icons">verified</span>
            <span>Card Benefits</span>
          </button>

          <button
            type="button"
            className="hero-btn-icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Points Balance"
            aria-label="Refresh Points Balance"
          >
            <span className={`material-icons ${isRefreshing ? 'spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Progress Milestone Bar */}
      <div className="hero-milestone-bar">
        <div className="milestone-label-row">
          <span>
            Next Milestone: <strong>{nextMilestone.toLocaleString('en-IN')} Points</strong>
          </span>
          <span className="milestone-remaining">
            {pointsToMilestone > 0
              ? `${pointsToMilestone.toLocaleString('en-IN')} pts to next ₹1,250 voucher`
              : 'Milestone Achieved!'}
          </span>
        </div>
        <div className="milestone-track">
          <div
            className="milestone-fill"
            style={{ width: `${milestoneProgress}%` }}
          />
        </div>
      </div>

      {/* Card Benefits Modal */}
      {showBenefits && (
        <div className="modal-backdrop" onClick={() => setShowBenefits(false)}>
          <div className="modal-card benefits-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="material-icons modal-icon-gold">stars</span>
                <div>
                  <h3>Indian Overseas Bank Credit Card Privileges</h3>
                  <p>Your tier-exclusive benefits & point multipliers</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowBenefits(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="material-icons benefit-icon">local_airport</span>
                <div>
                  <h4>Complimentary Airport Lounge</h4>
                  <p>4 complimentary domestic airport lounge visits per calendar quarter.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="material-icons benefit-icon">bolt</span>
                <div>
                  <h4>5X Accelerated Points</h4>
                  <p>Earn 5X reward points on all dining, supermarket, and flight bookings.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="material-icons benefit-icon">local_gas_station</span>
                <div>
                  <h4>1% Fuel Surcharge Waiver</h4>
                  <p>Valid at all fuel stations across India on transactions between ₹400 – ₹5,000.</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="material-icons benefit-icon">redeem</span>
                <div>
                  <h4>Instant 1:1 Redemption</h4>
                  <p>Zero redemption fees on vouchers from Amazon, Flipkart, Swiggy, and Croma.</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-confirm"
                onClick={() => setShowBenefits(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';

export function FlightBookingModal({ flight, isOpen, onClose, userPoints, onConfirmBooking }) {
  const [passengerName, setPassengerName] = useState('Rahul Sharma');
  const [passengerEmail, setPassengerEmail] = useState('cardholder.iob@bank.in');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [pnrCode, setPnrCode] = useState('');

  if (!isOpen || !flight) return null;

  const pointsRequired = flight.pointsNeeded || Math.round((flight.basePrice * 0.7) / 0.25);
  const cashBalance = flight.balanceCash !== undefined ? flight.balanceCash : Math.round(flight.basePrice * 0.3);
  const hasEnoughPoints = (userPoints || 0) >= pointsRequired;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPnr = `IOB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setPnrCode(generatedPnr);
      setIsProcessing(false);
      setIsConfirmed(true);

      if (onConfirmBooking) {
        onConfirmBooking({
          pnr: generatedPnr,
          flight,
          pointsDeducted: pointsRequired,
          cashCharged: cashBalance
        });
      }
    }, 900);
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="booking-modal-card">
        {/* Header */}
        <div className="modal-header-strip">
          <div className="modal-title-col">
            <span className="modal-badge-airline" style={{ backgroundColor: flight.color }}>
              {flight.airline} {flight.flightNum}
            </span>
            <h3 className="modal-title">Flight Booking &amp; Points Redemption</h3>
          </div>
          <button type="button" className="modal-close-icon-btn" onClick={handleClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {!isConfirmed ? (
          <div className="booking-modal-body">
            {/* Flight Summary Card */}
            <div className="booking-flight-summary">
              <div className="summary-route">
                <div>
                  <span className="sum-time">{flight.deptTime}</span>
                  <span className="sum-city">{flight.fromCity} ({flight.fromCode})</span>
                </div>
                <div className="sum-duration-block">
                  <span className="sum-dur">{flight.duration}</span>
                  <div className="sum-line" />
                  <span className="sum-stops">{flight.stops}</span>
                </div>
                <div>
                  <span className="sum-time">{flight.arrTime}</span>
                  <span className="sum-city">{flight.toCity} ({flight.toCode})</span>
                </div>
              </div>

              <div className="summary-sub-info">
                <span><strong>Date:</strong> {flight.date}</span>
                <span><strong>Class:</strong> {flight.travellers}</span>
                <span><strong>Aircraft:</strong> {flight.aircraft}</span>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="passenger-input-group">
              <span className="input-group-title">Passenger Details</span>
              <div className="passenger-inputs-row">
                <div className="form-field">
                  <label>Full Name (as per Govt ID)</label>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email for e-Ticket</label>
                  <input
                    type="email"
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Fare & Points Split Breakdown */}
            <div className="fare-breakdown-box">
              <span className="input-group-title">Redemption Breakdown</span>

              <div className="fare-breakdown-row">
                <span>Flight Base Fare &amp; Taxes</span>
                <strong>₹{flight.basePrice.toLocaleString('en-IN')}</strong>
              </div>

              <div className="fare-breakdown-row highlight-points">
                <span>
                  <span className="material-icons-mini">stars</span> IOB Points Redeemed ({pointsRequired.toLocaleString('en-IN')} Pts @ ₹0.25)
                </span>
                <span className="deduct-val">- ₹{(pointsRequired * 0.25).toLocaleString('en-IN')}</span>
              </div>

              <div className="fare-breakdown-row">
                <span>IOB Cardmember Convenience Fee Waiver</span>
                <span className="free-tag">FREE (Save ₹450)</span>
              </div>

              <div className="fare-breakdown-row net-total">
                <span>Net Payable via IOB Credit Card</span>
                <strong className="net-amount">₹{cashBalance.toLocaleString('en-IN')}</strong>
              </div>

              <div className="points-bonus-alert">
                <span className="material-icons">bolt</span>
                <span>You will earn <strong>5X IOB Reward Points</strong> on the ₹{cashBalance} paid with your credit card!</span>
              </div>
            </div>

            {!hasEnoughPoints && (
              <div className="insufficient-points-notice">
                <span className="material-icons">warning</span>
                <span>You need {pointsRequired.toLocaleString('en-IN')} Points. Current balance: {(userPoints || 0).toLocaleString('en-IN')} Points.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions-bar">
              <button type="button" className="modal-cancel-btn" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="button"
                className="modal-confirm-btn"
                onClick={handleConfirm}
                disabled={isProcessing || !hasEnoughPoints}
              >
                {isProcessing ? (
                  <>
                    <span className="material-icons spin">autorenew</span>
                    <span>Issuing e-Ticket…</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">check_circle</span>
                    <span>Confirm &amp; Redeem {pointsRequired.toLocaleString('en-IN')} Pts</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="booking-success-view">
            <div className="success-icon-ring">
              <span className="material-icons">flight_takeoff</span>
            </div>
            <h2>e-Ticket Issued Successfully!</h2>
            <p className="success-sub">
              Your flight booking is confirmed. Confirmation details have been emailed to <strong>{passengerEmail}</strong>.
            </p>

            <div className="pnr-display-card">
              <span className="pnr-label">Booking Reference / PNR</span>
              <strong className="pnr-code">{pnrCode}</strong>
              <span className="airline-ref">{flight.airline} • {flight.flightNum}</span>
            </div>

            <div className="success-stats-grid">
              <div className="stat-box">
                <span className="stat-lbl">Points Deducted</span>
                <span className="stat-val red">-{pointsRequired.toLocaleString('en-IN')} Pts</span>
              </div>
              <div className="stat-box">
                <span className="stat-lbl">Paid via IOB Card</span>
                <span className="stat-val">₹{cashBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="stat-box">
                <span className="stat-lbl">Points Balance</span>
                <span className="stat-val green">{Math.max(0, (userPoints || 0) - pointsRequired).toLocaleString('en-IN')} Pts</span>
              </div>
            </div>

            <button type="button" className="success-done-btn" onClick={handleClose}>
              Done &amp; View Booking in Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

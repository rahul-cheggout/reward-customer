import React, { useRef, useState, useCallback } from 'react';
import { CardChipSvg, ContactlessIcon, RuPayLogo, VisaLogo, IobEmblem } from './Icons';

export function CreditCardTile({ card }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, active: false });

  // Interactive 3D tilt tracking mouse movement
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11; // -11 to +11 deg
    const rotateY = ((x - centerX) / centerX) * 11;  // -11 to +11 deg

    setCoords({
      x,
      y,
      rotateX,
      rotateY,
      active: true
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoords({ x: 0, y: 0, rotateX: 0, rotateY: 0, active: false });
  }, []);

  const isRuPay = card.card_network?.toLowerCase().includes('rupay');
  const points = Number(card.points_balance || 0);

  return (
    <div
      className="credit-card-tile-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="credit-card-tile luxury-3d-card"
        style={{
          transform: coords.active
            ? `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: coords.active ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Dynamic Holographic Foil Glare */}
        {coords.active && (
          <div
            className="card-glare"
            style={{
              background: `radial-gradient(circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.22) 0%, rgba(212, 175, 55, 0.12) 30%, transparent 70%)`
            }}
          />
        )}

        {/* Ambient background pattern */}
        <div className="card-texture-pattern" aria-hidden="true" />

        {/* Top Header Row: IOB Logo + Contactless */}
        <div className="credit-card-tile-top">
          <div className="card-bank-brand">
            <IobEmblem size={34} />
            <div className="card-bank-names">
              <span className="card-bank-title">Indian Overseas Bank</span>
              <span className="card-type-subtitle">{card.card_name}</span>
            </div>
          </div>
          <div className="card-contactless">
            <ContactlessIcon />
          </div>
        </div>

        {/* Chip & Masked Number Row */}
        <div className="card-chip-row">
          <div className="card-chip-wrap">
            <CardChipSvg />
          </div>
          <div className="card-embossed-number">
            {card.masked_number}
          </div>
        </div>

        {/* Card Holder & Expiry Row */}
        <div className="card-meta-row">
          <div className="card-meta-item">
            <span className="meta-label">CARDHOLDER</span>
            <span className="meta-val">IOB PRIVILEGE CARDMEMBER</span>
          </div>
          <div className="card-meta-item">
            <span className="meta-label">VALID THRU</span>
            <span className="meta-val">09/29</span>
          </div>
        </div>

        {/* Bottom Footer Row: Points Balance Badge & Network Emblem */}
        <div className="credit-card-tile-bottom">
          <div className="points-pill-luxury">
            <span className="material-icons star-gold">stars</span>
            <div className="points-pill-content">
              <span className="points-pill-label">REWARD BALANCE</span>
              <span className="points-pill-num">
                {points.toLocaleString('en-IN')}&nbsp;
                <span className="points-unit">{card.points_currency || 'PTS'}</span>
              </span>
            </div>
          </div>

          <div className="card-network-emblem-wrap">
            {isRuPay ? <RuPayLogo /> : <VisaLogo />}
          </div>
        </div>
      </div>
    </div>
  );
}

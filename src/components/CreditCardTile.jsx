import React from 'react';
import { CardChipSvg } from './Icons';

export function CreditCardTile({ card }) {
  return (
    <div
      className="credit-card-tile"
      style={{
        background: 'linear-gradient(135deg, #060606 0%, #1c1c1c 55%, #2e2a20 100%)'
      }}
    >
      <span className="credit-card-tile-shine" aria-hidden="true" />
      <div className="credit-card-tile-top">
        <span className="card-name">{card.card_name}</span>
        <span className="card-network">{card.card_network}</span>
      </div>
      <div className="card-chip-row">
        <span className="card-chip" aria-hidden="true">
          <CardChipSvg />
        </span>
        <div className="card-masked-number">{card.masked_number}</div>
      </div>
      <div className="credit-card-tile-bottom">
        <div>
          <span className="points-label">Points balance</span>
          <div className="credit-card-tile-bottom-value">
            <span className="points-balance">
              {Number(card.points_balance || 0).toLocaleString('en-IN')}
            </span>
            <span className="points-currency">{card.points_currency || 'Points'}</span>
          </div>
        </div>
        <span className="material-icons card-stars-icon" aria-hidden="true">
          stars
        </span>
      </div>
    </div>
  );
}

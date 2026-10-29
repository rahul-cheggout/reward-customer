import React, { useState, useEffect } from 'react';
import { CardCarousel } from '../components/CardCarousel';
import { TransactionsList } from '../components/TransactionsList';
import { RewardMarketplace } from '../components/RewardMarketplace';
import {
  BANK_NAME,
  CARDS_REFRESHED_EVENT,
  fetchMyCards,
  fetchCustomerOrders,
  formatTransaction
} from '../services/api';

export function CardsPage() {
  const [cards, setCards] = useState([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [isTxLoading, setIsTxLoading] = useState(true);
  const [txError, setTxError] = useState('');

  useEffect(() => {
    fetchMyCards()
      .then(setCards)
      .catch(() => setCardsError('Could not load your cards.'))
      .finally(() => setIsCardsLoading(false));
  }, []);

  useEffect(() => {
    fetchCustomerOrders(1, 10, BANK_NAME)
      .then((data) => {
        const list = (data || []).map(formatTransaction);
        setTransactions(list);
      })
      .catch(() => setTxError('Could not load your recent transactions.'))
      .finally(() => setIsTxLoading(false));
  }, []);

  useEffect(() => {
    const handleCardsUpdated = (event) => {
      setCards(event.detail);
    };
    window.addEventListener(CARDS_REFRESHED_EVENT, handleCardsUpdated);
    return () => window.removeEventListener(CARDS_REFRESHED_EVENT, handleCardsUpdated);
  }, []);

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h2>Your credit cards</h2>
          <p>All your reward points, in one place</p>
        </div>
      </div>

      {cardsError && (
        <div className="error-banner">
          <span className="material-icons">error</span>
          {cardsError}
        </div>
      )}

      <div className="cards-page-grid">
        <div className="cards-page-main">
          {isCardsLoading && (
            <div className="spinner-wrap">
              <div className="spinner" />
            </div>
          )}

          {!isCardsLoading && cards.length === 0 && (
            <div className="empty-state">
              <span className="material-icons">credit_card_off</span>
              <p>No credit cards found for this account yet.</p>
            </div>
          )}

          {!isCardsLoading && cards.length > 0 && <CardCarousel cards={cards} />}

          <TransactionsList
            transactions={transactions}
            loading={isTxLoading}
            error={txError}
          />
        </div>

        <div className="cards-page-side">
          <RewardMarketplace />
        </div>
      </div>
    </div>
  );
}

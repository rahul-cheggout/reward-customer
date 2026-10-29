import React, { useState, useEffect, useCallback } from 'react';
import { PointsSummaryHero } from '../components/PointsSummaryHero';
import { CardCarousel } from '../components/CardCarousel';
import { TransactionsList } from '../components/TransactionsList';
import { RewardMarketplace } from '../components/RewardMarketplace';
import { RedeemModal } from '../components/RedeemModal';
import {
  BANK_NAME,
  CARDS_REFRESHED_EVENT,
  fetchMyCards,
  refreshCards,
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

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  // Load Cards
  const loadCards = useCallback(() => {
    setIsCardsLoading(true);
    fetchMyCards()
      .then(setCards)
      .catch(() => setCardsError('Could not load your cards.'))
      .finally(() => setIsCardsLoading(false));
  }, []);

  // Load Transactions
  const loadTransactions = useCallback(() => {
    setIsTxLoading(true);
    fetchCustomerOrders(1, 10, BANK_NAME)
      .then((data) => {
        const list = (data || []).map(formatTransaction);
        setTransactions(list);
      })
      .catch(() => setTxError('Could not load your recent transactions.'))
      .finally(() => setIsTxLoading(false));
  }, []);

  useEffect(() => {
    loadCards();
    loadTransactions();
  }, [loadCards, loadTransactions]);

  // Sync refresh events
  useEffect(() => {
    const handleCardsUpdated = (event) => {
      if (Array.isArray(event.detail)) {
        setCards(event.detail);
      }
    };
    window.addEventListener(CARDS_REFRESHED_EVENT, handleCardsUpdated);
    return () => window.removeEventListener(CARDS_REFRESHED_EVENT, handleCardsUpdated);
  }, []);

  // Handle manual points refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await refreshCards();
      setCards(updated);
      window.dispatchEvent(new CustomEvent(CARDS_REFRESHED_EVENT, { detail: updated }));
    } catch {
      // fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle successful voucher claim in RedeemModal
  const handleRedeemSuccess = (pointsDeducted, newTx) => {
    setCards((prev) => {
      if (!prev.length) return prev;
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        points_balance: Math.max(0, updated[0].points_balance - pointsDeducted)
      };
      window.dispatchEvent(new CustomEvent(CARDS_REFRESHED_EVENT, { detail: updated }));
      return updated;
    });

    if (newTx) {
      setTransactions((prev) => [
        { id: `tx-claim-${Date.now()}`, ...newTx },
        ...prev
      ]);
    }
  };

  const totalPoints = cards.reduce((acc, c) => acc + (c.points_balance || 0), 0);

  return (
    <div className="cards-page-layout">
      {/* Hero Points Overview */}
      <PointsSummaryHero
        totalPoints={isCardsLoading ? null : totalPoints}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onQuickRedeem={() => setIsRedeemModalOpen(true)}
      />

      {cardsError && (
        <div className="error-banner">
          <span className="material-icons">error</span>
          <span>{cardsError}</span>
        </div>
      )}

      {/* Main Grid: Left Column Cards & Statement | Right Column Marketplace */}
      <div className="cards-page-grid">
        <div className="cards-page-main">
          {/* Section: Your Credit Cards */}
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Your Credit Cards</h2>
              <p className="section-subtitle">Manage points and privileges across your IOB accounts</p>
            </div>
            <span className="cards-count-badge">
              {cards.length} {cards.length === 1 ? 'Card' : 'Cards'} Linked
            </span>
          </div>

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

          {!isCardsLoading && cards.length > 0 && (
            <div className="carousel-section-wrap">
              <CardCarousel cards={cards} />
            </div>
          )}

          {/* Section: Statement & Activity */}
          <TransactionsList
            transactions={transactions}
            loading={isTxLoading}
            error={txError}
          />
        </div>

        {/* Right Sidebar Marketplace */}
        <div className="cards-page-side">
          <RewardMarketplace onOpenRedeem={() => setIsRedeemModalOpen(true)} />
        </div>
      </div>

      {/* Interactive Voucher Claim Modal */}
      <RedeemModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        currentPoints={totalPoints}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
}

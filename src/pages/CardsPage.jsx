import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PointsSummaryHero } from '../components/PointsSummaryHero';
import { CardCarousel } from '../components/CardCarousel';
import { TransactionsList } from '../components/TransactionsList';
import { RewardMarketplace } from '../components/RewardMarketplace';
import { RedeemModal } from '../components/RedeemModal';
import { FlightCompareWidget } from '../components/FlightCompareWidget';
import { FlightBookingModal } from '../components/FlightBookingModal';
import {
  BANK_NAME,
  CARDS_REFRESHED_EVENT,
  fetchMyCards,
  refreshCards,
  fetchCustomerOrders,
  formatTransaction
} from '../services/api';

export function CardsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'flights';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [cards, setCards] = useState([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [cardsError, setCardsError] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [isTxLoading, setIsTxLoading] = useState(true);
  const [txError, setTxError] = useState('');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);

  // Flight Booking Modal state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);

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

  // Switch tab and sync url
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  // Handle flight selection
  const handleSelectFlight = (flightData) => {
    setSelectedFlight(flightData);
    setIsFlightModalOpen(true);
  };

  // Confirm flight booking & deduct points live
  const handleConfirmFlightBooking = ({ pnr, flight, pointsDeducted, cashCharged }) => {
    // 1. Deduct points from first linked card
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

    // 2. Prepend transaction to activity list
    const newTx = {
      id: `tx-flight-${Date.now()}`,
      orderId: pnr,
      merchant: `${flight.airline} Flight Booking (${flight.fromCode}➔${flight.toCode})`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      type: 'redeemed',
      points: pointsDeducted,
      voucherCode: pnr,
      cashPaid: `₹${cashCharged.toLocaleString('en-IN')}`,
      status: 'Confirmed'
    };

    setTransactions((prev) => [newTx, ...prev]);
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
      {/* SmartBuy Category Navigation Strip */}
      <div className="smartbuy-category-strip">
        <div className="category-tabs-container">
          <button
            type="button"
            className={`category-tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
            onClick={() => handleTabChange('flights')}
          >
            <span className="material-icons cat-icon">flight</span>
            <div className="cat-texts">
              <span className="cat-title">Flights</span>
              <span className="cat-badge">5X Points / 5% Back</span>
            </div>
          </button>

          <button
            type="button"
            className={`category-tab-btn ${activeTab === 'vouchers' ? 'active' : ''}`}
            onClick={() => handleTabChange('vouchers')}
          >
            <span className="material-icons cat-icon">redeem</span>
            <div className="cat-texts">
              <span className="cat-title">Instant Vouchers</span>
              <span className="cat-badge">Amazon, Swiggy, Flipkart</span>
            </div>
          </button>

          <button
            type="button"
            className={`category-tab-btn ${activeTab === 'cards' ? 'active' : ''}`}
            onClick={() => handleTabChange('cards')}
          >
            <span className="material-icons cat-icon">credit_card</span>
            <div className="cat-texts">
              <span className="cat-title">My Cards &amp; Statement</span>
              <span className="cat-badge">{cards.length} Linked Cards</span>
            </div>
          </button>
        </div>

        <div className="quick-points-summary-chip" onClick={() => handleTabChange('cards')}>
          <span className="material-icons star-icon">stars</span>
          <div className="points-meta">
            <span className="points-sub">Available Balance</span>
            <strong className="points-total">{totalPoints.toLocaleString('en-IN')} Pts</strong>
          </div>
          <button
            type="button"
            className="redeem-now-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsRedeemModalOpen(true);
            }}
          >
            Redeem
          </button>
        </div>
      </div>

      {cardsError && (
        <div className="error-banner">
          <span className="material-icons">error</span>
          <span>{cardsError}</span>
        </div>
      )}

      {/* TAB 1: COMPARE & BOOK FLIGHTS (SmartBuy Travel Core) */}
      {activeTab === 'flights' && (
        <div className="tab-pane-flights">
          <FlightCompareWidget
            userPoints={totalPoints}
            onSelectFlight={handleSelectFlight}
          />
        </div>
      )}

      {/* TAB 2: INSTANT BRAND VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="tab-pane-vouchers">
          <div className="vouchers-hero-banner">
            <div className="vh-text">
              <span className="deal-badge-gold">Instant Redemption</span>
              <h2>Instant Brand Gift Cards &amp; Vouchers</h2>
              <p>Redeem your IOB Reward Points instantly for 150+ top brands with zero waiting time.</p>
            </div>
            <button
              type="button"
              className="vh-claim-btn"
              onClick={() => setIsRedeemModalOpen(true)}
            >
              <span className="material-icons">card_giftcard</span>
              <span>Claim Gift Cards Now</span>
            </button>
          </div>

          <div className="cards-page-grid vouchers-layout">
            <div className="cards-page-main">
              <RewardMarketplace onOpenRedeem={() => setIsRedeemModalOpen(true)} />
            </div>
            <div className="cards-page-side">
              <div className="voucher-perks-card">
                <span className="material-icons icon-gold">verified</span>
                <h4>Official Partner Vouchers</h4>
                <p>All brand vouchers are powered by Gyftr &amp; Woohoo with instant SMS/Email delivery.</p>
                <div className="partner-brands-row">
                  <span className="p-tag">Amazon</span>
                  <span className="p-tag">Flipkart</span>
                  <span className="p-tag">Swiggy</span>
                  <span className="p-tag">Croma</span>
                  <span className="p-tag">Myntra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY CARDS & STATEMENT */}
      {activeTab === 'cards' && (
        <div className="tab-pane-cards">
          {/* Hero Points Overview */}
          <PointsSummaryHero
            totalPoints={isCardsLoading ? null : totalPoints}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            onQuickRedeem={() => setIsRedeemModalOpen(true)}
          />

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
        </div>
      )}

      {/* Flight Booking & Confirmation Modal */}
      <FlightBookingModal
        flight={selectedFlight}
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        userPoints={totalPoints}
        onConfirmBooking={handleConfirmFlightBooking}
      />

      {/* Interactive Brand Voucher Claim Modal */}
      <RedeemModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        currentPoints={totalPoints}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
}

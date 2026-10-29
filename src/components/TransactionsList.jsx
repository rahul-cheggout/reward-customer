import React, { useState, useMemo } from 'react';

function getMerchantIcon(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('store') || lower.includes('croma')) {
    return 'shopping_bag';
  }
  if (lower.includes('flight') || lower.includes('travel') || lower.includes('makemytrip') || lower.includes('hotel')) {
    return 'flight_takeoff';
  }
  if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('swiggy') || lower.includes('zomato') || lower.includes('dining')) {
    return 'restaurant';
  }
  if (lower.includes('fuel') || lower.includes('petrol') || lower.includes('gas')) {
    return 'local_gas_station';
  }
  return 'receipt';
}

function getMerchantCategory(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('amazon') || lower.includes('flipkart') || lower.includes('croma')) return 'E-Commerce Shopping';
  if (lower.includes('flight') || lower.includes('travel') || lower.includes('makemytrip')) return 'Travel & Airlines';
  if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('swiggy')) return 'Dining & Food';
  if (lower.includes('fuel')) return 'Fuel Station';
  return 'General Purchase';
}

export function TransactionsList({ transactions = [], loading = false, error = '' }) {
  const [filterType, setFilterType] = useState('all'); // all, earned, redeemed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const isEarned = tx.type === 'earned' || tx.points > 0;
      if (filterType === 'earned' && !isEarned) return false;
      if (filterType === 'redeemed' && isEarned) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          tx.merchant?.toLowerCase().includes(query) ||
          tx.id?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="transactions-section luxury-card-panel">
      <div className="transactions-header-row">
        <div>
          <h3 className="transactions-title">Card Activity & Statement</h3>
          <p className="transactions-subtitle">Track your reward points earnings and voucher redemptions</p>
        </div>

        {/* Filter Tabs */}
        <div className="tx-filter-pills">
          <button
            type="button"
            className={`tx-pill ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`tx-pill ${filterType === 'earned' ? 'active' : ''}`}
            onClick={() => setFilterType('earned')}
          >
            Earned
          </button>
          <button
            type="button"
            className={`tx-pill ${filterType === 'redeemed' ? 'active' : ''}`}
            onClick={() => setFilterType('redeemed')}
          >
            Redeemed
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="tx-search-bar">
        <span className="material-icons search-icon">search</span>
        <input
          type="text"
          placeholder="Search by merchant (Amazon, Starbucks, Flights...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      )}

      {!loading && error && (
        <div className="error-banner">
          <span className="material-icons">error</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filteredTransactions.length === 0 && (
        <div className="empty-state">
          <span className="material-icons">receipt_long</span>
          <p>No matching transactions found.</p>
        </div>
      )}

      {!loading && !error && filteredTransactions.length > 0 && (
        <div className="transactions-list">
          {filteredTransactions.map((tx) => {
            const isEarned = tx.type === 'earned' || tx.points > 0;
            const formattedDate = new Date(tx.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const iconName = getMerchantIcon(tx.merchant);
            const category = getMerchantCategory(tx.merchant);

            return (
              <div
                key={tx.id}
                className="transaction-row interactive"
                onClick={() => setSelectedTx(tx)}
              >
                <div className={`transaction-icon ${isEarned ? 'earned' : 'redeemed'}`}>
                  <span className="material-icons">{iconName}</span>
                </div>

                <div className="transaction-info">
                  <div className="merchant-name-row">
                    <span className="transaction-merchant">{tx.merchant}</span>
                    <span className="merchant-category-badge">{category}</span>
                  </div>
                  <span className="transaction-date">{formattedDate}</span>
                </div>

                <div className="transaction-points-col">
                  <span className={`transaction-points ${isEarned ? 'earned' : 'redeemed'}`}>
                    {isEarned ? '+' : ''}
                    {Number(tx.points || 0).toLocaleString('en-IN')}
                    <span className="pts-suffix"> pts</span>
                  </span>
                  <span className="tx-status-label">{isEarned ? 'Points Credited' : 'Voucher Claimed'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction Details Drawer / Modal */}
      {selectedTx && (
        <div className="modal-backdrop" onClick={() => setSelectedTx(null)}>
          <div className="modal-card tx-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="material-icons modal-icon-gold">receipt</span>
                <div>
                  <h3>Transaction Receipt</h3>
                  <p>Transaction ID: #{selectedTx.id}</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedTx(null)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="tx-receipt-card">
              <div className="receipt-brand-header">
                <span className="material-icons receipt-big-icon">{getMerchantIcon(selectedTx.merchant)}</span>
                <h4>{selectedTx.merchant}</h4>
                <span className="receipt-category">{getMerchantCategory(selectedTx.merchant)}</span>
              </div>

              <div className="receipt-data-rows">
                <div className="receipt-data-row">
                  <span>Status</span>
                  <span className="status-badge-success">Settled & Verified</span>
                </div>
                <div className="receipt-data-row">
                  <span>Date & Time</span>
                  <strong>{new Date(selectedTx.date).toLocaleString('en-IN')}</strong>
                </div>
                <div className="receipt-data-row">
                  <span>Payment Card</span>
                  <strong>IOB Platinum Privilege Card</strong>
                </div>
                <div className="receipt-data-row">
                  <span>Reward Points</span>
                  <strong className={selectedTx.points > 0 ? 'text-green' : 'text-gold'}>
                    {selectedTx.points > 0 ? '+' : ''}
                    {Number(selectedTx.points || 0).toLocaleString('en-IN')} Points
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="modal-btn-confirm"
                onClick={() => setSelectedTx(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

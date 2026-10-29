import React from 'react';

export function TransactionsList({ transactions = [], loading = false, error = '' }) {
  return (
    <div className="transactions-section">
      <p className="transactions-title">Recent transactions</p>

      {loading && (
        <div className="spinner-wrap">
          <div className="spinner" />
        </div>
      )}

      {!loading && error && (
        <div className="error-banner">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {!loading && !error && transactions.length === 0 && (
        <div className="empty-state">
          <span className="material-icons">receipt_long</span>
          <p>No transactions yet.</p>
        </div>
      )}

      {!loading && !error && transactions.length > 0 && (
        <div className="transactions-list">
          {transactions.map((tx) => {
            const isEarned = tx.type === 'earned' || tx.points > 0;
            const formattedDate = new Date(tx.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div key={tx.id} className="transaction-row">
                <div className={`transaction-icon ${isEarned ? 'earned' : 'redeemed'}`}>
                  <span className="material-icons">
                    {isEarned ? 'add_circle' : 'redeem'}
                  </span>
                </div>
                <div className="transaction-info">
                  <span className="transaction-merchant">{tx.merchant}</span>
                  <span className="transaction-date">{formattedDate}</span>
                </div>
                <span className={`transaction-points ${isEarned ? 'earned' : 'redeemed'}`}>
                  {isEarned ? '+' : ''}
                  {Number(tx.points || 0).toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

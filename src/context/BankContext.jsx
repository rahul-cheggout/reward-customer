import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const BankContext = createContext(null);

const DEFAULT_BANK = {
  code: null,
  name: 'IOB Credit Card Rewards',
  primaryColor: '#d4af37',
  logoUrl: null
};

function applyBankTheme(primaryColor = '#d4af37') {
  document.documentElement.style.setProperty('--primary', primaryColor);
  document.documentElement.style.setProperty('--primary-dark', '#f0d78c');
}

export function BankProvider({ children }) {
  const [bank, setBank] = useState(() => {
    try {
      const stored = localStorage.getItem('cheggout_bank');
      return stored ? JSON.parse(stored) : DEFAULT_BANK;
    } catch {
      return DEFAULT_BANK;
    }
  });

  useEffect(() => {
    applyBankTheme(bank?.primaryColor || '#d4af37');
  }, [bank?.primaryColor]);

  const setBankInfo = useCallback((newBankInfo) => {
    localStorage.setItem('cheggout_bank', JSON.stringify(newBankInfo));
    setBank(newBankInfo);
  }, []);

  return (
    <BankContext.Provider value={{ bank, setBankInfo }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within BankProvider');
  }
  return context;
}

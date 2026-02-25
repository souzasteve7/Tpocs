import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    // Get currency from localStorage or default to INR for Indian travel app
    return localStorage.getItem('selectedCurrency') || 'INR';
  });

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
  ];

  // Currency conversion rates with INR as base (in a real app, you'd fetch from an API)
  const exchangeRates = {
    INR: 1,        // Base currency
    USD: 0.012,    // 1 INR = 0.012 USD (1 USD = ~83 INR)
    EUR: 0.011,    // 1 INR = 0.011 EUR  
    GBP: 0.0095,   // 1 INR = 0.0095 GBP
    JPY: 1.8,      // 1 INR = 1.8 JPY
    THB: 0.43,     // 1 INR = 0.43 THB (1 THB = ~2.3 INR)
    SGD: 0.016,    // 1 INR = 0.016 SGD
    AED: 0.044,    // 1 INR = 0.044 AED (1 AED = ~23 INR)
    MYR: 0.056,    // 1 INR = 0.056 MYR
    KRW: 16.2      // 1 INR = 16.2 KRW
  };

  const convertCurrency = (amount, fromCurrency = 'INR', toCurrency = selectedCurrency) => {
    if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return null;
    const numericAmount = Number(amount);
    // Convert from source currency to INR first (if not already INR)
    const amountInINR = fromCurrency === 'INR' ? numericAmount : numericAmount / exchangeRates[fromCurrency];
    // Convert from INR to target currency
    const convertedAmount = toCurrency === 'INR' ? amountInINR : amountInINR * exchangeRates[toCurrency];
    return Math.round(convertedAmount * 100) / 100;
  };

  const formatCurrency = (amount, currency = selectedCurrency) => {
    if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return 'N/A';
    const numericAmount = Number(amount);
    const currencyInfo = currencyOptions.find(c => c.code === currency);
    const symbol = currencyInfo?.symbol || currency;
    return `${symbol}${numericAmount.toLocaleString()}`;
  };

  const updateCurrency = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const value = {
    selectedCurrency,
    currencyOptions,
    exchangeRates,
    convertCurrency,
    formatCurrency,
    updateCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
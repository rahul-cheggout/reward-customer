import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: 'check_circle',
  error: 'cancel',
  warning: 'warning',
  info: 'info'
};

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(onRemove, 320);
    }
  }, [isExiting, onRemove]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, toast.duration ?? 3500);
    return () => clearTimeout(timer);
  }, [handleDismiss, toast.duration]);

  return (
    <div
      className={`toast-item toast-${toast.type}${isExiting ? ' toast-exit' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className="material-icons toast-type-icon">
        {TOAST_ICONS[toast.type] || 'info'}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-close-btn"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <span className="material-icons">close</span>
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const api = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
    add: addToast,
    remove: removeToast
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

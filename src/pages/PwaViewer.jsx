import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useLocation, Navigate } from 'react-router-dom';
import { fetchMyCards } from '../services/api';

export function PwaViewer() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const iframeRef = useRef(null);
  const targetUrl = searchParams.get('url') || '';
  const label = searchParams.get('label') || 'PWA';

  const [counter, setCounter] = useState(0);

  const refreshPoints = useCallback(() => {
    fetchMyCards().catch(() => {});
  }, []);

  const handleLogoutEvent = useCallback(() => {
    setCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    refreshPoints();
    const interval = setInterval(refreshPoints, 30000);

    window.addEventListener('app:logout', handleLogoutEvent);
    return () => {
      clearInterval(interval);
      refreshPoints();
      handleLogoutEvent();
      window.removeEventListener('app:logout', handleLogoutEvent);
    };
  }, [refreshPoints, handleLogoutEvent]);

  if (!targetUrl) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pwa-viewer">
      <iframe
        ref={iframeRef}
        key={`${location.key}:${counter}`}
        src={targetUrl}
        className="pwa-frame"
        title={label}
        allow="clipboard-read; clipboard-write; payment; camera; microphone"
        allowFullScreen
      />
    </div>
  );
}

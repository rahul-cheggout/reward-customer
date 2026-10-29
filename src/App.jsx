import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BankProvider } from './context/BankContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/AppShell';
import { AuthPage } from './pages/AuthPage';
import { CardsPage } from './pages/CardsPage';
import { PwaViewer } from './pages/PwaViewer';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export function App() {
  return (
    <BankProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/cards" replace />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="pwa" element={<PwaViewer />} />
              </Route>
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </BankProvider>
  );
}

export default App;

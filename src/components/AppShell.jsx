import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import {
  BANK_NAME,
  IOB_DEFAULT_LOGO,
  CARDS_REFRESHED_EVENT,
  fetchMyCards,
  refreshCards,
  fetchActionTabs,
  getTabName,
  getTabIcon,
  getTabUrl,
  resolvePwaUrl
} from '../services/api';

const PRIMARY_NAV = [
  { label: 'My Cards', icon: 'dashboard', to: '/cards' }
];

export function AppShell() {
  const { user, logout } = useAuth();
  const { bank } = useBank();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState(null);
  const [actionTabs, setActionTabs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const userMenuRef = useRef(null);

  // Load initial cards balance
  useEffect(() => {
    fetchMyCards()
      .then((cards) => {
        const sum = cards.reduce((acc, curr) => acc + (curr.points_balance || 0), 0);
        setTotalPoints(sum);
      })
      .catch(() => {});
  }, []);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const cards = await refreshCards();
      const sum = cards.reduce((acc, curr) => acc + (curr.points_balance || 0), 0);
      setTotalPoints(sum);
      window.dispatchEvent(new CustomEvent(CARDS_REFRESHED_EVENT, { detail: cards }));
    } catch (err) {
      console.warn('Failed to refresh cards:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Load Action Tabs for sidebar
  useEffect(() => {
    fetchActionTabs(BANK_NAME)
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.result ?? res?.data ?? res?.list ?? [];
        setActionTabs(list.filter((t) => Boolean(getTabUrl(t))));
      })
      .catch(() => setActionTabs([]));
  }, []);

  // Close user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className={`shell ${isCollapsed ? 'collapsed' : ''}`}>
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}

          {actionTabs.length > 0 && (
            <div className="nav-section-label">
              <span className="nav-label">Redeem points</span>
            </div>
          )}

          {actionTabs.map((tab, idx) => {
            const name = getTabName(tab);
            const targetUrl = resolvePwaUrl(tab);
            const icon = getTabIcon(tab);
            const pwaRoute = `/pwa?url=${encodeURIComponent(targetUrl)}&label=${encodeURIComponent(name)}`;
            const isActive = `${location.pathname}${location.search}` === pwaRoute;

            return (
              <NavLink
                key={`${name}-${idx}`}
                to={pwaRoute}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                {icon && icon.startsWith('http') ? (
                  <span className="nav-item-img">
                    <img src={icon} alt="" />
                  </span>
                ) : (
                  <span className="material-icons">{icon || 'local_fire_department'}</span>
                )}
                <span className="nav-label">{name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="powered-by">Powered by Cheggout</p>
        </div>
      </aside>

      <div className="main-wrap">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span className="material-icons">menu</span>
            </button>
            <div className="brand-icon">
              <img src={bank.logoUrl || IOB_DEFAULT_LOGO} alt={bank.name || 'IOB'} />
            </div>
            <div>
              <span className="brand-name">{bank.name || 'Cheggout Rewards'}</span>
              <span className="brand-tagline">Rewards, powered by Cheggout</span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="points-chip" onClick={() => navigate('/cards')}>
              <span className="material-icons">stars</span>
              <div className="rewards-text">
                <span className="rewards-label">Total points</span>
                <span className="rewards-val">
                  {totalPoints === null ? '—' : totalPoints.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="refresh-icon-btn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title={isRefreshing ? 'Refreshing…' : 'Refresh points'}
              aria-label={isRefreshing ? 'Refreshing…' : 'Refresh points'}
            >
              <span
                className={`material-icons ${isRefreshing ? 'spin' : ''}`}
                style={{ fontSize: 18 }}
              >
                refresh
              </span>
            </button>

            <div className="user-menu-wrap" ref={userMenuRef}>
              <button
                type="button"
                className="user-btn"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <div className="avatar">
                  <span className="material-icons">person</span>
                </div>
                <span className="user-name">
                  +91 {user?.mobileNumber || ''}
                </span>
                <span className="material-icons caret">
                  {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <button type="button" className="dd-item danger" onClick={handleLogout}>
                    <span className="material-icons">logout</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

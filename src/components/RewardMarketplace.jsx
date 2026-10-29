import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BANK_NAME,
  EXCLUSIVE_OFFERS_IMG,
  fetchActionTabs,
  fetchTopGiftCards,
  fetchRewardsBanners,
  getTabName,
  resolvePwaUrl
} from '../services/api';

const CYCLE_INTERVAL = 3800;
const MAX_GIFT_CARDS = 4;
const MAX_SHOP_BANNERS = 4;
const GIFT_CARD_REGEX = /gift\s*card/i;
const SHOP_REGEX = /^shop$/i;
const EXCLUSIVE_OFFERS_REGEX = /exclusive\s*offers?/i;

export function RewardMarketplace({ onOpenRedeem }) {
  const navigate = useNavigate();
  const [giftCardTab, setGiftCardTab] = useState(null);
  const [shopTab, setShopTab] = useState(null);
  const [exclusiveTab, setExclusiveTab] = useState(null);

  const [giftCardImages, setGiftCardImages] = useState([]);
  const [shopBanners, setShopBanners] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [giftCardIdx, setGiftCardIdx] = useState(0);
  const [shopIdx, setShopIdx] = useState(0);

  useEffect(() => {
    const timer1 = setInterval(() => setGiftCardIdx((prev) => prev + 1), CYCLE_INTERVAL);
    const timer2 = setInterval(() => setShopIdx((prev) => prev + 1), CYCLE_INTERVAL + 400);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
    };
  }, []);

  useEffect(() => {
    Promise.all([
      fetchActionTabs(BANK_NAME).catch(() => []),
      fetchTopGiftCards(BANK_NAME, 1).catch(() => []),
      fetchRewardsBanners().catch(() => [])
    ])
      .then(([actionTabs, rawGiftCards, rawBanners]) => {
        const tabs = Array.isArray(actionTabs)
          ? actionTabs
          : actionTabs?.data ?? actionTabs?.list ?? actionTabs?.result ?? [];

        setGiftCardTab(tabs.find((t) => t.type === 'giftCard' || GIFT_CARD_REGEX.test(getTabName(t))) || null);
        setShopTab(tabs.find((t) => SHOP_REGEX.test(getTabName(t).trim())) || null);
        setExclusiveTab(tabs.find((t) => EXCLUSIVE_OFFERS_REGEX.test(getTabName(t))) || null);

        const giftList = (
          Array.isArray(rawGiftCards)
            ? rawGiftCards
            : rawGiftCards?.result ?? rawGiftCards?.data ?? rawGiftCards?.list ?? []
        )
          .flatMap((item) => item.giftCardDetails || [item])
          .filter(Boolean);

        const uniqueImgs = [...new Set(giftList.map((g) => g.gcpwa_img).filter(Boolean))].slice(0, MAX_GIFT_CARDS);
        setGiftCardImages(uniqueImgs);

        const banners = Array.isArray(rawBanners) ? rawBanners : rawBanners?.data ?? rawBanners?.result ?? [];
        const validBanners = banners
          .filter((b) => b.imageUrl)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .slice(0, MAX_SHOP_BANNERS);
        setShopBanners(validBanners);
      })
      .catch((err) => {
        console.error('Failed to load marketplace content:', err);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  const handleTabClick = (tab) => {
    // If it's a gift card or user wants quick redeem, open the instant redemption modal
    if (onOpenRedeem && (tab?.type === 'giftCard' || GIFT_CARD_REGEX.test(getTabName(tab)))) {
      onOpenRedeem();
      return;
    }

    const targetUrl = resolvePwaUrl(tab);
    if (targetUrl) {
      navigate(`/pwa?url=${encodeURIComponent(targetUrl)}&label=${encodeURIComponent(getTabName(tab))}`);
    } else if (onOpenRedeem) {
      onOpenRedeem();
    }
  };

  if (!isLoaded) return null;

  const hasGiftCards = giftCardTab && giftCardImages.length > 0;
  const hasShop = shopTab && shopBanners.length > 0;
  const hasExclusive = !!exclusiveTab;

  return (
    <div className="reward-marketplace luxury-card-panel">
      <div className="rm-header">
        <h3 className="rm-title">Exclusive Rewards & Offers</h3>
        <p className="rm-subtitle">Instant gift vouchers and shopping privileges</p>
      </div>

      <div className="rm-rows">
        {/* Gift Cards Row */}
        {hasGiftCards && (
          <div className="rm-row-block">
            <div className="rm-row-label-row">
              <span className="rm-row-label">{getTabName(giftCardTab) || 'Brand Gift Cards'}</span>
              <span className="deal-badge-green">Instant Code</span>
            </div>
            <div
              className="rm-row luxury-hover-lift"
              onClick={() => handleTabClick(giftCardTab)}
              role="button"
              tabIndex={0}
            >
              <div className="rm-row-img-wrap rm-row-img-wrap--wide">
                {giftCardImages.map((imgUrl, idx) => (
                  <img
                    key={imgUrl}
                    src={imgUrl}
                    alt="Gift Cards"
                    className={`rm-row-img ${idx === giftCardIdx % giftCardImages.length ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <div className="rm-card-overlay">
                <span className="overlay-cta">Redeem Vouchers ➔</span>
              </div>
            </div>
          </div>
        )}

        {/* Shop Row */}
        {hasShop && (
          <div className="rm-row-block">
            <div className="rm-row-label-row">
              <span className="rm-row-label">{getTabName(shopTab) || 'Shop Brands'}</span>
              <span className="deal-badge-gold">5X Multiplier</span>
            </div>
            <div
              className="rm-row luxury-hover-lift"
              onClick={() => handleTabClick(shopTab)}
              role="button"
              tabIndex={0}
            >
              <div className="rm-row-img-wrap rm-row-img-wrap--tall">
                {shopBanners.map((banner, idx) => (
                  <img
                    key={banner.id || banner.imageUrl}
                    src={banner.imageUrl}
                    alt={banner.text || 'Shop'}
                    className={`rm-row-img ${idx === shopIdx % shopBanners.length ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <div className="rm-card-overlay">
                <span className="overlay-cta">Explore Brands ➔</span>
              </div>
            </div>
          </div>
        )}

        {/* Exclusive Offers Row */}
        {hasExclusive && (
          <div className="rm-row-block">
            <div className="rm-row-label-row">
              <span className="rm-row-label">{getTabName(exclusiveTab) || 'Exclusive Deals'}</span>
              <span className="deal-badge-purple">IOB Special</span>
            </div>
            <div
              className="rm-row luxury-hover-lift"
              onClick={() => handleTabClick(exclusiveTab)}
              role="button"
              tabIndex={0}
            >
              <div className="rm-row-img-wrap rm-row-img-wrap--tall">
                <img
                  src={EXCLUSIVE_OFFERS_IMG}
                  alt="Exclusive Offers"
                  className="rm-row-img is-active"
                />
              </div>
              <div className="rm-card-overlay">
                <span className="overlay-cta">View Deals ➔</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BANK_NAME,
  EXCLUSIVE_OFFERS_IMG,
  fetchActionTabs,
  fetchTopGiftCards,
  fetchRewardsBanners,
  getTabName,
  getTabUrl,
  resolvePwaUrl
} from '../services/api';

const CYCLE_INTERVAL = 3500;
const MAX_GIFT_CARDS = 4;
const MAX_SHOP_BANNERS = 4;
const GIFT_CARD_REGEX = /gift\s*card/i;
const SHOP_REGEX = /^shop$/i;
const EXCLUSIVE_OFFERS_REGEX = /exclusive\s*offers?/i;

export function RewardMarketplace() {
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
    const targetUrl = resolvePwaUrl(tab);
    if (targetUrl) {
      navigate(`/pwa?url=${encodeURIComponent(targetUrl)}&label=${encodeURIComponent(getTabName(tab))}`);
    }
  };

  if (!isLoaded) return null;

  const hasGiftCards = giftCardTab && giftCardImages.length > 0;
  const hasShop = shopTab && shopBanners.length > 0;
  const hasExclusive = !!exclusiveTab;

  if (!hasGiftCards && !hasShop && !hasExclusive) return null;

  return (
    <div className="reward-marketplace">
      <p className="rm-title">Redeem your points</p>
      <div className="rm-rows">
        {hasGiftCards && (
          <div className="rm-row-block">
            <p className="rm-row-label">{getTabName(giftCardTab) || 'Gift Cards'}</p>
            <div className="rm-row" onClick={() => handleTabClick(giftCardTab)}>
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
            </div>
          </div>
        )}

        {hasShop && (
          <div className="rm-row-block">
            <p className="rm-row-label">{getTabName(shopTab) || 'Shop'}</p>
            <div className="rm-row" onClick={() => handleTabClick(shopTab)}>
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
            </div>
          </div>
        )}

        {hasExclusive && (
          <div className="rm-row-block">
            <p className="rm-row-label">{getTabName(exclusiveTab) || 'Exclusive Offers'}</p>
            <div className="rm-row" onClick={() => handleTabClick(exclusiveTab)}>
              <div className="rm-row-img-wrap rm-row-img-wrap--tall">
                <img
                  src={EXCLUSIVE_OFFERS_IMG}
                  alt="Exclusive Offers"
                  className="rm-row-img is-active"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

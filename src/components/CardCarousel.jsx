import React, { useState, useEffect, useRef } from 'react';
import { CreditCardTile } from './CreditCardTile';

const AUTO_ROTATE_DELAY = 4000;
const RESUME_DELAY = 6000;

export function CardCarousel({ cards = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (isPaused || cards.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, AUTO_ROTATE_DELAY);

    return () => clearInterval(interval);
  }, [isPaused, cards.length]);

  useEffect(() => {
    return () => clearTimeout(resumeTimerRef.current);
  }, []);

  const handleManualAction = () => {
    setIsPaused(true);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY);
  };

  const goToSlide = (idx) => {
    handleManualAction();
    setActiveIndex(idx);
  };

  const prevSlide = () => goToSlide((activeIndex - 1 + cards.length) % cards.length);
  const nextSlide = () => goToSlide((activeIndex + 1) % cards.length);

  if (cards.length === 0) return null;

  return (
    <div className="card-carousel">
      <div
        className="card-carousel-body"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={handleManualAction}
      >
        <div className="card-carousel-stack">
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              className={`card-carousel-slide${idx === activeIndex ? ' is-active' : ''}`}
            >
              <CreditCardTile card={card} />
            </div>
          ))}
        </div>

        {cards.length > 1 && (
          <>
            <button
              type="button"
              className="carousel-nav-btn carousel-nav-prev"
              onClick={prevSlide}
              aria-label="Previous card"
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <button
              type="button"
              className="carousel-nav-btn carousel-nav-next"
              onClick={nextSlide}
              aria-label="Next card"
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </>
        )}
      </div>

      {cards.length > 1 && (
        <div className="carousel-dots">
          {cards.map((card, idx) => (
            <button
              key={card.id || idx}
              type="button"
              className={`carousel-dot${idx === activeIndex ? ' active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to card ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

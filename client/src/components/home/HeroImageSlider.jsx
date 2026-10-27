import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Domain-curated high quality food rescue and fresh produce images
const SLIDES = [
  {
    id: 'banquet-meals',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1000&q=80',
    fallbackBg: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
    tag: 'SURPLUS RESCUE',
    title: 'Fresh Banquet & Event Meals',
    subtitle: 'Connecting fresh surplus from weddings and caterers to local shelters.'
  },
  {
    id: 'fresh-produce',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80',
    fallbackBg: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)',
    tag: 'FARM HARVEST',
    title: 'Nutritious Fresh Produce',
    subtitle: 'Rescuing wholesome fruits and vegetables to nourish families in need.'
  },
  {
    id: 'cooked-curry',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    fallbackBg: 'linear-gradient(135deg, #831843 0%, #500724 100%)',
    tag: 'WARM DINNERS',
    title: 'Delivered Warm & Fresh',
    subtitle: 'Speedy volunteer couriers ensure safe, timely doorstep distribution.'
  },
  {
    id: 'community-nourish',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
    fallbackBg: 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)',
    tag: 'COMMUNITY IMPACT',
    title: 'Bridging Surplus to Empty Plates',
    subtitle: 'Together preventing food waste while feeding dignity and hope.'
  }
];

export const HeroImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Touch tracking for mobile swipe gestures
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Check reduced-motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // 3-second automatic rotation (paused on hover or if reduced motion is enabled)
  useEffect(() => {
    if (isHovered || prefersReducedMotion) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [isHovered, prefersReducedMotion, handleNext]);

  // Touch events for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // 40px swipe threshold
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageLoad = (id) => {
    setImagesLoaded((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      className="hero-slider-container"
      aria-label="Food Rescue Highlights Carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slider-track">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          const isFailed = imageErrors[slide.id];
          const isLoaded = imagesLoaded[slide.id];

          return (
            <div
              key={slide.id}
              className={`hero-slider-slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
              style={{
                background: isFailed ? slide.fallbackBg : '#241b14',
                transition: prefersReducedMotion ? 'none' : 'opacity 0.6s ease-in-out'
              }}
            >
              {/* Background Image with Fallback */}
              {!isFailed ? (
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`hero-slider-img ${isLoaded ? 'loaded' : ''}`}
                  onLoad={() => handleImageLoad(slide.id)}
                  onError={() => handleImageError(slide.id)}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ) : (
                /* Fallback stylized gradient illustration */
                <div className="hero-slider-fallback">
                  <div className="fallback-pattern" />
                </div>
              )}

              {/* Scrim Gradient Overlay for contrast and readability */}
              <div className="hero-slider-overlay" />

              {/* Slide Content */}
              <div className="hero-slider-content">
                <span className="hero-slider-tag">
                  {slide.tag}
                </span>
                <h2 className="hero-slider-title">{slide.title}</h2>
                <p className="hero-slider-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Previous Arrow */}
      <button
        type="button"
        className="hero-slider-nav hero-slider-prev"
        onClick={handlePrev}
        aria-label="Previous slide"
        title="Previous banner"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Manual Next Arrow */}
      <button
        type="button"
        className="hero-slider-nav hero-slider-next"
        onClick={handleNext}
        aria-label="Next slide"
        title="Next banner"
      >
        <ChevronRight size={18} />
      </button>

      {/* Pagination Dots */}
      <div className="hero-slider-pagination" role="tablist">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            className={`hero-slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
};

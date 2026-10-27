import React from 'react';

export const BrandLogo = ({ size = 32, showText = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, textDecoration: 'none' }}>
      {/* Unique AnnaSetu Emblem: Bridge of Nourishment & Caring Hands */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized Arch Bridge ("Setu") */}
          <path
            d="M2 18C4.5 12.5 8 10 12 10C16 10 19.5 12.5 22 18"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Bridge Support Pillars */}
          <path
            d="M6 14.5V18M18 14.5V18M12 11V18"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Sacred Golden Grain Ear / Sprout ("Anna" - Sustenance) */}
          <path
            d="M12 2C12 2 15 4 15 7C15 8.5 13.8 9.5 12 9.5C10.2 9.5 9 8.5 9 7C9 4 12 2 12 2Z"
            fill="#FEF3C7"
          />
          <path
            d="M12 4.5V8.5"
            stroke="#B45309"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Heart Emblem inside Bridge Center */}
          <circle cx="12" cy="14" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: '17px',
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              whiteSpace: 'nowrap'
            }}
          >
            Anna<span style={{ color: 'var(--brand-600)' }}>Setu</span>
          </span>
          <span
            style={{
              fontSize: '9.5px',
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            अन्नसेतु • Food Bridge
          </span>
        </div>
      )}
    </div>
  );
};

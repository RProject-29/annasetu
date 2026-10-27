import React, { useMemo } from 'react';
import { Button } from '../../components/common/Button';
import { StatusChip } from '../../components/common/StatusChip';
import { HeroImageSlider } from '../../components/home/HeroImageSlider';
import { DONATION_STATUS } from '../../constants/donationStatus';
import { DONOR_INSPIRATIONAL_QUOTES } from '../../constants/donorQuotes';
import {
  PlusCircle,
  Clock,
  MapPin,
  Utensils,
  ChevronRight,
  CheckCircle2,
  UtensilsCrossed,
  HeartHandshake,
  LogIn,
  Quote
} from 'lucide-react';

export const DonorDashboard = ({
  donations = [],
  donorUser = null,
  onOpenDonorLogin,
  onNavigateReport,
  onSelectDonation
}) => {
  // 10 Random quotes that change on each visit
  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * DONOR_INSPIRATIONAL_QUOTES.length);
    return DONOR_INSPIRATIONAL_QUOTES[idx];
  }, []);

  const isLoggedIn = Boolean(donorUser && donorUser.name && donorUser.isLoggedIn !== false);
  const donorName = isLoggedIn ? donorUser.name : null;
  const donorOrg = isLoggedIn ? donorUser.org : null;

  // Filter to show ONLY real reports added by user with images
  const realDonations = donations.filter(
    d => d.isRealUserReport || d.isUserCreated || (d.foodPhoto && d.foodPhoto.startsWith('data:'))
  );

  const completedCount = realDonations.filter(d => d.status === DONATION_STATUS.COMPLETED).length;
  const totalMeals = realDonations
    .filter(d => d.status === DONATION_STATUS.COMPLETED)
    .reduce((sum, d) => sum + (Number(d.quantityMeals) || 0), 0);

  const handleDonateClick = () => {
    if (!isLoggedIn && onOpenDonorLogin) {
      onOpenDonorLogin('Please sign in or enter your name to link your food donation.');
    } else {
      onNavigateReport();
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* 1. Hero Image Slider / Banner at top of homepage below navbar */}
      <HeroImageSlider />

      {/* Welcome Greeting Banner (Personalized by Login Name) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '15.5px', fontWeight: 800, letterSpacing: '-0.01em', margin: 0, color: 'var(--text-primary)' }}>
            {isLoggedIn ? `Namaste, ${donorName} 🙏` : 'Namaste, Annadata 🙏'}
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
            {isLoggedIn
              ? (donorOrg || 'Surplus Food Donor')
              : 'Sign in to personalize your donations'}
          </p>
        </div>

        {isLoggedIn ? (
          <div
            style={{
              padding: '3px 9px',
              backgroundColor: 'var(--status-success-bg)',
              border: '1px solid var(--status-success-border)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 700,
              color: 'var(--status-success-text)',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
          >
            <CheckCircle2 size={12} style={{ color: 'var(--status-success-solid)' }} />
            <span>Active Donor</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenDonorLogin && onOpenDonorLogin()}
            style={{
              padding: '4px 9px',
              backgroundColor: 'var(--brand-50)',
              border: '1px solid var(--brand-400)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--brand-700)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <LogIn size={12} />
            <span>Login as Donor</span>
          </button>
        )}
      </div>

      {/* Unique Anna Prerana (Food Wisdom & Community Motivation) Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FEF8ED 100%)',
          border: '1px solid #F3DFC1',
          borderLeft: '3.5px solid var(--brand-500)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-100)',
                color: 'var(--brand-700)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Quote size={10} style={{ transform: 'rotate(180deg)' }} />
            </div>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 800,
                color: 'var(--brand-700)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              Anna Prerana • अन्न प्रेरणा
            </span>
          </div>

          <span
            style={{
              fontSize: '9px',
              fontWeight: 650,
              color: 'var(--text-tertiary)',
              backgroundColor: '#FFFFFF',
              padding: '1.5px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #ECE4D8'
            }}
          >
            Daily Inspiration
          </span>
        </div>

        <p
          style={{
            fontSize: '11px',
            color: '#78350F',
            fontWeight: 600,
            margin: 0,
            fontStyle: 'italic',
            lineHeight: 1.4,
            paddingLeft: '2px'
          }}
        >
          "{randomQuote}"
        </p>
      </div>

      {/* Priority 2: Inspiring Motivational Donation Action Card (Enhanced & Reduced Text) */}
      <div
        className="as-card donor-motivational-card"
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF6E7 60%, #FEF0D4 100%)',
          border: '1.5px solid #F59E0B',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 14px',
          boxShadow: '0 4px 18px rgba(217, 119, 6, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Motivational Impact Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '9.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#92400E',
              backgroundColor: '#FEF3C7',
              padding: '2.5px 7px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #FDE68A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>❤️</span>
            <span>Your 1 Donation Can Save 100+ Lives!</span>
          </span>
        </div>

        <div>
          <h2
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#1C1917',
              lineHeight: 1.25,
              margin: '0 0 4px'
            }}
          >
            Turn Your Surplus Food Into Lifesaving Meals
          </h2>
          <p style={{ fontSize: '11px', color: '#57534E', lineHeight: 1.4, margin: 0 }}>
            Feed hungry children and families with your event's extra cooked dishes. Verified volunteers collect and deliver within 30 minutes.
          </p>
        </div>

        {/* Micro-Impact Highlights */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', fontSize: '10px', fontWeight: 600 }}>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.85)', padding: '2.5px 7px', borderRadius: 'var(--radius-sm)', color: '#92400E', border: '1px solid #FDE68A' }}>
            🍲 Feeds 50–500+
          </span>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.85)', padding: '2.5px 7px', borderRadius: 'var(--radius-sm)', color: '#065F46', border: '1px solid #A7F3D0' }}>
            ⏱️ 30-Min Rapid Pickup
          </span>
          <span style={{ backgroundColor: 'rgba(255,255,255,0.85)', padding: '2.5px 7px', borderRadius: 'var(--radius-sm)', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
            🤝 Verified Direct Shelters
          </span>
        </div>

        {/* Big Exciting Donation Action Button */}
        <Button
          variant="primary"
          size="md"
          block
          icon={HeartHandshake}
          onClick={handleDonateClick}
          style={{
            marginTop: '2px',
            fontWeight: 800,
            fontSize: '13px',
            padding: '9px 12px',
            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
          }}
        >
          Donate Surplus Food Now
        </Button>
      </div>

      {/* Priority 3: Community Impact Counter — Distinct Color Shades */}
      <div className="responsive-2col">
        <div
          className="as-card"
          style={{
            padding: '10px 12px',
            background: 'linear-gradient(135deg, #FFFDF8 0%, #FEF8ED 100%)',
            borderColor: '#F4E2C7'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--brand-700)', marginBottom: '3px' }}>
            <UtensilsCrossed size={13} style={{ color: 'var(--brand-600)' }} />
            <span style={{ fontSize: '10.5px', fontWeight: 650 }}>Meals Rescued</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-family-display)' }}>
            {totalMeals}
          </span>
          <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '1px' }}>
            Nourishing community members
          </p>
        </div>

        <div
          className="as-card"
          style={{
            padding: '10px 12px',
            background: 'linear-gradient(135deg, #F8FDFB 0%, #EEF9F3 100%)',
            borderColor: '#D1EFE0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--status-success-text)', marginBottom: '3px' }}>
            <CheckCircle2 size={13} style={{ color: 'var(--status-success-solid)' }} />
            <span style={{ fontSize: '10.5px', fontWeight: 650 }}>Rescues Closed</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-family-display)' }}>
            {completedCount}
          </span>
          <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '1px' }}>
            Zero food waste events
          </p>
        </div>
      </div>

      {/* Priority 4: Recent Donations Preview (Real User Reports Only) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Reports</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            {realDonations.length} real {realDonations.length === 1 ? 'report' : 'reports'}
          </span>
        </div>

        {realDonations.length === 0 ? (
          /* Empty State when no real user reports have been added yet */
          <div
            className="as-card"
            style={{
              padding: '22px 16px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              border: '1.5px dashed var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '32px' }}>🍲</div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              No Surplus Reports Added Yet
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4, maxWidth: '280px' }}>
              When you report surplus food with real photos, your live rescue timeline and volunteer updates will show up here.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon={PlusCircle}
              onClick={handleDonateClick}
              style={{ fontWeight: 700, marginTop: '4px' }}
            >
              Report First Food Donation
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {realDonations.map((item) => (
              <div
                key={item.id}
                className="as-card as-card-interactive"
                onClick={() => onSelectDonation(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '12px 14px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 180px' }}>
                  {item.foodPhoto && (
                    <img
                      src={item.foodPhoto}
                      alt=""
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-default)' }}
                    />
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        #{item.publicReference}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>• {item.eventType}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                      {item.foodDescription}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <StatusChip status={item.status} />
                  <ChevronRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


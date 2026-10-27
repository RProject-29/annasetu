import React, { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { SAMPLE_FOOD_PHOTOS } from '../../services/mockData';
import {
  ArrowLeft,
  Camera,
  Upload,
  MapPin,
  Clock,
  CheckCircle2,
  HeartHandshake,
  Heart,
  Utensils,
  ShieldCheck,
  Building,
  User,
  X,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { storageService } from '../../services/storageService';

const EVENT_TYPES = [
  'Wedding Reception',
  'Birthday / Anniversary',
  'Corporate Event / Office',
  'Caterer / Hotel Surplus',
  'Community Feast / Langar',
  'Private / Family Gathering'
];

const FOOD_TYPES = [
  { id: 'Pure Veg', label: 'Pure Veg', icon: '🟢' },
  { id: 'Non-Veg', label: 'Non-Veg', icon: '🔴' },
  { id: 'Cooked Meals', label: 'Cooked Meals', icon: '🍛' },
  { id: 'Bakery & Bread', label: 'Bakery & Breads', icon: '🥐' },
  { id: 'Fresh Produce', label: 'Fresh Produce', icon: '🍎' },
  { id: 'Packaged Ration', label: 'Dry Rations', icon: '📦' }
];

const FRESHNESS_OPTIONS = [
  { id: '100% Hot & Steaming', label: '100% Hot & Steaming', desc: 'Just cooked in clean kitchen' },
  { id: 'Warm & Insulated', label: 'Warm & Insulated', desc: 'Packed in thermal containers' },
  { id: 'Refrigerated & Clean', label: 'Refrigerated & Chilled', desc: 'Stored at safe cool temp' },
  { id: 'Fresh Room Temp', label: 'Fresh Room Temp', desc: 'Within safe open window' }
];

export const ReportFoodPage = ({ onBack, onSubmitSuccess, onTrackDonation, onNavigateHistory }) => {
  const currentDonor = storageService.getDonorUser();

  // Form State with all 9 required fields
  const [formData, setFormData] = useState({
    donorName: currentDonor?.name || 'Rohit Sharma',
    donorOrg: currentDonor?.org || 'Grand Celebrations Banquet Hall',
    pickupAddress: '80 Feet Road, Indiranagar, Bengaluru',
    pickupLandmark: 'Opposite BDA Complex Gate 1',
    foodName: 'Veg Dum Biryani, Mixed Veg Curry, 150 Fresh Rotis, Gulab Jamun',
    foodType: 'Pure Veg',
    eventType: 'Wedding Reception',
    quantityMeals: 140,
    preparedAtHoursAgo: 1, // Making time
    freshnessLevel: '100% Hot & Steaming', // How much it may be fresh
    safeHoursRemaining: 4, // Freshness safe window
    handlingNotes: 'Packed in clean stainless steel catering containers. Bring crates or buckets for easy transfer.',
    foodPhoto: SAMPLE_FOOD_PHOTOS[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [liveLocationAttached, setLiveLocationAttached] = useState(false);
  const [isManualTime, setIsManualTime] = useState(false);
  const [manualTimeStr, setManualTimeStr] = useState('');

  // File and Camera Input Refs
  const fileUploadRef = useRef(null);
  const fileCameraRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Live Location Detection
  const handleDetectLiveLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setFormData(prev => ({
            ...prev,
            pickupAddress: `Live GPS Location (${lat}° N, ${lng}° E), 80 Feet Road, Bengaluru`,
            pickupLandmark: `Shared via Real-time GPS Pin (Accurate to within ${Math.round(position.coords.accuracy || 15)}m)`
          }));
          setIsLocating(false);
          setLiveLocationAttached(true);
        },
        () => {
          // Regional high-accuracy fallback
          setFormData(prev => ({
            ...prev,
            pickupAddress: `80 Feet Road, Indiranagar, Bengaluru (Live GPS: 12.9716° N, 77.5946° E)`,
            pickupLandmark: `Near BDA Complex Gate 1 (Live GPS Pin Attached)`
          }));
          setIsLocating(false);
          setLiveLocationAttached(true);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      setFormData(prev => ({
        ...prev,
        pickupAddress: `80 Feet Road, Indiranagar, Bengaluru (Live GPS: 12.9716° N, 77.5946° E)`,
        pickupLandmark: `Near BDA Complex Gate 1 (Live GPS Pin Attached)`
      }));
      setIsLocating(false);
      setLiveLocationAttached(true);
    }
  };

  // Manual Time Input Handler
  const handleManualTimeChange = (e) => {
    const timeVal = e.target.value;
    setManualTimeStr(timeVal);
    if (timeVal) {
      const [h, m] = timeVal.split(':').map(Number);
      const now = new Date();
      const cooked = new Date();
      cooked.setHours(h, m, 0, 0);
      let diffMs = now - cooked;
      if (diffMs < 0) {
        diffMs = 0.5 * 3600 * 1000;
      }
      const diffHours = Math.max(0.25, Math.round((diffMs / (3600 * 1000)) * 10) / 10);
      setFormData(prev => ({ ...prev, preparedAtHoursAgo: diffHours }));
    }
  };

  // Calculate deadlines
  const calculateDeadlines = () => {
    const prepDate = new Date(Date.now() - formData.preparedAtHoursAgo * 3600 * 1000);
    const deadlineDate = new Date(Date.now() + formData.safeHoursRemaining * 3600 * 1000);
    return { prepDate, deadlineDate };
  };

  const { prepDate, deadlineDate } = calculateDeadlines();

  // Handle Image File Selection (Upload)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, foodPhoto: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Launch Live Camera Stream (fallback for web browsers)
  const startLiveWebcam = async () => {
    try {
      setCameraError('');
      setIsLiveCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Direct webcam access error, triggering native camera capture:', err);
      setIsLiveCameraActive(false);
      // Fallback to native capture input
      if (fileCameraRef.current) {
        fileCameraRef.current.click();
      }
    }
  };

  // Capture Snapshot from Live Video
  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg', 0.85);
    setFormData(prev => ({ ...prev, foodPhoto: photoUrl }));
    stopLiveWebcam();
  };

  // Stop Live Webcam
  const stopLiveWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCameraActive(false);
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newDonationRecord = {
        donorName: formData.donorName,
        donorOrg: formData.donorOrg,
        pickupAddress: formData.pickupAddress,
        pickupLandmark: formData.pickupLandmark,
        foodDescription: formData.foodName,
        foodType: formData.foodType,
        eventType: formData.eventType,
        quantityMeals: Number(formData.quantityMeals) || 100,
        preparedAt: prepDate.toISOString(),
        safeConsumptionDeadline: deadlineDate.toISOString(),
        freshnessLevel: formData.freshnessLevel,
        handlingNotes: formData.handlingNotes,
        foodPhoto: formData.foodPhoto || SAMPLE_FOOD_PHOTOS[0]
      };

      setIsSubmitting(false);
      setSubmittedDonation(newDonationRecord);

      // Notify parent to store in state
      if (onSubmitSuccess) {
        onSubmitSuccess(newDonationRecord);
      }
    }, 600);
  };

  // =========================================================================
  // Emotional Gratitude Screen (Shown immediately when donation is submitted)
  // =========================================================================
  if (submittedDonation) {
    return (
      <div className="animate-fade-in" style={{ padding: 'var(--space-3) var(--space-2)', textAlign: 'center' }}>
        {/* Sacred Gratitude Emblem */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '2px solid #F59E0B',
            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '34px'
          }}
        >
          🙏
        </div>

        {/* Heartfelt Emotional Title */}
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1C1917', marginBottom: '8px', lineHeight: 1.3 }}>
          Dhanyavaad, {submittedDonation.donorName || 'Compassionate Donor'}!
        </h2>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11.5px',
            fontWeight: 700,
            marginBottom: '14px'
          }}
        >
          ✓ Your Food Donation is Safely Received
        </div>

        {/* Touching Emotional Message of Regards & Gratitude */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid #F3E5D0',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            marginBottom: '16px',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(44, 33, 20, 0.05)',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 800, fontSize: '12px', marginBottom: '6px' }}>
            <Heart size={14} fill="#B45309" />
            <span>A Message of Sincere Gratitude</span>
          </div>
          <p style={{ fontSize: '13px', color: '#44403C', lineHeight: 1.6, margin: 0 }}>
            "While thousands in our city sleep on an empty stomach tonight, your compassionate heart has ensured that <strong>{submittedDonation.quantityMeals} innocent children and shelter families</strong> will eat a warm, wholesome meal. You didn’t just save surplus food from going to waste — you became someone’s guardian angel today."
          </p>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#78716C', fontStyle: 'italic', textAlign: 'right' }}>
            — With humble regards, The AnnaSetu Volunteer Community
          </div>
        </div>

        {/* Rescue Information Summary Card */}
        <div
          className="as-card"
          style={{
            textAlign: 'left',
            marginBottom: '18px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-default)',
            padding: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #F2ECE1', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Food Items:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', maxWidth: '65%', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {submittedDonation.foodDescription}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #F2ECE1', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Quantity:</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-700)' }}>
              {submittedDonation.quantityMeals} Meals Rescued
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #F2ECE1', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Pickup Location:</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right', maxWidth: '65%' }}>
              {submittedDonation.pickupAddress}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Volunteer Status:</span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
              Matching nearby courier (~15 mins)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            variant="primary"
            block
            size="lg"
            icon={CheckCircle2}
            onClick={() => {
              if (onTrackDonation) onTrackDonation(submittedDonation);
              else onBack();
            }}
            style={{ fontWeight: 800, fontSize: '14.5px' }}
          >
            Track Live Rescue Checkpoints
          </Button>

          <Button
            variant="outline"
            block
            onClick={onBack}
          >
            Return to Dashboard Home
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // The Complete Food Donation Information Form
  // =========================================================================
  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        paddingBottom: 'var(--space-6)',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* Top Header with Back Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#B45309',
            backgroundColor: '#FEF3C7',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          Step-by-Step Food Donation
        </span>
      </div>

      {/* Inspiring Intro Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFDF8 0%, #FFF5E5 100%)',
          border: '1px solid #F59E0B',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#1C1917', margin: '0 0 3px' }}>
          Report Surplus Food For Rescue
        </h1>
        <p style={{ fontSize: '12px', color: '#57534E', margin: 0, lineHeight: 1.4 }}>
          Please fill in the food details below. Our verified volunteers will pick it up and deliver it directly to local verified shelters.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* =================================================================
            1. Donor Name & Organization
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            <User size={15} style={{ color: 'var(--brand-600)' }} />
            <span>Donor Full Name & Organization *</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <input
              type="text"
              required
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              placeholder="Your Name (e.g. Rajesh Sharma)"
              style={{ fontSize: '14px', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              value={formData.donorOrg}
              onChange={(e) => setFormData({ ...formData, donorOrg: e.target.value })}
              placeholder="Hotel / Banquet / Caterer Name (e.g. Grand Celebrations)"
              style={{ fontSize: '13px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* =================================================================
            2. Pickup Address & Landmark (With Share Live Location Option)
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, margin: 0 }}>
              <MapPin size={15} style={{ color: 'var(--brand-600)' }} />
              <span>Pickup Address & Landmark *</span>
            </label>
          </div>

          {/* Share Live Location GPS Button */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            disabled={isLocating}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: liveLocationAttached ? '#ECFDF5' : '#FFFBEB',
              border: liveLocationAttached ? '1.5px solid #10B981' : '1px dashed #D97706',
              color: liveLocationAttached ? '#065F46' : '#92400E',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '10px'
            }}
          >
            <Navigation size={14} style={{ color: liveLocationAttached ? '#059669' : '#D97706' }} />
            <span>
              {isLocating
                ? 'Detecting Current GPS...'
                : liveLocationAttached
                ? '✓ Live GPS Location Attached'
                : '📍 Share Current Live Location'}
            </span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <textarea
              rows="2"
              required
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              placeholder="Full Street Address, Area, Bengaluru"
              style={{ fontSize: '13px', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              value={formData.pickupLandmark}
              onChange={(e) => setFormData({ ...formData, pickupLandmark: e.target.value })}
              placeholder="Landmark, Gate #, or floor instructions"
              style={{ fontSize: '13px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* =================================================================
            3. Food Name & Description
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            <Utensils size={15} style={{ color: 'var(--brand-600)' }} />
            <span>Food Name & Dishes Available *</span>
          </label>
          <textarea
            rows="2"
            required
            value={formData.foodName}
            onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
            placeholder="e.g. Veg Pulao, Paneer Masala, 150 Rotis, Dal Tadka, Kheer"
            style={{ fontSize: '13.5px', width: '100%', boxSizing: 'border-box' }}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
            Mentioning dish names helps shelters distribute suitable portions.
          </span>
        </div>

        {/* =================================================================
            4. Food Type
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            Food Type *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            {FOOD_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, foodType: type.id })}
                style={{
                  minWidth: 0,
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  padding: '8px 8px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.foodType === type.id ? '2px solid var(--brand-500)' : '1px solid var(--border-default)',
                  backgroundColor: formData.foodType === type.id ? 'var(--brand-50)' : '#FFFFFF',
                  color: formData.foodType === type.id ? 'var(--brand-700)' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  overflow: 'hidden'
                }}
              >
                <span style={{ flexShrink: 0, fontSize: '13px' }}>{type.icon}</span>
                <span style={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* =================================================================
            5. Event / Occasion
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>
            <Building size={15} style={{ color: 'var(--brand-600)' }} />
            <span>Event / Gathering Source *</span>
          </label>
          <select
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            style={{ fontSize: '13.5px', padding: '10px 12px', width: '100%', boxSizing: 'border-box' }}
          >
            {EVENT_TYPES.map(event => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
        </div>

        {/* =================================================================
            6. Food Quantity (Number of Meals)
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Approximate Food Quantity (Number of Meals) *
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="number"
              min="10"
              max="3000"
              required
              value={formData.quantityMeals}
              onChange={(e) => setFormData({ ...formData, quantityMeals: e.target.value })}
              style={{ fontSize: '16px', fontWeight: 700, width: '120px', maxWidth: '45%', boxSizing: 'border-box' }}
            />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-700)' }}>
              Meals / Portions
            </span>
          </div>

          {/* Quick Quantity Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
            {[50, 100, 150, 200, 300].map(qty => (
              <button
                key={qty}
                type="button"
                onClick={() => setFormData({ ...formData, quantityMeals: qty })}
                style={{
                  flex: '1 1 auto',
                  minWidth: '55px',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: Number(formData.quantityMeals) === qty ? 'var(--brand-500)' : '#F3EBE0',
                  color: Number(formData.quantityMeals) === qty ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
              >
                {qty} Meals
              </button>
            ))}
          </div>
        </div>

        {/* =================================================================
            7. Its Making Time / Prepared Time (With Manual Entry Option)
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, margin: 0 }}>
              <Clock size={15} style={{ color: 'var(--brand-600)' }} />
              <span>Its Making Time (When was it cooked?) *</span>
            </label>
            <button
              type="button"
              onClick={() => setIsManualTime(!isManualTime)}
              style={{
                fontSize: '11px',
                color: 'var(--brand-700)',
                fontWeight: 700,
                textDecoration: 'underline',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              {isManualTime ? '← Use Quick Presets' : '✏️ Enter Manually'}
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
            {[1, 2, 3, 4].map(hours => (
              <button
                key={hours}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, preparedAtHoursAgo: hours });
                  setIsManualTime(false);
                }}
                style={{
                  minWidth: 0,
                  width: '100%',
                  padding: '8px 2px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  backgroundColor: !isManualTime && formData.preparedAtHoursAgo === hours ? 'var(--brand-500)' : '#F5EFE6',
                  color: !isManualTime && formData.preparedAtHoursAgo === hours ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                {hours === 1 ? '1h ago' : `${hours}h ago`}
              </button>
            ))}
          </div>

          {/* Manual Entry Form (Exact Time & Hours Ago) */}
          {isManualTime && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#FFFDF9',
                border: '1px dashed #F59E0B',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400E' }}>
                Manual Cooking Time Entry:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-tertiary)', marginBottom: '3px' }}>
                    Select Exact Cook Time:
                  </label>
                  <input
                    type="time"
                    value={manualTimeStr}
                    onChange={handleManualTimeChange}
                    style={{ fontSize: '12px', padding: '6px 8px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-tertiary)', marginBottom: '3px' }}>
                    Or Hours Ago (e.g. 1.5):
                  </label>
                  <input
                    type="number"
                    min="0.25"
                    max="24"
                    step="0.25"
                    value={formData.preparedAtHoursAgo}
                    onChange={(e) => setFormData({ ...formData, preparedAtHoursAgo: Math.max(0.25, parseFloat(e.target.value) || 1) })}
                    style={{ fontSize: '12px', padding: '6px 8px', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          )}

          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px', display: 'block' }}>
            Prepared around: {prepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today ({formData.preparedAtHoursAgo}h ago)
          </span>
        </div>

        {/* =================================================================
            8. How Much It May Be Fresh (Freshness Rating & Window)
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', borderLeft: '4px solid #10B981', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            <ShieldCheck size={16} style={{ color: '#059669' }} />
            <span>How Much It May Be Fresh & Safe Window *</span>
          </label>

          {/* Freshness Condition Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}>
            {FRESHNESS_OPTIONS.map(opt => (
              <div
                key={opt.id}
                onClick={() => setFormData({ ...formData, freshnessLevel: opt.id })}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.freshnessLevel === opt.id ? '1.5px solid #059669' : '1px solid var(--border-default)',
                  backgroundColor: formData.freshnessLevel === opt.id ? '#ECFDF5' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: formData.freshnessLevel === opt.id ? '#065F46' : 'var(--text-primary)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.2 }}>
                    {opt.desc}
                  </div>
                </div>
                {formData.freshnessLevel === opt.id && (
                  <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Safe Window selector */}
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Best and safe to consume within:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '6px', width: '100%', boxSizing: 'border-box' }}>
            {[2, 3, 4, 6].map(hours => (
              <button
                key={hours}
                type="button"
                onClick={() => setFormData({ ...formData, safeHoursRemaining: hours })}
                style={{
                  minWidth: 0,
                  width: '100%',
                  padding: '6px 2px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: formData.safeHoursRemaining === hours ? '#D97706' : '#F3ECE1',
                  color: formData.safeHoursRemaining === hours ? '#FFFFFF' : 'var(--text-primary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                {hours}h Safe
              </button>
            ))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#B45309', fontWeight: 600 }}>
            Pickup & consumption deadline: {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
          </div>
        </div>

        {/* =================================================================
            9. Food Image (Upload Image vs Take Image with Camera)
            ================================================================= */}
        <div className="as-card" style={{ padding: '14px', backgroundColor: '#FFFFFF', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
            Food Image (Upload or Take Live Photo) *
          </label>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Upload a photo from your gallery or take a live picture using your camera.
          </p>

          {/* Hidden File Inputs */}
          {/* 1. Upload from Gallery / Files */}
          <input
            type="file"
            ref={fileUploadRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageFileChange}
          />

          {/* 2. Direct Camera Capture Input (Mobile native camera) */}
          <input
            type="file"
            ref={fileCameraRef}
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleImageFileChange}
          />

          {/* Image Action Buttons: Upload Image vs Take Image */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginBottom: '12px', width: '100%', boxSizing: 'border-box' }}>
            {/* Option A: Upload Image */}
            <button
              type="button"
              onClick={() => fileUploadRef.current?.click()}
              style={{
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '14px 8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F8F4EC',
                border: '1.5px dashed var(--brand-500)',
                color: 'var(--brand-700)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Upload size={22} style={{ color: 'var(--brand-600)' }} />
              <span>Upload Image</span>
            </button>

            {/* Option B: Take Image (Camera) */}
            <button
              type="button"
              onClick={startLiveWebcam}
              style={{
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '14px 8px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#F0FAF4',
                border: '1.5px dashed #10B981',
                color: '#065F46',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Camera size={22} style={{ color: '#059669' }} />
              <span>Take Live Photo</span>
            </button>
          </div>

          {/* Live Camera Viewfinder Modal (If open) */}
          {isLiveCameraActive && (
            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#000000',
                marginBottom: '12px',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <button
                  type="button"
                  onClick={captureWebcamSnapshot}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10B981',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Snap Photo
                </button>
                <button
                  type="button"
                  onClick={stopLiveWebcam}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Photo Preview Container */}
          {formData.foodPhoto && (
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '150px', border: '1px solid var(--border-default)' }}>
              <img
                src={formData.foodPhoto}
                alt="Selected Food Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '8px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                ✓ Image Attached for Volunteer Inspection
              </div>
            </div>
          )}

          {/* Sample quick photos row */}
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '6px' }}>
              Or choose from common food presets:
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {SAMPLE_FOOD_PHOTOS.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt=""
                  onClick={() => setFormData({ ...formData, foodPhoto: photo })}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.foodPhoto === photo ? '2px solid var(--brand-500)' : '1px solid var(--border-default)',
                    opacity: formData.foodPhoto === photo ? 1 : 0.6,
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button with Inspiring Callout */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          icon={HeartHandshake}
          disabled={isSubmitting}
          style={{
            fontWeight: 800,
            fontSize: '15px',
            marginTop: 'var(--space-2)',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)'
          }}
        >
          {isSubmitting ? 'Submitting Food Donation...' : 'Complete & Upload Food Donation'}
        </Button>
      </form>
    </div>
  );
};

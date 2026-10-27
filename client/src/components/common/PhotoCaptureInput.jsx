import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, RotateCw, Image as ImageIcon, Video, X } from 'lucide-react';
import { Button } from './Button';

// Safe SVG fallback data-URI in case an external image fails to load
const FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><circle cx="300" cy="180" r="60" fill="%23334155"/><path d="M220 320 Q300 240 380 320" fill="%231e293b" stroke="%2338bdf8" stroke-width="4"/><text x="50%" y="280" font-family="sans-serif" font-size="18" font-weight="bold" fill="%2394a3b8" text-anchor="middle">AnnaSetu Photo Verification Checkpoint</text></svg>';

export const PhotoCaptureInput = ({
  value,
  onChange,
  label = 'Photo Proof',
  subtitle = 'Take a clear photo with your device camera or upload from files',
  checkpointText,
  samplePhotos = [],
  required = false
}) => {
  const [isLiveCamOpen, setIsLiveCamOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [imgSrc, setImgSrc] = useState(value || '');

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Sync internal state if prop changes externally
  React.useEffect(() => {
    if (value) {
      setImgSrc(value);
    }
  }, [value]);

  // Compress & normalize client-side image files
  const processImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 700;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);

        setImgSrc(compressedDataUrl);
        if (onChange) {
          onChange(compressedDataUrl);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  // Launch live browser webcam stream if available
  const startLiveCamera = async () => {
    try {
      setCameraError('');
      setIsLiveCamOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Direct webcam stream error, launching native camera picker:', err);
      setIsLiveCamOpen(false);
      // Fallback to native camera input
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const stopLiveCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsLiveCamOpen(false);
  };

  const captureLiveSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/jpeg', 0.85);

    setImgSrc(photoUrl);
    if (onChange) {
      onChange(photoUrl);
    }
    stopLiveCamera();
  };

  const handleSelectPreset = (url) => {
    setImgSrc(url);
    if (onChange) {
      onChange(url);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Hidden File Inputs */}
      {/* 1. Camera Input (triggers native camera on iOS & Android) */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* 2. Gallery / File Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Header Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--status-danger-solid)' }}>*</span>}
        </label>
        {subtitle && (
          <span style={{ fontSize: '10.5px', color: 'var(--text-tertiary)' }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Live Video Camera Viewport (when active) */}
      {isLiveCamOpen ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            backgroundColor: '#000000',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '2px solid var(--brand-500)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Overlay viewfinder guidelines */}
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '15px',
              right: '15px',
              bottom: '50px',
              border: '2px dashed rgba(255,255,255,0.4)',
              borderRadius: 'var(--radius-sm)',
              pointerEvents: 'none'
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              zIndex: 10
            }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={stopLiveCamera}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: '#ffffff', borderColor: '#475569' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={Camera}
              onClick={captureLiveSnapshot}
              style={{ fontWeight: 800, padding: '6px 16px' }}
            >
              Snap Photo
            </Button>
          </div>
        </div>
      ) : (
        /* Standard Photo Preview Box */
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '190px',
            backgroundColor: '#090d16',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {imgSrc ? (
            <>
              <img
                src={imgSrc}
                alt="Captured proof"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_SVG;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Verified Timestamp / Location Stamp */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  fontSize: '10.5px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <span>{checkpointText || `📍 Checkpoint Stamp: ${new Date().toLocaleTimeString()}`}</span>
              </div>

              {/* Status Badge Top Right */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '3px 7px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(16, 185, 129, 0.9)',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <CheckCircle2 size={11} /> Photo Verified
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-tertiary)' }}>
              <ImageIcon size={32} style={{ margin: '0 auto 6px', opacity: 0.5 }} />
              <div style={{ fontSize: '12px', fontWeight: 600 }}>No Photo Captured Yet</div>
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                Tap the camera or upload button below
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons: Take Photo (Camera) & Upload Image */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
        <button
          type="button"
          onClick={startLiveCamera}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'var(--brand-500)',
            color: '#0b1120',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          <Camera size={15} />
          <span>Take Photo</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <Upload size={15} />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Preset Verification Samples (For instant 1-tap testing without camera) */}
      {samplePhotos && samplePhotos.length > 0 && (
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', marginBottom: '5px' }}>
            Or choose a quick verification sample:
          </div>
          <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '3px' }}>
            {samplePhotos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="sample preset"
                onClick={() => handleSelectPreset(url)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_SVG;
                }}
                style={{
                  width: '52px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: imgSrc === url ? '2px solid var(--brand-500)' : '1px solid var(--border-default)',
                  opacity: imgSrc === url ? 1 : 0.65,
                  transition: 'opacity 0.2s ease, border-color 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

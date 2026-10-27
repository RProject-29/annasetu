import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';

export const CountdownTimer = ({ targetTime, prefix = 'Pickup before:', compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetTime).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, totalSeconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  let tier = 'normal';
  if (timeLeft.isExpired) {
    tier = 'critical';
  } else if (timeLeft.totalSeconds < 3600) {
    // Under 1 hour
    tier = 'critical';
  } else if (timeLeft.totalSeconds < 3 * 3600) {
    // Under 3 hours
    tier = 'warning';
  }

  const formatTime = () => {
    if (timeLeft.isExpired) return 'EXPIRED';
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m left`;
    }
    return `${timeLeft.minutes}m ${timeLeft.seconds}s left`;
  };

  return (
    <div className={`countdown-badge ${tier}`} title={`Target: ${new Date(targetTime).toLocaleTimeString()}`}>
      {tier === 'critical' ? (
        <AlertTriangle size={13} className="animate-pulse" />
      ) : tier === 'warning' ? (
        <AlertCircle size={13} />
      ) : (
        <Clock size={13} />
      )}
      {!compact && prefix && <span style={{ opacity: 0.85, fontWeight: 500 }}>{prefix}</span>}
      <span>{formatTime()}</span>
    </div>
  );
};

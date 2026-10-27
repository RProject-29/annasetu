import React from 'react';
import { StatusChip } from '../common/StatusChip';
import { CheckCircle2, Circle, Clock, User, Shield, Bike } from 'lucide-react';

const getActorIcon = (actor = '') => {
  if (actor.toLowerCase().includes('admin')) return Shield;
  if (actor.toLowerCase().includes('volunteer')) return Bike;
  if (actor.toLowerCase().includes('donor')) return User;
  return Clock;
};

export const RescueTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) {
    return (
      <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
        No checkpoint activity logged yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const ActorIcon = getActorIcon(event.actor);
        const timeStr = event.timestamp
          ? new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';
        const dateStr = event.timestamp
          ? new Date(event.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
          : '';

        return (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: '14px',
              position: 'relative',
              paddingBottom: isLast ? '0px' : '20px'
            }}
          >
            {/* Timeline line */}
            {!isLast && (
              <div
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '24px',
                  bottom: '0px',
                  width: '2px',
                  backgroundColor: 'var(--border-default)'
                }}
              />
            )}

            {/* Timeline bullet */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isLast ? 'var(--brand-500)' : 'var(--bg-surface-elevated)',
                color: isLast ? '#0b1120' : 'var(--status-success-solid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isLast ? '3px solid var(--bg-surface)' : '2px solid var(--border-default)',
                boxShadow: isLast ? '0 0 10px var(--brand-glow)' : 'none',
                zIndex: 2,
                flexShrink: 0
              }}
            >
              <ActorIcon size={14} />
            </div>

            {/* Content card */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <StatusChip status={event.status} />
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-family-mono)' }}>
                  {dateStr} • {timeStr}
                </span>
              </div>

              {event.actor && (
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {event.actor}
                </p>
              )}

              {event.note && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                  {event.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

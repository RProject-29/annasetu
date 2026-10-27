import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export const NotificationDrawer = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onSelectDonation
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="In-App Notifications"
      subtitle="Operational alerts, checkpoint updates, and matching status"
      maxWidth="480px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <button
            onClick={onMarkAllRead}
            style={{
              fontSize: '12px',
              color: 'var(--brand-500)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)' }}>
            <Bell size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
            <p>No notifications at this time.</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkRead(notif.id);
                if (notif.donationId && onSelectDonation) {
                  onSelectDonation(notif.donationId);
                  onClose();
                }
              }}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: notif.read ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
                borderLeft: notif.read ? '1px solid var(--border-default)' : '3px solid var(--brand-500)',
                cursor: notif.donationId ? 'pointer' : 'default',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {notif.title}
                </h4>
                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-family-mono)' }}>
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                {notif.message}
              </p>

              {notif.donationId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--brand-500)', marginTop: '4px' }}>
                  <span>View rescue details</span>
                  <ExternalLink size={10} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

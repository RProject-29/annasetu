import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

export const AlertBanner = ({
  type = 'info', // info | warning | success | danger
  title,
  message,
  action,
  className = ''
}) => {
  const configs = {
    info: {
      icon: Info,
      bg: 'var(--status-info-bg)',
      border: 'var(--status-info-border)',
      color: 'var(--status-info-text)'
    },
    warning: {
      icon: AlertTriangle,
      bg: 'var(--status-urgent-bg)',
      border: 'var(--status-urgent-border)',
      color: 'var(--status-urgent-text)'
    },
    success: {
      icon: CheckCircle2,
      bg: 'var(--status-success-bg)',
      border: 'var(--status-success-border)',
      color: 'var(--status-success-text)'
    },
    danger: {
      icon: XCircle,
      bg: 'var(--status-danger-bg)',
      border: 'var(--status-danger-border)',
      color: 'var(--status-danger-text)'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        marginBottom: '16px'
      }}
    >
      <Icon size={18} style={{ color: config.color, flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        {title && (
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
            {title}
          </h4>
        )}
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          {message}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

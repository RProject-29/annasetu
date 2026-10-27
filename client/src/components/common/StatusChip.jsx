import React from 'react';
import { STATUS_CONFIG } from '../../constants/donationStatus';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Truck,
  FileCheck,
  Search,
  UserCheck
} from 'lucide-react';

const ICON_MAP = {
  success: CheckCircle2,
  urgent: Clock,
  danger: XCircle,
  info: Truck,
  neutral: Search
};

export const StatusChip = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    variant: 'neutral'
  };

  const Icon = ICON_MAP[config.variant] || Clock;

  return (
    <span className={`status-chip ${config.variant} ${className}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
};

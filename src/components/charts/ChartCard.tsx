import React from 'react';
import { Card, DemoBadge } from '../ui/Primitives';

export const CHART_THEME = {
  brand: '#E11D2E',
  brandLight: '#F43F4F',
  accent: '#FF7A1A',
  accentLight: '#FFA24D',
  ink: '#0F1115',
  muted: '#4B5563',
  grid: '#EEF0F4',
  success: '#16A34A',
  info: '#2563EB',
  tooltipStyle: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E1E5EB',
    borderRadius: '10px',
    boxShadow: '0 4px 12px -2px rgba(15,17,21,0.08)',
    fontSize: '12px',
    color: '#0F1115',
  },
};

export function ChartCard({
  title,
  subtitle,
  action,
  showDemoBadge = true,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showDemoBadge?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-[#0F1115]">{title}</h3>
          {subtitle && <p className="text-xs text-[#4B5563] mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {showDemoBadge && <DemoBadge />}
        </div>
      </div>
      <div className="w-full">{children}</div>
    </Card>
  );
}

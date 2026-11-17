import React from 'react';
import { cn } from '../../lib/utils';

export function BrandLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-brand-gradient text-white font-bold shadow-sm',
          size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
        )}
        aria-hidden="true"
      >
        MP
      </span>
      <span
        className={cn(
          'font-bold tracking-tight text-[#0F1115]',
          size === 'sm' ? 'text-base' : 'text-lg'
        )}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        MarketPulse
      </span>
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-[#E11D2E] text-white hover:bg-brand-gradient shadow-[0_1px_2px_rgba(15,17,21,0.06)] active:scale-[0.99]',
    secondary: 'bg-[#0F1115] text-white hover:bg-[#1F242D]',
    outline: 'bg-white text-[#0F1115] border border-[#E1E5EB] hover:bg-[#F8F9FB]',
    ghost: 'bg-transparent text-[#4B5563] hover:text-[#0F1115] hover:bg-[#EEF0F4]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
  };
  const sizes = {
    sm: 'h-9 px-3.5 text-xs font-medium rounded-lg',
    md: 'h-10 px-4 text-sm font-medium rounded-lg',
    lg: 'h-12 px-6 text-sm font-semibold rounded-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-[12px] border border-[#EEF0F4] shadow-[0_1px_2px_rgba(15,17,21,0.04)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full h-10 px-3.5 text-sm bg-white text-[#0F1115] placeholder:text-[#9CA3AF] border border-[#E1E5EB] rounded-[8px] transition-colors focus:border-[#E11D2E] focus:outline-none focus:ring-2 focus:ring-[#E11D2E]/15 disabled:bg-[#F8F9FB]',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full p-3.5 text-sm bg-white text-[#0F1115] placeholder:text-[#9CA3AF] border border-[#E1E5EB] rounded-[8px] transition-colors focus:border-[#E11D2E] focus:outline-none focus:ring-2 focus:ring-[#E11D2E]/15',
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full h-10 px-3 text-sm bg-white text-[#0F1115] border border-[#E1E5EB] rounded-[8px] transition-colors focus:border-[#E11D2E] focus:outline-none focus:ring-2 focus:ring-[#E11D2E]/15',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium text-[#4B5563] bg-[#F8F9FB] border border-[#E1E5EB] px-2.5 py-1 rounded-md whitespace-nowrap shrink-0',
        className
      )}
    >
      Demo Data
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-[#EEF0F4]', className)} />;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-[16px] border border-[#EEF0F4] shadow-[0_16px_32px_-8px_rgba(15,17,21,0.16)] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-[#0F1115]">
              {title}
            </h2>
            {description && <p className="text-sm text-[#4B5563] mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#4B5563] hover:text-[#0F1115] p-1 rounded-lg hover:bg-[#F8F9FB]"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

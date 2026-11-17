import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-IN');
}

export function formatPercent(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X (Twitter)',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E11D2E',
  linkedin: '#2563EB',
  x: '#0F1115',
  facebook: '#FF7A1A',
  tiktok: '#16A34A',
};

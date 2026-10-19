import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'BDT'): string {
  if (currency === 'BDT') {
    return `৳${amount.toLocaleString('en-BD')}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(dateStr: string | null, fallback = 'N/A'): string {
  if (!dateStr) return fallback;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Payment statuses
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    partial: 'bg-blue-100 text-blue-700 border-blue-200',
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    overdue: 'bg-red-100 text-red-700 border-red-200',
    refunded: 'bg-purple-100 text-purple-700 border-purple-200',
    // Booking statuses
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    // Verification statuses
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    // Invoice statuses
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    sent: 'bg-blue-100 text-blue-700 border-blue-200',
    // Lead statuses
    new: 'bg-violet-100 text-violet-700 border-violet-200',
    contacted: 'bg-blue-100 text-blue-700 border-blue-200',
    quoted: 'bg-amber-100 text-amber-700 border-amber-200',
    converted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    lost: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[status] ?? 'bg-gray-100 text-gray-700 border-gray-200';
}

export function getPassportDaysRemaining(expiry: string | null): number | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

export function generateReferenceCode(): string {
  return 'GEO-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Taka Only';
  if (!num || isNaN(num)) return '';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertGroup(n: number): string {
    let out = '';
    if (n >= 100) {
      out += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      out += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      out += ones[n] + ' ';
    }
    return out.trim();
  }

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = Math.floor(num);

  let res = '';
  if (crore > 0) res += convertGroup(crore) + ' Crore ';
  if (lakh > 0) res += convertGroup(lakh) + ' Lakh ';
  if (thousand > 0) res += convertGroup(thousand) + ' Thousand ';
  if (remainder > 0) res += convertGroup(remainder) + ' ';

  return res.trim() + ' Taka Only';
}

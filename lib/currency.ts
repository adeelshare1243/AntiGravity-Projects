import { Currency } from '@/types';

export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'JPY':
      return '¥';
    default:
      return '$';
  }
}

export function getCurrencyRate(currency: Currency): number {
  switch (currency) {
    case 'EUR':
      return 0.92;
    case 'GBP':
      return 0.79;
    case 'JPY':
      return 155;
    default:
      return 1;
  }
}

export function formatPrice(usd: number, currency: Currency): string {
  const rate = getCurrencyRate(currency);
  const decimals = currency === 'JPY' ? 0 : 2;
  return (usd * rate).toFixed(decimals);
}

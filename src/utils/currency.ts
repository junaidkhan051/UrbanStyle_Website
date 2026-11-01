/**
 * Centralized Currency Formatter
 * 
 * Consistent USD display throughout UrbanStyle.
 * All internal money calculations operate in integer cents.
 * 2499 cents -> $24.99
 */

export const CURRENCY_CODE = 'USD';
export const CURRENCY_SYMBOL = '$';

/**
 * Formats an integer cents amount to a formatted USD string (e.g. 2499 -> "$24.99").
 */
export function formatCentsToUSD(cents: number): string {
  if (isNaN(cents) || cents === null || cents === undefined) {
    return '$0.00';
  }
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Parses user input dollars string or float to integer cents.
 */
export function dollarsToCents(dollars: number | string): number {
  const numeric = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
  if (isNaN(numeric)) return 0;
  return Math.round(numeric * 100);
}

/**
 * Calculate cart breakdown
 */
export function calculateTotals(
  subtotalCents: number,
  discountPercent: number = 0,
  freeShippingThresholdCents: number = 10000 // $100.00 free shipping
): {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  freeShippingQualified: boolean;
  centsAwayFromFreeShipping: number;
} {
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotalCents - discountCents);
  
  const freeShippingQualified = subtotalCents >= freeShippingThresholdCents && subtotalCents > 0;
  const shippingCents = subtotalCents === 0 ? 0 : (freeShippingQualified ? 0 : 1200); // $12.00 standard demo shipping
  const centsAwayFromFreeShipping = Math.max(0, freeShippingThresholdCents - subtotalCents);
  
  const totalCents = discountedSubtotal + shippingCents;

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents,
    freeShippingQualified,
    centsAwayFromFreeShipping,
  };
}

/**
 * Formatting utilities for consistent data display
 */

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: EUR)
 * @param locale - Locale for formatting (default: it-IT)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'it-IT'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    // Fallback for invalid currency/locale
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format a number with thousand separators
 * @param number - Number to format
 * @param locale - Locale for formatting (default: it-IT)
 * @returns Formatted number string
 */
export function formatNumber(
  number: number,
  locale: string = 'it-IT'
): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * Format a number as percentage
 * @param number - Number to format (0-1 range)
 * @param decimals - Number of decimal places (default: 1)
 * @param locale - Locale for formatting (default: it-IT)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  number: number,
  decimals: number = 1,
  locale: string = 'it-IT'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

/**
 * Format file size in human readable format
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format time duration in human readable format
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * Format phone number
 * @param phoneNumber - Raw phone number
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Basic Italian phone number formatting
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  // International format
  if (cleaned.length > 10) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phoneNumber; // Return original if can't format
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: ...)
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format array as comma-separated list with "and" for last item
 * @param items - Array of items
 * @param conjunction - Word to use before last item (default: e)
 * @returns Formatted list string
 */
export function formatList(
  items: string[],
  conjunction: string = 'e'
): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0] || '';
  if (items.length === 2) return items.join(` ${conjunction} `);
  
  const lastItem = items[items.length - 1];
  return items.slice(0, -1).join(', ') + ` ${conjunction} ` + (lastItem || '');
}

/**
 * Utility functions for the Interactive Story Engine
 */

/**
 * Format a number with commas as thousands separators
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate a random ID (for demonstration purposes)
 */
export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Validate if input is a valid URL
 */
export function isValidURL(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch (e) {
    return false;
  }
}
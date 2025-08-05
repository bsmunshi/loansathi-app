/**
 * Date utility functions for LoanSathi
 */

/**
 * Get the current year
 * @returns {number} Current year (e.g., 2024, 2025, etc.)
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get copyright text with current year
 * @param {string} companyName - Company name
 * @returns {string} Copyright text with current year
 */
export const getCopyrightText = (companyName = 'LoanSathi') => {
  return `© ${getCurrentYear()} ${companyName}. Made for Indian borrowers with ❤️`;
};

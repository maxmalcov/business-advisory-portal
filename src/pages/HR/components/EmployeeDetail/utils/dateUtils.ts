
/**
 * Format a date string to a human-readable format
 * @param dateStr Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

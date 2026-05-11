/**
 * Safely parses a date string and returns a formatted date.
 * Fallback to a default message if invalid.
 */
export const formatEventDate = (dateString: string | undefined | null, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!dateString) return 'TBA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const getEventMonth = (dateString: string | undefined | null): string => {
  return formatEventDate(dateString, { month: 'short' }).toUpperCase();
};

export const getEventDay = (dateString: string | undefined | null): string => {
  return formatEventDate(dateString, { day: 'numeric' });
};

export const getEventTime = (dateString: string | undefined | null): string => {
  return formatEventDate(dateString, { hour: '2-digit', minute: '2-digit' });
};

export const getRelativeCountdown = (targetDate: Date): string => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return 'Live Now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${mins}m left`;
  return `${mins}m left`;
};

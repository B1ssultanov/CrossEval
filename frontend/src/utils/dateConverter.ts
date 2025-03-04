export const formatSubmissionDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Convert 24-hour time to 12-hour format with AM/PM
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHour = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  // Get ordinal suffix for the day (st, nd, rd, th)
  const getOrdinalSuffix = (num: number): string => {
    if (num > 3 && num < 21) return 'th'; // Covers 11th to 20th
    const lastDigit = num % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${formattedHour}:${minutes}${period}`;
};
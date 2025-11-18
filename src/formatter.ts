/**
 * Timestamp formatter utility class
 */
export class TimestampFormatter {
  /**
   * Format timestamp to specified format and timezone
   * @param timestamp Unix timestamp (seconds or milliseconds)
   * @param format Format string
   * @param timezone Timezone
   */
  static format(timestamp: number, format: string, timezone: string): string {
    // Determine if seconds or milliseconds (less than 10 digits = seconds)
    const ts = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
    const date = new Date(ts);

    // Check if it's a valid timestamp
    if (isNaN(date.getTime())) {
      return 'Invalid timestamp';
    }

    // Get time in specified timezone
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    try {
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(date);

      const values: { [key: string]: string } = {};
      parts.forEach(part => {
        if (part.type !== 'literal') {
          values[part.type] = part.value;
        }
      });

      // Replace placeholders in format string
      let result = format;
      result = result.replace(/YYYY/g, values.year || '');
      result = result.replace(/MM/g, values.month || '');
      result = result.replace(/DD/g, values.day || '');
      result = result.replace(/HH/g, values.hour || '');
      result = result.replace(/mm/g, values.minute || '');
      result = result.replace(/ss/g, values.second || '');

      return result;
    } catch (error) {
      return `Error formatting for timezone ${timezone}`;
    }
  }

  /**
   * Check if text is a timestamp
   * @param text Text to check
   */
  static isTimestamp(text: string): boolean {
    // Match pure numbers, at least 10 digits (Unix seconds) or 13 digits (milliseconds)
    const timestampRegex = /^\d{10,13}$/;
    if (!timestampRegex.test(text)) {
      return false;
    }

    const num = parseInt(text, 10);
    // Check if within reasonable time range (between 1970-2100)
    const ts = num < 10000000000 ? num * 1000 : num;
    const date = new Date(ts);
    const year = date.getFullYear();
    return year >= 1970 && year <= 2100;
  }
}

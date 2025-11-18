import { TimestampFormatter } from '../formatter';

describe('TimestampFormatter', () => {
  describe('isTimestamp', () => {
    it('should detect valid 10-digit timestamp (seconds)', () => {
      expect(TimestampFormatter.isTimestamp('1700000000')).toBe(true);
      expect(TimestampFormatter.isTimestamp('1516239022')).toBe(true);
      expect(TimestampFormatter.isTimestamp('1731888000')).toBe(true);
    });

    it('should detect valid 13-digit timestamp (milliseconds)', () => {
      expect(TimestampFormatter.isTimestamp('1700000000000')).toBe(true);
      expect(TimestampFormatter.isTimestamp('1516239022000')).toBe(true);
      expect(TimestampFormatter.isTimestamp('1731888000000')).toBe(true);
    });

    it('should reject timestamps that are too short', () => {
      expect(TimestampFormatter.isTimestamp('123')).toBe(false);
      expect(TimestampFormatter.isTimestamp('123456789')).toBe(false);
    });

    it('should reject timestamps that are too long', () => {
      expect(TimestampFormatter.isTimestamp('12345678901234')).toBe(false);
      expect(TimestampFormatter.isTimestamp('123456789012345')).toBe(false);
    });

    it('should reject strings with non-numeric characters', () => {
      expect(TimestampFormatter.isTimestamp('abc1234567')).toBe(false);
      expect(TimestampFormatter.isTimestamp('1700000000a')).toBe(false);
      expect(TimestampFormatter.isTimestamp('170000-0000')).toBe(false);
    });

    it('should reject empty strings', () => {
      expect(TimestampFormatter.isTimestamp('')).toBe(false);
    });

    it('should reject timestamps outside valid year range (1970-2100)', () => {
      // Year 2286 is after 2100
      expect(TimestampFormatter.isTimestamp('9999999999')).toBe(false); // After 2100
    });
  });

  describe('format', () => {
    it('should format 10-digit timestamp correctly', () => {
      const timestamp = 1700000000; // 2023-11-15 00:13:20 UTC
      const formatted = TimestampFormatter.format(timestamp, 'YYYY-MM-DD HH:mm:ss', 'UTC');
      expect(formatted).toMatch(/2023-11-1[45]/); // Allow for timezone differences
    });

    it('should format 13-digit timestamp correctly', () => {
      const timestamp = 1700000000000;
      const formatted = TimestampFormatter.format(timestamp, 'YYYY-MM-DD', 'UTC');
      expect(formatted).toMatch(/2023-11-1[45]/);
    });

    it('should handle different date formats', () => {
      const timestamp = 1700000000;
      
      const format1 = TimestampFormatter.format(timestamp, 'YYYY/MM/DD', 'UTC');
      expect(format1).toMatch(/2023\/11\/1[45]/);
      
      const format2 = TimestampFormatter.format(timestamp, 'DD-MM-YYYY', 'UTC');
      expect(format2).toMatch(/1[45]-11-2023/);
      
      const format3 = TimestampFormatter.format(timestamp, 'HH:mm:ss', 'UTC');
      expect(format3).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('should handle different timezones', () => {
      const timestamp = 1700000000;
      
      const utc = TimestampFormatter.format(timestamp, 'YYYY-MM-DD HH:mm:ss', 'UTC');
      const shanghai = TimestampFormatter.format(timestamp, 'YYYY-MM-DD HH:mm:ss', 'Asia/Shanghai');
      const newYork = TimestampFormatter.format(timestamp, 'YYYY-MM-DD HH:mm:ss', 'America/New_York');
      
      // Different timezones should produce different times
      expect(utc).not.toBe(shanghai);
      expect(utc).not.toBe(newYork);
    });

    it('should return error message for invalid timestamp', () => {
      const result = TimestampFormatter.format(NaN, 'YYYY-MM-DD', 'UTC');
      expect(result).toBe('Invalid timestamp');
    });

    it('should handle invalid timezone gracefully', () => {
      const timestamp = 1700000000;
      const result = TimestampFormatter.format(timestamp, 'YYYY-MM-DD', 'Invalid/Timezone');
      expect(result).toContain('Error');
    });
  });
});

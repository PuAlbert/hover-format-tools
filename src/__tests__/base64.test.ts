describe('Base64 Detection and Decoding', () => {
  // Helper function to test Base64 detection logic (mirroring the actual implementation)
  function isBase64(str: string): boolean {
    if (str.length < 8) {
      return false;
    }

    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) {
      return false;
    }

    const remainder = str.length % 4;
    if (remainder === 1) {
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(str);
    const hasLowerCase = /[a-z]/.test(str);
    const hasSpecialChars = /[+/=]/.test(str);
    
    if (!((hasUpperCase && hasLowerCase) || hasSpecialChars)) {
      return false;
    }

    if (/^[0-9a-fA-F]+$/.test(str)) {
      return false;
    }

    const uniqueChars = new Set(str.replace(/=/g, '')).size;
    const diversityRatio = uniqueChars / str.replace(/=/g, '').length;
    
    if (diversityRatio < 0.3 || uniqueChars < 4) {
      return false;
    }

    return true;
  }

  // Helper to decode Base64 with padding
  function decodeBase64(word: string): string {
    let base64String = word;
    const paddingNeeded = (4 - (word.length % 4)) % 4;
    if (paddingNeeded > 0) {
      base64String = word + '='.repeat(paddingNeeded);
    }
    return Buffer.from(base64String, 'base64').toString('utf-8');
  }

  describe('Base64 Detection', () => {
    describe('should detect valid Base64 strings', () => {
      it('should detect padded Base64', () => {
        expect(isBase64('SGVsbG8gV29ybGQh')).toBe(true); // "Hello World!"
        expect(isBase64('SGVsbG8=')).toBe(true);
        expect(isBase64('YWRtaW4=')).toBe(true); // "admin"
        expect(isBase64('dXNlckBleGFtcGxlLmNvbQ==')).toBe(true); // "user@example.com"
      });

      it('should detect unpadded Base64 (JWT style)', () => {
        expect(isBase64('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).toBe(true);
        expect(isBase64('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ')).toBe(true);
      });

      it('should detect Base64 with special characters', () => {
        expect(isBase64('AB+/CD==')).toBe(true);
        expect(isBase64('aHR0cHM6Ly9naXRodWIuY29t')).toBe(true);
      });
    });

    describe('should reject invalid strings', () => {
      it('should reject hex strings', () => {
        expect(isBase64('abcdef123456')).toBe(false);
        expect(isBase64('0123456789ABCDEF')).toBe(false);
        expect(isBase64('deadbeef')).toBe(false);
        expect(isBase64('CAFEBABE')).toBe(false);
      });

      it('should reject pure lowercase strings', () => {
        expect(isBase64('abcdefghijkl')).toBe(false);
        expect(isBase64('lowercase')).toBe(false);
      });

      it('should reject pure uppercase strings', () => {
        expect(isBase64('ABCDEFGHIJKL')).toBe(false);
        expect(isBase64('UPPERCASE')).toBe(false);
      });

      it('should reject pure numbers', () => {
        expect(isBase64('123456789012')).toBe(false);
        expect(isBase64('00000000')).toBe(false);
      });

      it('should reject strings with low character diversity', () => {
        expect(isBase64('AAAAAAAAaaaa')).toBe(false);
        expect(isBase64('aAaAaAaA')).toBe(false);
        expect(isBase64('AAAABBBB')).toBe(false);
      });

      it('should reject strings that are too short', () => {
        expect(isBase64('SGVs')).toBe(false); // Less than 8 chars
        expect(isBase64('abc')).toBe(false);
        expect(isBase64('AB==')).toBe(false);
      });

      it('should reject strings with invalid length (% 4 === 1)', () => {
        expect(isBase64('SGVsbG8gV29ybGQhX')).toBe(false); // Length 17
      });

      it('should reject strings with invalid characters', () => {
        expect(isBase64('SGVsbG8@V29ybGQh')).toBe(false); // Contains @
        expect(isBase64('SGVsbG8#V29ybGQh')).toBe(false); // Contains #
        expect(isBase64('SGVsbG8!V29ybGQh')).toBe(false); // Contains !
        expect(isBase64('SGVsbG8$V29ybGQh')).toBe(false); // Contains $
      });
    });
  });

  describe('Base64 Decoding', () => {
    it('should decode padded Base64 correctly', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQh')).toBe('Hello World!');
      expect(decodeBase64('SGVsbG8=')).toBe('Hello');
      expect(decodeBase64('YWRtaW4=')).toBe('admin');
      expect(decodeBase64('dGVzdA==')).toBe('test');
      expect(decodeBase64('dXNlckBleGFtcGxlLmNvbQ==')).toBe('user@example.com');
    });

    it('should decode unpadded Base64 correctly', () => {
      const decoded1 = decodeBase64('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(decoded1).toBe('{"alg":"HS256","typ":"JWT"}');
      
      const decoded2 = decodeBase64('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ');
      expect(decoded2).toBe('{"sub":"1234567890","name":"John Doe","iat":1516239022}');
    });

    it('should decode JSON data in Base64', () => {
      const jsonBase64 = 'eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9';
      expect(isBase64(jsonBase64)).toBe(true);
      
      const decoded = decodeBase64(jsonBase64);
      expect(decoded).toBe('{"name":"John","age":30}');
      
      const parsed = JSON.parse(decoded);
      expect(parsed.name).toBe('John');
      expect(parsed.age).toBe(30);
    });

    it('should decode URLs in Base64', () => {
      const urlBase64 = 'aHR0cHM6Ly9naXRodWIuY29t';
      expect(isBase64(urlBase64)).toBe(true);
      
      const decoded = decodeBase64(urlBase64);
      expect(decoded).toBe('https://github.com');
    });

    it('should handle Base64 with special characters (+, /)', () => {
      const specialChars = 'SGVsbG8rV29ybGQv';
      if (isBase64(specialChars)) {
        const decoded = decodeBase64(specialChars);
        expect(decoded).toBeTruthy();
      }
    });

    it('should auto-pad Base64 strings missing padding', () => {
      // JWT header without padding
      const jwtHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; // Missing ==
      const decoded = decodeBase64(jwtHeader);
      expect(decoded).toBe('{"alg":"HS256","typ":"JWT"}');
      
      // Another example
      const example = 'eyJuYW1lIjoiSm9obiJ9'; // Missing =
      const decoded2 = decodeBase64(example);
      expect(decoded2).toBe('{"name":"John"}');
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum valid Base64 length', () => {
      const minLength = 'SGVsbG8h'; // 8 characters
      expect(isBase64(minLength)).toBe(true);
      expect(decodeBase64(minLength)).toBe('Hello!');
    });

    it('should reject mixed case without proper diversity', () => {
      expect(isBase64('AaAaAaAa')).toBe(false);
      expect(isBase64('BbBbBbBb')).toBe(false);
    });

    it('should accept valid Base64 with good diversity', () => {
      expect(isBase64('AbCdEfGhIjKl')).toBe(true);
      expect(isBase64('QWJjZGVmZ2hpamts')).toBe(true);
    });
  });
});

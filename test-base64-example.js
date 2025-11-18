// Test Base64 Hover Functionality
// Hover your mouse over the Base64 strings below to see decoded content

// Simple text
const base64Text = "SGVsbG8gV29ybGQh";  // Decodes to: "Hello World!"

// JSON data
const base64Json = "eyJuYW1lIjoiSm9obiIsImFnZSI6MzB9";  // Decodes to: {"name":"John","age":30}

// URL
const base64Url = "aHR0cHM6Ly9naXRodWIuY29t";  // Decodes to: "https://github.com"

// Email
const base64Email = "dXNlckBleGFtcGxlLmNvbQ==";  // Decodes to: "user@example.com"

// Longer text
const longBase64 = "VGhpcyBpcyBhIGxvbmdlciB0ZXN0IHN0cmluZyB0byBkZW1vbnN0cmF0ZSBCYXNlNjQgZGVjb2Rpbmc=";
// Decodes to: "This is a longer test string to demonstrate Base64 decoding"

// Chinese text
const chineseBase64 = "5L2g5aW977yM5LiW55WM";  // Decodes to: "你好，世界"

// In object
const credentials = {
  username: "YWRtaW4=",  // Decodes to: "admin"
  apiKey: "c2VjcmV0LWtleS0xMjM0NTY="  // Decodes to: "secret-key-123456"
};

// These should NOT be detected as Base64 (false positives):
const notBase64Examples = {
  hexString: "abcdef123456",  // Just hex, not Base64
  lowercase: "abcdefghijkl",  // All lowercase, not Base64
  uppercase: "ABCDEFGHIJKL",  // All uppercase, not Base64
  numbers: "123456789012"     // Just numbers, not Base64
};

// In array
const encodedMessages = [
  "SGVsbG8=",  // "Hello"
  "V29ybGQ=",  // "World"
  "Vm9pZCBtYWlu",  // "Void main"
  "Q29kZSBSZXZpZXc="  // "Code Review"
];

// JWT-like structure (header.payload.signature) - Unpadded Base64
const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";  // {"alg":"HS256","typ":"JWT"}
const jwtPayload = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
// {"sub":"1234567890","name":"John Doe","iat":1516239022}
// Note: JWT uses unpadded Base64 (no trailing '=' characters)

// SQL query
const sqlQuery = "U0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSBpZCA9IDE=";  // "SELECT * FROM users WHERE id = 1"

console.log('Base64 test:', "VGVzdCBEYXRh");  // "Test Data"

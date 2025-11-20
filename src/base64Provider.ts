import * as vscode from 'vscode';

/**
 * Base64 hover provider
 */
export class Base64HoverProvider implements vscode.HoverProvider {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Check if the provider is enabled
    if (!this.enabled) {
      return null;
    }

    // Match potential Base64 strings (at least 8 characters)
    // Note: The regex must match the entire word including padding
    const wordRange = document.getWordRangeAtPosition(
      position,
      /[A-Za-z0-9+/]{4,}={0,2}/
    );

    console.log(`Base64HoverProvider: found wordRange ${wordRange}`);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);
    console.log(`Base64HoverProvider: found word "${word}"`);

    if (!this.isBase64(word)) {
      return null;
    }

    try {
      // Add padding if needed for unpadded Base64 (common in JWT)
      let base64String = word;
      const paddingNeeded = (4 - (word.length % 4)) % 4;
      if (paddingNeeded > 0) {
        base64String = word + '='.repeat(paddingNeeded);
      }

      const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

      // Check if decoded content is printable
      if (!this.isPrintable(decoded)) {
        return null;
      }

      const markdownString = new vscode.MarkdownString();
      markdownString.supportHtml = true;
      markdownString.appendMarkdown(
        `**<span style="color:#CE9178;">Base64 Decoded</span>**:  \n\`\`\`\n${decoded}\n\`\`\``
      );

      return new vscode.Hover(markdownString, wordRange);
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if string is likely Base64 encoded
   * @param str String to check
   */
  private isBase64(str: string): boolean {
    // Must be at least 8 characters
    if (str.length < 8) {
      return false;
    }

    // Check Base64 pattern (with or without padding)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(str)) {
      return false;
    }

    // Length check: should be multiple of 4, or can have 2-3 chars missing (unpadded Base64)
    const remainder = str.length % 4;
    if (remainder === 1) {
      // Invalid: Base64 never has length % 4 === 1
      return false;
    }

    // Reject if it's just lowercase/digits (likely a hex string or regular identifier)
    // Base64 should have a mix of cases or special chars
    const hasUpperCase = /[A-Z]/.test(str);
    const hasLowerCase = /[a-z]/.test(str);
    const hasSpecialChars = /[+/=]/.test(str);

    // Must have either: uppercase+lowercase, or special Base64 chars, or both
    if (!((hasUpperCase && hasLowerCase) || hasSpecialChars)) {
      return false;
    }

    // Reject common patterns that aren't Base64
    // Pure hex strings (only 0-9a-f or 0-9A-F)
    if (/^[0-9a-fA-F]+$/.test(str)) {
      return false;
    }

    // Must have reasonable character diversity
    const uniqueChars = new Set(str.replace(/=/g, '')).size;
    const diversityRatio = uniqueChars / str.replace(/=/g, '').length;

    // If very low diversity, likely not Base64
    if (diversityRatio < 0.3 || uniqueChars < 4) {
      return false;
    }

    // 新增：尝试 decode 并检查是否可读
    try {
      let base64String = str;
      const paddingNeeded = (4 - (str.length % 4)) % 4;
      if (paddingNeeded > 0) {
        base64String = str + '='.repeat(paddingNeeded);
      }
      const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
      if (!this.isPrintable(decoded)) {
        return false;
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  /**
   * Check if decoded string contains mostly printable characters
   * @param str Decoded string to check
   */
  private isPrintable(str: string): boolean {
    // Reject if contains Unicode replacement character (indicates invalid UTF-8)
    if (str.includes('\uFFFD')) {
      return false;
    }

    // Check if string contains mostly printable characters
    const printableCount = str.split('').filter(char => {
      const code = char.charCodeAt(0);
      // Include printable ASCII, newlines, tabs, and common Unicode ranges
      return (
        (code >= 32 && code <= 126) || // Standard ASCII printable
        code === 10 || // Line feed
        code === 13 || // Carriage return
        code === 9 ||  // Tab
        (code >= 128 && code < 55296) || // Extended ASCII and Unicode
        (code >= 57344 && code <= 65535) // Unicode private use
      );
    }).length;

    // At least 80% should be printable
    return printableCount / str.length > 0.8;
  }
}

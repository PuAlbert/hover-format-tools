import * as vscode from 'vscode';
import { TimestampFormatter } from './formatter';

/**
 * Timestamp hover provider
 */
export class TimestampHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // Get the word at cursor position
    const wordRange = document.getWordRangeAtPosition(position, /\d{10,13}/);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);
    
    // Check if it's a valid timestamp
    if (!TimestampFormatter.isTimestamp(word)) {
      return null;
    }

    const timestamp = parseInt(word, 10);

    // Get configuration
    const config = vscode.workspace.getConfiguration('timestampFormatter');
    const timezones = config.get<string[]>('timezones', ['UTC']);
    const format = config.get<string>('format', 'YYYY-MM-DD HH:mm:ss');

    // Format time for each timezone
    const formattedTimes = timezones.map(timezone => {
      const formatted = TimestampFormatter.format(timestamp, format, timezone);
      return `**${timezone}**: ${formatted}`;
    });

    // Create Markdown content
    const markdownString = new vscode.MarkdownString();
    // markdownString.appendMarkdown('### 🕒 时间戳格式化\n\n');
    // markdownString.appendMarkdown(`**原始值**: \`${word}\`\n\n`);
    markdownString.appendMarkdown(formattedTimes.join('  \n'));

    return new vscode.Hover(markdownString, wordRange);
  }
}

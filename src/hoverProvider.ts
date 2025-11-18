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
    
    if (!TimestampFormatter.isTimestamp(word)) {
      return null;
    }

    const timestamp = parseInt(word, 10);

    const config = vscode.workspace.getConfiguration('timestampFormatter');
    const timezones = config.get<string[]>('timezones', ['UTC']);
    const format = config.get<string>('format', 'YYYY-MM-DD HH:mm:ss');

    const formattedTimes = timezones.map(timezone => {
      const formatted = TimestampFormatter.format(timestamp, format, timezone);
      return `**<span style="color:#4EC9B0;">${timezone}</span>**: ${formatted}`;
    });

    const markdownString = new vscode.MarkdownString();
    markdownString.supportHtml = true;
    markdownString.appendMarkdown(formattedTimes.join('  \n'));

    return new vscode.Hover(markdownString, wordRange);
  }
}

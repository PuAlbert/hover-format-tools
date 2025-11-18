import * as vscode from 'vscode';
import { TimestampHoverProvider } from './hoverProvider';

/**
 * Called when extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Timestamp Hover Formatter is now active!');

  // Register hover provider for all file types
  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: '*', pattern: '**' },
    new TimestampHoverProvider()
  );

  context.subscriptions.push(hoverProvider);
}

/**
 * Called when extension is deactivated
 */
export function deactivate() {}

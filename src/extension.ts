import * as vscode from 'vscode';
import { TimestampHoverProvider } from './hoverProvider';

/**
 * Called when extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Timestamp Hover Formatter is now active!');

  // Create hover provider instance
  const provider = new TimestampHoverProvider();

  // Register hover provider for all file types
  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: '*', pattern: '**' },
    provider
  );

  // Register enable command
  const enableCommand = vscode.commands.registerCommand(
    'timestampFormatter.enable',
    () => {
      provider.setEnabled(true);
      vscode.window.showInformationMessage('Timestamp Formatter enabled');
    }
  );

  // Register disable command
  const disableCommand = vscode.commands.registerCommand(
    'timestampFormatter.disable',
    () => {
      provider.setEnabled(false);
      vscode.window.showInformationMessage('Timestamp Formatter disabled');
    }
  );

  context.subscriptions.push(hoverProvider, enableCommand, disableCommand);
}

/**
 * Called when extension is deactivated
 */
export function deactivate() {}

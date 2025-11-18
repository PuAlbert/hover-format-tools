import * as vscode from 'vscode';
import { TimestampHoverProvider } from './hoverProvider';
import { Base64HoverProvider } from './base64Provider';

/**
 * Called when extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Timestamp Hover Formatter is now active!');

  // Create timestamp hover provider instance
  const timestampProvider = new TimestampHoverProvider();

  // Register timestamp hover provider for all file types
  const timestampHoverProvider = vscode.languages.registerHoverProvider(
    { scheme: '*', pattern: '**' },
    timestampProvider
  );

  // Register timestamp enable command
  const enableTimestampCommand = vscode.commands.registerCommand(
    'timestampFormatter.enableTimestamp',
    () => {
      timestampProvider.setEnabled(true);
      vscode.window.showInformationMessage('Timestamp Formatter enabled');
    }
  );

  // Register timestamp disable command
  const disableTimestampCommand = vscode.commands.registerCommand(
    'timestampFormatter.disableTimestamp',
    () => {
      timestampProvider.setEnabled(false);
      vscode.window.showInformationMessage('Timestamp Formatter disabled');
    }
  );

  // Create Base64 hover provider instance
  const base64Provider = new Base64HoverProvider();

  // Register Base64 hover provider for all file types
  const base64HoverProvider = vscode.languages.registerHoverProvider(
    { scheme: '*', pattern: '**' },
    base64Provider
  );

  // Register Base64 enable command
  const enableBase64Command = vscode.commands.registerCommand(
    'timestampFormatter.enableBase64',
    () => {
      base64Provider.setEnabled(true);
      vscode.window.showInformationMessage('Base64 Decoder enabled');
    }
  );

  // Register Base64 disable command
  const disableBase64Command = vscode.commands.registerCommand(
    'timestampFormatter.disableBase64',
    () => {
      base64Provider.setEnabled(false);
      vscode.window.showInformationMessage('Base64 Decoder disabled');
    }
  );

  context.subscriptions.push(
    timestampHoverProvider,
    enableTimestampCommand,
    disableTimestampCommand,
    base64HoverProvider,
    enableBase64Command,
    disableBase64Command
  );
}

/**
 * Called when extension is deactivated
 */
export function deactivate() {}

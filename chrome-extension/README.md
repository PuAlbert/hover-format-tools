# Hover Format Tools - Chrome Extension

A Chrome extension that formats timestamps on hover and decodes Base64 strings on selection.

## Features

- 🕒 **Timestamp Formatter**: Automatically detect and format Unix timestamps (10-13 digits)
- 🌍 **Multiple Timezones**: Display time in multiple timezones simultaneously
- ⚙️ **Configurable Format**: Customize time format string
- 🔓 **Base64 Decoder**: Automatically detect and decode Base64 strings
- 🎨 **Beautiful Tooltips**: Color-coded display with dark theme

## Installation

### From Source

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `chrome-extension` folder

## Usage

### Timestamp Formatting

**Hover** your mouse over any 10-13 digit number to see formatted time:
- Displays time in your configured timezones
- Supports both seconds (10 digits) and milliseconds (13 digits)
- Tooltip appears automatically on hover

**Examples:**
- Hover over `1700000000` → Shows: 2023-11-15 02:13:20 (UTC)
- Hover over `1700000000000` → Shows: 2023-11-15 02:13:20 (UTC)

### Base64 Decoding

**Select** any Base64 encoded string (minimum 8 characters) with your mouse:
1. Click and drag to select the Base64 text
2. Release the mouse button
3. Decoded result appears in a tooltip near your selection

**Examples:**
- Select `SGVsbG8gV29ybGQh` → Shows: "Hello World!"
- Select `eyJuYW1lIjoiSm9obiJ9` → Shows: {"name":"John"}
- Select `aXRlbToyNjU3NzI2` → Shows: "item:2657726"

## Configuration

Click the extension icon to open settings:

### Timestamp Formatter Settings

- **Enable/Disable**: Toggle timestamp formatting on/off
- **Time Format**: Customize the display format
  - `YYYY` - Four-digit year
  - `MM` - Two-digit month
  - `DD` - Two-digit day
  - `HH` - Two-digit hour (24-hour)
  - `mm` - Two-digit minute
  - `ss` - Two-digit second
  - Example: `YYYY-MM-DD HH:mm:ss` → `2023-11-15 10:30:45`

- **Timezones**: Add multiple timezones (one per line)
  - `UTC` - Coordinated Universal Time
  - `Asia/Shanghai` - China Standard Time
  - `America/New_York` - US Eastern Time
  - `Europe/London` - London Time
  - `Asia/Tokyo` - Tokyo Time

### Base64 Decoder Settings

- **Enable/Disable**: Toggle Base64 decoding on/off

## Technical Details

### Detection Logic

**Timestamps:**
- Must be 10-13 digits
- Year must be between 1970-2100
- Automatically distinguishes seconds vs milliseconds

**Base64:**
- Minimum 8 characters
- Must match Base64 character set (A-Za-z0-9+/=)
- Validates character diversity
- Rejects hex strings and common false positives
- Verifies decoded content is printable text
- Rejects binary/unprintable data

### Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main logic for page interaction
├── popup.html           # Settings interface
├── popup.js             # Settings management
├── tooltip.css          # Tooltip styling
└── icons/               # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Privacy

This extension:
- ✅ Works completely offline
- ✅ Does not collect any data
- ✅ Does not send any information to external servers
- ✅ Only reads text content when you hover
- ✅ Settings stored locally in your browser

## Development

### Local Testing

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on any webpage

### Key Files

- `content.js`: Core functionality, runs on all pages
- `popup.html/js`: Extension settings interface
- `manifest.json`: Extension configuration and permissions

## Troubleshooting

**Extension not working?**
- Make sure the extension is enabled in `chrome://extensions/`
- Check if the specific feature is enabled in settings
- Try refreshing the page

**Timestamp tooltip not showing?**
- Hover slowly over the number
- Make sure it's a 10-13 digit number
- Check that timestamp formatter is enabled in settings

**Base64 decoding not working?**
- Make sure to **select the text** (not just hover)
- Selection must be at least 8 characters
- Check that Base64 decoder is enabled in settings
- Try on the test.html page first to verify the extension works

**Settings not saving?**
- Make sure to click "Save Settings" button
- Check browser console for errors

## License

MIT

## Credits

Migrated from VS Code extension "Hover Format Tools" by PuAlbert

## Version History

- **1.0.0** (2025-12-01)
  - Initial release
  - Timestamp formatting with multiple timezones
  - Base64 decoding with validation
  - Configurable settings via popup

# Timestamp Hover Formatter

A VSCode extension that automatically formats timestamps and decodes Base64 strings when you hover over them.

## Features

- 🕒 Automatically detect Unix timestamps (supports seconds and milliseconds)
- 🌍 Display multiple timezones simultaneously
- ⚙️ Configurable time format
- 🎯 View formatted time on hover
- 🔓 Automatically detect and decode Base64 strings
- 🎨 Color-coded displays for different data types

## Usage

### Timestamp Formatting

1. Hover your mouse over any 10-13 digit timestamp
2. Automatically displays formatted time information

Example timestamps:
- `1700000000` (seconds timestamp)
- `1700000000000` (milliseconds timestamp)

### Base64 Decoding

1. Hover your mouse over any Base64 encoded string (minimum 8 characters)
2. Automatically displays decoded content if it's readable text

Example Base64 strings:
- `SGVsbG8gV29ybGQh` → "Hello World!"
- `eyJuYW1lIjoiSm9obiJ9` → {"name":"John"}

### Commands

You can enable or disable features using these commands (press `Ctrl+Shift+P` or `Cmd+Shift+P` to open command palette):

**Timestamp Formatter:**
- **Enable Timestamp Formatter** - Enable timestamp hover formatting
- **Disable Timestamp Formatter** - Disable timestamp hover formatting

**Base64 Decoder:**
- **Enable Base64 Decoder** - Enable Base64 hover decoding
- **Disable Base64 Decoder** - Disable Base64 hover decoding

## Configuration

You can configure the following options in VSCode settings:

### `timestampFormatter.timezones`
- Type: `array`
- Default: `["UTC", "Asia/Shanghai"]`
- Description: List of timezones to display (supports multiple timezones)

Common timezone examples:
- `UTC` - Coordinated Universal Time
- `Asia/Shanghai` - China Standard Time
- `America/New_York` - US Eastern Time
- `Europe/London` - London Time
- `Asia/Tokyo` - Tokyo Time

### `timestampFormatter.format`
- Type: `string`
- Default: `"YYYY-MM-DD HH:mm:ss"`
- Description: Time format string

Format placeholders:
- `YYYY` - Four-digit year
- `MM` - Two-digit month
- `DD` - Two-digit day
- `HH` - Two-digit hour (24-hour format)
- `mm` - Two-digit minute
- `ss` - Two-digit second

Format examples:
- `YYYY-MM-DD HH:mm:ss` → `2023-11-15 10:30:45`
- `YYYY/MM/DD HH:mm` → `2023/11/15 10:30`
- `DD-MM-YYYY HH:mm:ss` → `15-11-2023 10:30:45`

## Development and Debugging

### Install Dependencies

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Debug

1. Open this project in VSCode
2. Press `F5` to start debugging
3. Test the extension functionality in the new window

### Package

```bash
npm install -g @vscode/vsce
vsce package
```

## Example Configuration

Add to `settings.json`:

```json
{
  "timestampFormatter.timezones": ["UTC", "Asia/Shanghai", "America/New_York"],
  "timestampFormatter.format": "YYYY-MM-DD HH:mm:ss"
}
```

## License

MIT

// Content script for Chrome extension
// This script runs on all web pages and handles hover interactions

// Configuration
let config = {
  timestampEnabled: true,
  base64Enabled: true,
  timezones: ['UTC', 'Asia/Shanghai'],
  format: 'YYYY-MM-DD HH:mm:ss'
};

// Load settings from storage
chrome.storage.sync.get(['timestampEnabled', 'base64Enabled', 'timezones', 'format'], (result) => {
  if (result.timestampEnabled !== undefined) config.timestampEnabled = result.timestampEnabled;
  if (result.base64Enabled !== undefined) config.base64Enabled = result.base64Enabled;
  if (result.timezones) config.timezones = result.timezones;
  if (result.format) config.format = result.format;
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.timestampEnabled) config.timestampEnabled = changes.timestampEnabled.newValue;
    if (changes.base64Enabled) config.base64Enabled = changes.base64Enabled.newValue;
    if (changes.timezones) config.timezones = changes.timezones.newValue;
    if (changes.format) config.format = changes.format.newValue;
  }
});

// Tooltip element
let tooltip = null;

// Create tooltip element
function createTooltip() {
  if (tooltip) return tooltip;
  
  tooltip = document.createElement('div');
  tooltip.id = 'hover-format-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    z-index: 999999;
    display: none;
    padding: 10px;
    background: #1e1e1e;
    color: #d4d4d4;
    border: 1px solid #454545;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 500px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

// Format timestamp
function formatTimestamp(timestamp, format, timezone) {
  const ts = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const date = new Date(ts);

  if (isNaN(date.getTime())) {
    return 'Invalid timestamp';
  }

  const options = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  try {
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);

    const values = {};
    parts.forEach(part => {
      if (part.type !== 'literal') {
        values[part.type] = part.value;
      }
    });

    let result = format;
    result = result.replace(/YYYY/g, values.year || '');
    result = result.replace(/MM/g, values.month || '');
    result = result.replace(/DD/g, values.day || '');
    result = result.replace(/HH/g, values.hour || '');
    result = result.replace(/mm/g, values.minute || '');
    result = result.replace(/ss/g, values.second || '');

    return result;
  } catch (error) {
    return `Error formatting for timezone ${timezone}`;
  }
}

// Check if text is timestamp
function isTimestamp(text) {
  const timestampRegex = /^\d{10,13}$/;
  if (!timestampRegex.test(text)) {
    return false;
  }

  const num = parseInt(text, 10);
  const ts = num < 10000000000 ? num * 1000 : num;
  const date = new Date(ts);
  const year = date.getFullYear();
  return year >= 1970 && year <= 2100;
}

// Check if text is Base64
function isBase64(str) {
  if (str.length < 8) return false;

  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(str)) return false;

  const remainder = str.length % 4;
  if (remainder === 1) return false;

  const hasUpperCase = /[A-Z]/.test(str);
  const hasLowerCase = /[a-z]/.test(str);
  const hasSpecialChars = /[+/=]/.test(str);

  if (!((hasUpperCase && hasLowerCase) || hasSpecialChars)) return false;

  if (/^[0-9a-fA-F]+$/.test(str)) return false;

  const uniqueChars = new Set(str.replace(/=/g, '')).size;
  const diversityRatio = uniqueChars / str.replace(/=/g, '').length;

  if (diversityRatio < 0.3 || uniqueChars < 4) return false;

  try {
    let base64String = str;
    const paddingNeeded = (4 - (str.length % 4)) % 4;
    if (paddingNeeded > 0) {
      base64String = str + '='.repeat(paddingNeeded);
    }
    const decoded = atob(base64String);
    if (!isPrintable(decoded)) return false;
  } catch (e) {
    return false;
  }

  return true;
}

// Check if decoded string is printable
function isPrintable(str) {
  if (str.includes('\uFFFD')) return false;

  const printableCount = str.split('').filter(char => {
    const code = char.charCodeAt(0);
    return (
      (code >= 32 && code <= 126) ||
      code === 10 || code === 13 || code === 9 ||
      (code >= 128 && code < 55296) ||
      (code >= 57344 && code <= 65535)
    );
  }).length;

  return printableCount / str.length > 0.8;
}

// Decode Base64
function decodeBase64(word) {
  let base64String = word;
  const paddingNeeded = (4 - (word.length % 4)) % 4;
  if (paddingNeeded > 0) {
    base64String = word + '='.repeat(paddingNeeded);
  }
  return atob(base64String);
}

// Get word at position
function getWordAtPosition(element, x, y) {
  const range = document.caretRangeFromPoint(x, y);
  if (!range) return null;

  const textNode = range.startContainer;
  if (textNode.nodeType !== Node.TEXT_NODE) return null;

  const text = textNode.textContent;
  const offset = range.startOffset;

  // Try to match different patterns around the cursor position
  // Pattern 1: Base64 (longer, includes padding)
  const base64Pattern = /[A-Za-z0-9+/]{4,}={0,2}/g;
  // Pattern 2: Timestamp (10-13 digits)
  const timestampPattern = /\d{10,13}/g;
  
  let match;
  let bestMatch = null;
  
  // Find Base64 matches
  base64Pattern.lastIndex = 0;
  while ((match = base64Pattern.exec(text)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      bestMatch = {
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      };
      break;
    }
  }
  
  // If no Base64 match, try timestamp
  if (!bestMatch) {
    timestampPattern.lastIndex = 0;
    while ((match = timestampPattern.exec(text)) !== null) {
      if (offset >= match.index && offset <= match.index + match[0].length) {
        bestMatch = {
          word: match[0],
          start: match.index,
          end: match.index + match[0].length
        };
        break;
      }
    }
  }
  
  // Fallback: expand character by character
  if (!bestMatch) {
    let start = offset;
    let end = offset;
    
    while (start > 0 && /[A-Za-z0-9+/=]/.test(text[start - 1])) {
      start--;
    }
    while (end < text.length && /[A-Za-z0-9+/=]/.test(text[end])) {
      end++;
    }
    
    const word = text.substring(start, end).trim();
    if (word) {
      bestMatch = { word, start, end };
    }
  }
  
  if (!bestMatch) return null;
  
  return {
    word: bestMatch.word,
    range: range,
    textNode: textNode,
    start: bestMatch.start,
    end: bestMatch.end
  };
}

// Show tooltip
function showTooltip(content, x, y) {
  const tt = createTooltip();
  tt.innerHTML = content;
  tt.style.display = 'block';

  // Position tooltip
  const rect = tt.getBoundingClientRect();
  let left = x + 10;
  let top = y + 10;

  // Adjust if tooltip goes off screen
  if (left + rect.width > window.innerWidth) {
    left = x - rect.width - 10;
  }
  if (top + rect.height > window.innerHeight) {
    top = y - rect.height - 10;
  }

  tt.style.left = left + window.scrollX + 'px';
  tt.style.top = top + window.scrollY + 'px';
}

// Hide tooltip
function hideTooltip() {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Handle mouseup for Base64 selection
let tooltipSource = 'none'; // Track tooltip source separately

document.addEventListener('mouseup', (e) => {
  // Small delay to ensure selection is complete
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (!selectedText || selectedText.length < 8) {
      if (tooltipSource === 'selection') {
        hideTooltip();
        tooltipSource = 'none';
      }
      return;
    }
    
    // Check Base64 for selection
    if (config.base64Enabled && isBase64(selectedText)) {
      try {
        const decoded = decodeBase64(selectedText);
        const content = `<span style="color:#CE9178;">🔓 Base64 Decoded</span><br><span style="color:#D4D4D4;">${decoded.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
        
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          showTooltip(content, rect.right, rect.bottom);
          tooltipSource = 'selection';
        }
      } catch (e) {
        console.error('Decode error:', e);
      }
    }
  }, 10);
});

// Handle mousemove for timestamp
let lastWord = null;
let hoverTimeout = null;

document.addEventListener('mousemove', (e) => {
  clearTimeout(hoverTimeout);

  hoverTimeout = setTimeout(() => {
    const wordInfo = getWordAtPosition(e.target, e.clientX, e.clientY);
    if (!wordInfo || !wordInfo.word) {
      if (tooltipSource !== 'selection') {
        hideTooltip();
        tooltipSource = 'none';
      }
      lastWord = null;
      return;
    }

    const word = wordInfo.word;
    if (word === lastWord) return;
    lastWord = word;

    let content = null;

    // Check timestamp
    if (config.timestampEnabled && isTimestamp(word)) {
      const timestamp = parseInt(word, 10);
      const lines = ['<span style="color:#569CD6;">🕒 Timestamp</span>'];
      config.timezones.forEach(tz => {
        const formatted = formatTimestamp(timestamp, config.format, tz);
        lines.push(`<span style="color:#4EC9B0;">${tz}</span>: ${formatted}`);
      });
      content = lines.join('<br>');
    }

    if (content) {
      showTooltip(content, e.clientX, e.clientY);
      tooltipSource = 'hover';
    } else if (tooltipSource !== 'selection') {
      hideTooltip();
      tooltipSource = 'none';
    }
  }, 100);
});

// Hide tooltip when mouse leaves
document.addEventListener('mouseout', (e) => {
  if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
    if (tooltipSource !== 'selection') {
      hideTooltip();
      tooltipSource = 'none';
      lastWord = null;
    }
  }
});

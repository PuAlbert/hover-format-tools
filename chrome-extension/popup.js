// Popup script for settings management

// Load settings
function loadSettings() {
  chrome.storage.sync.get(
    ['timestampEnabled', 'base64Enabled', 'timezones', 'format'],
    (result) => {
      document.getElementById('timestampEnabled').checked = 
        result.timestampEnabled !== false;
      document.getElementById('base64Enabled').checked = 
        result.base64Enabled !== false;
      document.getElementById('timezones').value = 
        (result.timezones || ['UTC', 'Asia/Shanghai']).join('\n');
      document.getElementById('format').value = 
        result.format || 'YYYY-MM-DD HH:mm:ss';
      
      updateConfigVisibility();
    }
  );
}

// Update config visibility based on toggle
function updateConfigVisibility() {
  const timestampEnabled = document.getElementById('timestampEnabled').checked;
  const timestampConfig = document.getElementById('timestampConfig');
  timestampConfig.style.display = timestampEnabled ? 'block' : 'none';
}

// Save settings
function saveSettings() {
  const timestampEnabled = document.getElementById('timestampEnabled').checked;
  const base64Enabled = document.getElementById('base64Enabled').checked;
  const timezonesText = document.getElementById('timezones').value;
  const format = document.getElementById('format').value;
  
  // Parse timezones
  const timezones = timezonesText
    .split('\n')
    .map(tz => tz.trim())
    .filter(tz => tz.length > 0);
  
  // Validate
  if (timestampEnabled && timezones.length === 0) {
    showStatus('❌ Please enter at least one timezone', 'error');
    return;
  }
  
  if (timestampEnabled && !format.trim()) {
    showStatus('❌ Please enter a time format', 'error');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set(
    {
      timestampEnabled,
      base64Enabled,
      timezones,
      format: format.trim()
    },
    () => {
      showStatus('✅ Settings saved!', 'success');
    }
  );
}

// Show status message
function showStatus(message, type) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.color = type === 'error' ? '#f44336' : '#4CAF50';
  
  setTimeout(() => {
    status.textContent = '';
  }, 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  document.getElementById('timestampEnabled').addEventListener('change', updateConfigVisibility);
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  
  // Save on Enter in inputs
  document.getElementById('format').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveSettings();
  });
});

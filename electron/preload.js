// Preload script runs in a privileged context before the renderer page loads.
// Use contextBridge here if you need to expose Node/Electron APIs to Angular.
const { contextBridge } = require('electron');

// Example: expose app version to Angular (access via window.electronAPI.version)
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});

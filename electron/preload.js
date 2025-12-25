const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Currently, Cloudbase operations are handled directly in the renderer process
// This can be extended in the future if main process integration is needed
contextBridge.exposeInMainWorld('electron', {
  // Get configuration
  getConfig: () => ipcRenderer.invoke('get-config'),
  // Future IPC methods can be added here
  cloudbase: {
    // These handlers are available but currently unused
    // Cloudbase SDK runs directly in renderer for better performance
    init: (config) => ipcRenderer.invoke('cloudbase:init', config),
    login: (credentials) => ipcRenderer.invoke('cloudbase:login', credentials),
    logout: () => ipcRenderer.invoke('cloudbase:logout'),
    getLoginState: () => ipcRenderer.invoke('cloudbase:getLoginState'),
  },
  // File system operations
  createFolder: (folderName) => ipcRenderer.invoke('create-folder', folderName),
  downloadFiles: (params) => ipcRenderer.invoke('download-files', params),
});

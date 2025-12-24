const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  cloudbase: {
    init: (config) => ipcRenderer.invoke('cloudbase:init', config),
    login: (credentials) => ipcRenderer.invoke('cloudbase:login', credentials),
    logout: () => ipcRenderer.invoke('cloudbase:logout'),
    getLoginState: () => ipcRenderer.invoke('cloudbase:getLoginState'),
  },
});

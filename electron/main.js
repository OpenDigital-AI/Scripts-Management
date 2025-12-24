const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app
  // Check if we're in development mode (dev server is running)
  const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev') || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for potential future Cloudbase operations from main process
// Currently, Cloudbase operations are handled directly in the renderer process
// These handlers can be extended if main process needs to perform Cloudbase operations
ipcMain.handle('cloudbase:init', async (event, config) => {
  // Future: Initialize Cloudbase in main process if needed
  return { success: true, message: 'Cloudbase initialized' };
});

ipcMain.handle('cloudbase:login', async (event, credentials) => {
  // Future: Handle login in main process if needed
  return { success: true, message: 'Login handler ready' };
});

ipcMain.handle('cloudbase:logout', async () => {
  // Future: Handle logout in main process if needed
  return { success: true, message: 'Logout handler ready' };
});

ipcMain.handle('cloudbase:getLoginState', async () => {
  // Future: Get login state from main process if needed
  return { success: true, isLoggedIn: false };
});

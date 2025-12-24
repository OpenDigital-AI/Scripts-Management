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
  if (process.env.NODE_ENV === 'development') {
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

// IPC handlers for Cloudbase operations
ipcMain.handle('cloudbase:init', async (event, config) => {
  return { success: true, message: 'Cloudbase initialized' };
});

ipcMain.handle('cloudbase:login', async (event, credentials) => {
  return { success: true, message: 'Login handler ready' };
});

ipcMain.handle('cloudbase:logout', async () => {
  return { success: true, message: 'Logout handler ready' };
});

ipcMain.handle('cloudbase:getLoginState', async () => {
  return { success: true, isLoggedIn: false };
});

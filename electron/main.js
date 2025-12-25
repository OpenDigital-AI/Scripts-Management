const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const http = require('http');

let mainWindow;
let appConfig = null;

// Load configuration from config.json
function loadConfig() {
  try {
    // In development, config.json is in the project root
    // In production, config.json should be next to the .exe
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev') || !app.isPackaged;
    const configPath = isDev 
      ? path.join(__dirname, '../config.json')
      : path.join(path.dirname(app.getPath('exe')), 'config.json');
    
    console.log('Loading config from:', configPath);
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      appConfig = JSON.parse(configData);
      console.log('Config loaded successfully:', appConfig);
    } else {
      console.warn('config.json not found at:', configPath);
      // Use default values
      appConfig = {
        cloudbaseEnv: 'digital-connect-3g0d1vrha9ea1e5c',
        cloudbaseRegion: 'ap-shanghai'
      };
    }
  } catch (error) {
    console.error('Error loading config.json:', error);
    // Use default values
    appConfig = {
      cloudbaseEnv: 'digital-connect-3g0d1vrha9ea1e5c',
      cloudbaseRegion: 'ap-shanghai'
    };
  }
}

// IPC handler to get config
ipcMain.handle('get-config', () => {
  return appConfig;
});

function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
      ]
    },
    {
      label: '查看',
      submenu: [
        { label: '重新加载', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: '强制重新加载', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: '开发者工具', accelerator: 'CmdOrCtrl+Shift+I', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '实际大小', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: '放大', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: '缩小', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: '全屏', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { label: '最小化', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: '关闭', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox({
              type: 'info',
              title: '关于',
              message: '脚本集成管理系统 v0.1',
              detail: '基于 Electron + Vue + 腾讯云开发构建'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

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
  loadConfig();
  createMenu();
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

// Create folder on desktop
ipcMain.handle('create-folder', async (event, folderName) => {
  try {
    const desktopPath = path.join(os.homedir(), 'Desktop');
    
    // Get current date in YYYY-MM-DD format
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Base folder name
    let baseFolderName = `${folderName}_${dateStr}`;
    let finalFolderPath = path.join(desktopPath, baseFolderName);
    
    // Check if folder exists and find next available name
    let counter = 1;
    while (fs.existsSync(finalFolderPath)) {
      finalFolderPath = path.join(desktopPath, `${baseFolderName}(${counter})`);
      counter++;
    }
    
    // Create the folder
    fs.mkdirSync(finalFolderPath, { recursive: true });
    
    // Open the folder
    shell.openPath(finalFolderPath);
    
    return { 
      success: true, 
      path: finalFolderPath,
      message: `Folder created: ${path.basename(finalFolderPath)}`
    };
  } catch (error) {
    console.error('Error creating folder:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});

// Download file from URL
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Download files to folder
ipcMain.handle('download-files', async (event, { folderPath, downloadLinks, rawDataLinks }) => {
  try {
    const results = {
      success: true,
      downloaded: [],
      failed: [],
      downloadLinkResults: { downloaded: [], failed: [] },
      rawDataLinkResults: { downloaded: [], failed: [] }
    };
    
    // Prepare links with source tracking (no deduplication)
    const downloadLinksArray = Array.isArray(downloadLinks) ? downloadLinks : [];
    const rawDataLinksArray = Array.isArray(rawDataLinks) ? rawDataLinks : [];
    
    // Build links array with source tracking
    const allLinks = [];
    
    downloadLinksArray.forEach(url => {
      if (url && typeof url === 'string') {
        allLinks.push({ url, source: 'downloadlink' });
      }
    });
    
    rawDataLinksArray.forEach(url => {
      if (url && typeof url === 'string') {
        allLinks.push({ url, source: 'rawdatalink' });
      }
    });
    
    console.log(`Total links to download: ${allLinks.length}`);
    console.log(`Original downloadLinks: ${downloadLinksArray.length}, rawDataLinks: ${rawDataLinksArray.length}`);
    console.log('All links:', allLinks.map(item => item.url));
    
    // Track filename usage for duplicates
    const filenameCount = new Map();
    
    // Download each file
    for (let i = 0; i < allLinks.length; i++) {
      const { url, source } = allLinks[i];
      
      try {
        // Extract filename from URL or use index
        const urlParts = url.split('/');
        const urlFilename = urlParts[urlParts.length - 1].split('?')[0];
        let baseFilename = urlFilename || `file_${i + 1}`;
        
        // Handle duplicate filenames by appending (1), (2), etc.
        let filename = baseFilename;
        if (filenameCount.has(baseFilename)) {
          const count = filenameCount.get(baseFilename);
          filenameCount.set(baseFilename, count + 1);
          
          // Append number after the full filename (including extension)
          filename = `${baseFilename}(${count})`;
        } else {
          filenameCount.set(baseFilename, 1);
        }
        
        const destPath = path.join(folderPath, filename);
        
        console.log(`Downloading ${url} (from ${source}) to ${destPath}`);
        await downloadFile(url, destPath);
        results.downloaded.push(filename);
        
        // Track by source
        if (source === 'downloadlink') {
          results.downloadLinkResults.downloaded.push(filename);
        } else {
          results.rawDataLinkResults.downloaded.push(filename);
        }
        
        console.log(`Successfully downloaded: ${filename}`);
      } catch (error) {
        console.error(`Failed to download ${url}:`, error);
        const failureInfo = { url, error: error.message };
        results.failed.push(failureInfo);
        
        // Track by source
        if (source === 'downloadlink') {
          results.downloadLinkResults.failed.push(failureInfo);
        } else {
          results.rawDataLinkResults.failed.push(failureInfo);
        }
      }
    }
    
    console.log(`Download complete. Success: ${results.downloaded.length}, Failed: ${results.failed.length}`);
    return results;
  } catch (error) {
    console.error('Error downloading files:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});

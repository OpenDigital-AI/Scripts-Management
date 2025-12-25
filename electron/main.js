const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const http = require('http');

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

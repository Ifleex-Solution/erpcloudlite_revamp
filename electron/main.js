const { app, BrowserWindow, protocol, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// app.isPackaged is false when running via `electron .` (dev/build) and true when packaged
// We treat "dev mode" as: ELECTRON_DEV env var OR loading from localhost explicitly
const isDevServer = process.env.ELECTRON_DEV === 'true';
const distPath = path.join(__dirname, '../dist/erpcloudlite-revamp/browser');

app.whenReady().then(() => {
  // In production (packaged), intercept file:// so Angular SPA routing works on refresh
  if (!isDevServer) {
    protocol.interceptFileProtocol('file', (request, callback) => {
      let filePath = decodeURIComponent(new URL(request.url).pathname);

      // Windows: pathname has a leading "/" before the drive letter — strip it
      if (process.platform === 'win32' && filePath.startsWith('/')) {
        filePath = filePath.slice(1);
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        callback({ path: filePath });
      } else {
        // Unknown route — serve index.html so Angular router handles it
        callback({ path: path.join(distPath, 'index.html') });
      }
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: process.platform === 'win32'
      ? path.join(__dirname, '../public/icon-256.ico')
      : path.join(__dirname, '../public/icon-512.png'),
    show: false,
    title: 'ErpCloudLite',
  });

  if (isDevServer) {
    // Dev: point to ng serve (run `ng serve` in a separate terminal first)
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    // Build/production: load the compiled Angular app
    win.loadFile(path.join(distPath, 'index.html'));
  }

  win.once('ready-to-show', () => win.show());

  // Open external links in system browser, not Electron
  win.webContents.setWindowOpenHandler(({ url: linkUrl }) => {
    shell.openExternal(linkUrl);
    return { action: 'deny' };
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

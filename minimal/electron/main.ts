import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Request single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // If we didn't get the lock, quit this instance
  app.quit();
} else {
  // Handle second instance
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open the DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('ping', () => {
  return 'pong';
});

// Save book data to file
ipcMain.handle('save-book', async (event, data: string) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow!, {
      title: 'Save Book',
      defaultPath: 'book-data.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, data, 'utf-8');
      return { success: true, path: result.filePath };
    }
    return { success: false, error: 'Save cancelled' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Load book data from file
ipcMain.handle('load-book', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow!, {
      title: 'Load Book',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const data = fs.readFileSync(result.filePaths[0], 'utf-8');
      return { success: true, data, path: result.filePaths[0] };
    }
    return { success: false, error: 'Load cancelled' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Auto-save functionality
let currentFilePath: string | null = null;

ipcMain.handle('auto-save', async (event, data: string, filePath?: string) => {
  try {
    const saveToPath = filePath || currentFilePath;
    if (saveToPath) {
      fs.writeFileSync(saveToPath, data, 'utf-8');
      currentFilePath = saveToPath;
      return { success: true, path: saveToPath };
    }
    return { success: false, error: 'No file path specified' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

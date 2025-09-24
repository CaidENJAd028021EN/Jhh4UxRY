// 代码生成时间: 2025-09-24 08:34:29
 * Features:
 * - Browse and select directory
 * - Select files to rename
 * - Add a prefix/suffix or replace part of the filename
 * - Confirm and execute rename operation
 */

const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { rename } = require('fs/promises');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

// Main process
class BatchRenamerElectron {
  constructor() {
    this.mainWindow = null;
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    // Load the application's index.html
    this.mainWindow.loadFile('index.html');

    // Open the DevTools.
    this.mainWindow.webContents.openDevTools();

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  renameFiles(filePaths, renamePattern) {
    filePaths.forEach(async (filePath) => {
      try {
        const directoryPath = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const newFileName = renamePattern.replace('{file}', fileName);
        const newFilePath = path.join(directoryPath, newFileName);
        await rename(filePath, newFilePath);
        console.log(`Renamed ${filePath} to ${newFilePath}`);
      } catch (error) {
        console.error(`Error renaming ${filePath}: ${error}`);
      }
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  new BatchRenamerElectron().createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    new BatchRenamerElectron().createWindow();
  }
});

// IPC communication setup
ipcMain.on('rename-files', async (event, filePaths, renamePattern) => {
  const renamer = new BatchRenamerElectron();
  renamer.renameFiles(filePaths, renamePattern);
  event.reply('rename-complete');
});

// Preload script
// preload.js will handle exposing the renameFiles method to the renderer process.

// 代码生成时间: 2025-10-05 01:46:22
// Importing necessary modules
const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const crypto = require('crypto');

// Function to generate a hash for the password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Function to verify password against the hash
function verifyPassword(password, hash) {
  const hashedPassword = hashPassword(password);
  return hashedPassword === hash;
}

// Function to handle encryption and decryption actions
function handlePasswordAction(event, password, action) {
  try {
    if (action === 'encrypt') {
      const encrypted = hashPassword(password);
      event.reply('password-action-response', {
        success: true,
        encrypted: encrypted,
        message: 'Password encrypted successfully.'
      });
    } else if (action === 'decrypt') {
      const decrypted = verifyPassword(password, password);
      event.reply('password-action-response', {
        success: decrypted,
        decrypted: decrypted ? 'Password is correct.' : 'Password does not match the hash.',
        message: decrypted ? 'Password verified successfully.' : 'Decryption failed.'
      });
    } else {
      throw new Error('Invalid action provided.');
    }
  } catch (error) {
    event.reply('password-action-response', {
      success: false,
      error: error.message,
      message: 'An error occurred during the password action.'
    });
  }
}

// Setting up IPC listeners for password encryption and decryption
ipcMain.on('password-action', (event, arg) => {
  const { password, action } = JSON.parse(arg);
  handlePasswordAction(event, password, action);
});

// Main Electron app setup
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
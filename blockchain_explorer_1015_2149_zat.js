// 代码生成时间: 2025-10-15 21:49:45
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const axios = require('axios'); // External module for HTTP requests

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { app.quit(); }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// IPC handler for blockchain data fetching
ipcMain.on('fetch-blockchain-data', async (event, arg) => {
  try {
    // Assuming we have a blockchain API endpoint
    const response = await axios.get('https://blockchain.info/q/getblockcount');
    const blockCount = response.data;
    event.sender.send('blockchain-data-response', blockCount);
  } catch (error) {
    console.error('Error fetching blockchain data:', error);
    event.sender.send('blockchain-data-error', error.message);
  }
});

/*
 * HTML content for index.html to be loaded into the BrowserWindow
 *
 * <!DOCTYPE html>
 * <html>
 *   <head>
 *     <title>Blockchain Explorer</title>
 *   </head>
 *   <body>
 *     <h1>Blockchain Explorer</h1>
 *     <button id="fetchButton">Fetch Blockchain Data</button>
 *     <div id="blockchainData">Blockchain data will be displayed here</div>
 *     <script>
 *       const fetchButton = document.getElementById('fetchButton');
 *       fetchButton.addEventListener('click', () => {
 *         window.electronAPI.fetchBlockchainData();
 *       });
 *     </script>
 *   </body>
 * </html>
 *
 */

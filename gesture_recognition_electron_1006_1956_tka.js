// 代码生成时间: 2025-10-06 19:56:41
const { app, BrowserWindow } = require('electron');
const { TouchBar } = require('electron');
const { TouchBarButton, TouchBarLabel } = TouchBar;
const { Gesture } = require('./Gesture');

// Function to create the window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');

  const gesture = new Gesture(win);
  gesture.initGestureRecognition();
}

// Function to handle errors
function handleError(error) {
  console.error('An error occurred:', error);
  app.exit(1);
}

app.whenReady().then(createWindow).catch(handleError);

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

// Gesture class to handle gesture recognition
class Gesture {
  constructor(win) {
    this.win = win;
  }

  initGestureRecognition() {
    try {
      // Initialize gesture recognition logic here
      // This is a placeholder, actual gesture recognition logic would go here
      console.log('Gesture recognition initialized');

      // Example of adding a touch bar button for gesture feedback
      const touchBar = new TouchBar({
        items: [
          new TouchBarButton({
            label: 'Gesture',
            click: () => {
              console.log('Touch bar button clicked');
            },
          }),
          new TouchBarLabel('Gesture feedback'),
        ],
      });

      this.win.setTouchBar(touchBar);
    } catch (error) {
      console.error('Failed to initialize gesture recognition:', error);
    }
  }
}

// Export the Gesture class for potential future use
module.exports = { Gesture };

// 代码生成时间: 2025-10-10 02:16:20
const { app, BrowserWindow } = require('electron');
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

// Function to simulate some work
function someWork() {
  let sum = 0;
  for (let i = 0; i < 10000; i++) {
    sum += i;
  }
  return sum;
}

// Function to benchmark
function benchmarkFunction() {
  suite
    .add('someWork', function() {
      someWork();
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });
}

// Electron application setup
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  // Start the benchmark after the app is ready
  benchmarkFunction();
});

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

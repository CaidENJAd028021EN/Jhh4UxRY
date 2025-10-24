// 代码生成时间: 2025-10-25 07:02:05
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// 日志文件路径
const logFilePath = path.join(__dirname, 'audit.log');

// 初始化日志记录函数
function initializeAuditLog() {
  // 创建BrowserWindow实例
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // 加载应用的主窗口
  win.loadFile('index.html');

  // 全局访问日志记录函数
  global.recordAuditLog = function (message) {
    // 将日志消息写入日志文件
    fs.appendFileSync(logFilePath, message + '
', 'utf8');
  };

  // 捕获未处理的异常和错误
  process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    global.recordAuditLog('Uncaught Exception: ' + error);
  });

  // 捕获未处理的Promise拒绝
  process.on('unhandledRejection', reason => {
    console.error('Unhandle Rejection:', reason);
    global.recordAuditLog('Unhandle Rejection: ' + reason);
  });
}

// 确保只有一个实例在运行
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (BrowserWindow.getAllWindows().length) {
      BrowserWindow.getAllWindows()[0].focus();
    }
  });

  app.on('ready', initializeAuditLog);
}

// 监听所有退出事件，确保日志文件被保存
app.on('will-quit', () => {
  console.log('Saving audit logs before quitting...');
  // 可以在这里添加更多的清理代码
});

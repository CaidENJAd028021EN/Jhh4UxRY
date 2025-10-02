// 代码生成时间: 2025-10-02 16:44:35
const { app, BrowserWindow } = require('electron');
const axios = require('axios');

// 创建一个BrowserWindow实例
class ApiTestTool extends BrowserWindow {
  constructor() {
    super({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    this.loadFile('index.html');
  }

  // 发送请求到API
  async sendRequest(method, url, data = {}, headers = {}) {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error.message);
      throw error;
    }
  }
}

// 程序入口
function createWindow() {
  // 创建窗口实例
  let win = new ApiTestTool();

  // 打开开发者工具
  win.webContents.openDevTools();
}

// 在Electron完成初始化并准备好创建浏览器窗口时调用
app.on('ready', createWindow);

// 所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
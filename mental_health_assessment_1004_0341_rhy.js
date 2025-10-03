// 代码生成时间: 2025-10-04 03:41:29
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// 定义评估题库
const questions = [
  {
    text: '你最近感到焦虑或紧张吗？',
    options: ['从不', '偶尔', '经常', '总是'],
  },
  {
    text: '你最近感到沮丧或失落吗？',
    options: ['从不', '偶尔', '经常', '总是'],
  },
  // 更多评估问题...
];

// 定义评估结果
let results = [];

// 创建并加载窗口
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('index.html');

  // 打开开发者工具
  mainWindow.webContents.openDevTools();
}

// 设置程序准备好运行时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 处理所有窗口关闭
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  // 可以在这里添加日志记录或其他错误处理代码
});

// 预加载脚本
// preload.js

// 提供渲染进程访问Node.js模块的能力
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  submitResponse: (response) => {
    // 从渲染进程接收响应
    ipcRenderer.send('submit-response', response);
  },
  getResults: () => {
    // 返回评估结果
    return new Promise((resolve) => {
      ipcRenderer.once('get-results', (event, resultsFromMain) => {
        resolve(resultsFromMain);
      });
      ipcRenderer.send('get-results-request');
    });
  },
});

// 主进程
// 监听来自渲染进程的消息
ipcRenderer.on('submit-response', (event, response) => {
  // 将响应添加到结果数组
  results.push(response);

  // 检查是否所有问题都已回答
  if (results.length === questions.length) {
    // 处理评估结果
    processResults();
  }
});

// 处理评估结果
function processResults() {
  // 根据评估结果计算分数
  let score = 0;
  results.forEach((response) => {
    score += questions[response.questionIndex].options.indexOf(response.selectedOption);
  });

  // 显示评估结果
  console.log('评估结果:', score);
  // 可以在这里添加更多逻辑，例如展示结果或保存到文件
}

// HTML文件
// index.html

<!DOCTYPE html>
<html>
<head>
  <title>心理健康评估</title>
</head>
<body>
  <h1>心理健康评估</h1>
  <form id="assessment-form">
    {questions.map((question, index) => (
      <div key={index}>
        <p>{question.text}</p>
        <select name="options" onChange={(event) => handleOptionChange(event, index)} required>
          {question.options.map((option, idx) => (
            <option value={idx} key={idx}>{option}</option>
          ))}
        </select>
      </div>
    ))}
    <button type="submit">提交评估</button>
  </form>
  <script src="renderer.js"></script>
</body>
</html>

// 渲染进程脚本
// renderer.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('assessment-form');
  let currentQuestionIndex = 0;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const selectedOptionIndex = form.options.selectedIndex;
    const selectedOption = form.options.options[selectedOptionIndex].text;

    // 将响应发送到主进程
    window.electronAPI.submitResponse({
      questionIndex: currentQuestionIndex,
      selectedOption,
    });

    // 转到下一个问题或处理结果
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
    } else {
      // 提交所有响应并处理结果
      window.electronAPI.getResults().then((results) => {
        console.log('所有评估结果:', results);
      });
    }
  });
});

// 处理选项更改
function handleOptionChange(event, index) {
  currentQuestionIndex = index;
}

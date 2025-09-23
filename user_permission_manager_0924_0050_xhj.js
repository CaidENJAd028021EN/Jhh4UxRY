// 代码生成时间: 2025-09-24 00:50:02
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// UserPermissionManager class to handle user permissions
class UserPermissionManager {
    constructor() {
        // Initialize the user permissions file path
        this.userPermissionsFilePath = path.join(app.getPath('userData'), 'user-permissions.json');
        // Load the user permissions from file or create a new one if it does not exist
        this.loadPermissions();
    }

    // Load user permissions from the file
    loadPermissions() {
        try {
            // Check if the file exists
            if (fs.existsSync(this.userPermissionsFilePath)) {
                // Read the file content
                const data = fs.readFileSync(this.userPermissionsFilePath, 'utf8');
                // Parse the JSON content to an object
                this.permissions = JSON.parse(data);
            } else {
                // Create a new empty permissions object if the file does not exist
                this.permissions = {};
                // Save the new permissions object to the file
                this.savePermissions();
            }
        } catch (error) {
            console.error('Error loading permissions:', error);
        }
    }

    // Save user permissions to the file
    savePermissions() {
        try {
            // Convert the permissions object to a JSON string
            const data = JSON.stringify(this.permissions, null, 2);
            // Write the JSON string to the file
            fs.writeFileSync(this.userPermissionsFilePath, data, 'utf8');
        } catch (error) {
            console.error('Error saving permissions:', error);
        }
    }

    // Add or update a user's permissions
    setPermissions(userId, permissions) {
        this.permissions[userId] = permissions;
        this.savePermissions();
    }

    // Remove a user's permissions
    removePermissions(userId) {
        delete this.permissions[userId];
        this.savePermissions();
    }

    // Get a user's permissions
    getPermissions(userId) {
        return this.permissions[userId] || null;
    }
}

// Create the main BrowserWindow
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the index.html of the app
    mainWindow.loadFile('index.html');

    // Open the DevTools
    mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, it's common to re-create a window in the activation event
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

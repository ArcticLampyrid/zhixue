import { app, BrowserWindow, ipcMain, Menu } from "electron";
import * as path from "path";
import { autoUpdater } from 'electron-updater';
import { setupTitlebar, attachTitlebarToWindow } from "custom-electron-titlebar/main";

let mainWindow: Electron.BrowserWindow;

Menu.setApplicationMenu(null);
setupTitlebar();
ipcMain.on('open-dev-tools', (event, options) => {
    const webContents = event.sender
    webContents.openDevTools(options);
})

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: true,
            sandbox: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../client/index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    attachTitlebarToWindow(mainWindow);
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("ready", () => {
    autoUpdater.checkForUpdatesAndNotify();
    createWindow();
});
app.on("browser-window-created", (e, win) => {
    win.removeMenu();
})
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

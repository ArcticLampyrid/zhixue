import { app, BrowserWindow } from "electron";
import * as path from "path";
import { autoUpdater } from 'electron-updater';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "titlebar.js")
        }
    });

    mainWindow.loadFile(path.join(__dirname, "../../src/client/index.html"));

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
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

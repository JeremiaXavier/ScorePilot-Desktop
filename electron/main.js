import { app, BrowserWindow, ipcMain, session } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import process from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let splashWindow;
let mainWindow;

app.whenReady().then(() => {
  splashWindow = new BrowserWindow({
    width: 700,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      preload:path.resolve(__dirname, "preload.js"), // ✅ Fix      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splashWindow.loadURL("http://localhost:5173/splash").catch((err) => {
    console.error("Error loading splash screen:", err);
  });

  splashWindow.center();

  // ✅ Allow Firebase images (fix CSP issue)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src * 'unsafe-inline' data: blob:; img-src * data: https://firebasestorage.googleapis.com;",
        ],
      },
    });
  });

  setTimeout(() => {
    if (splashWindow) {
      splashWindow.close();
    }

    mainWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      fullscreen: true, // ❌ Don't start in fullscreen by default
      webPreferences: {
        preload: path.resolve(__dirname, "preload.js"),// ✅ Fix        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    mainWindow.loadURL("http://localhost:5173/").catch((err) => {
      console.error("Error loading main app:", err);
    });
    // ✅ Ensure window opens in maximized mode
    mainWindow.once("ready-to-show", () => {
      mainWindow.maximize(); // 🔹 Maximizes the window
      mainWindow.show(); // 🔹 Show after maximizing
    });
  }, 6000);
});

// ✅ Fullscreen & Kiosk Mode Toggle
ipcMain.on("toggle-fullscreen", (event, isFullscreen) => {
  if (mainWindow) {
    console.log(`📢 Fullscreen Mode: ${isFullscreen}`);
    mainWindow.setFullScreen(isFullscreen);
    mainWindow.setKiosk(isFullscreen);
    mainWindow.setMenuBarVisibility(!isFullscreen);
    mainWindow.setResizable(!isFullscreen);
  }
});

// Quit the app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

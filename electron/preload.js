const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  toggleFullscreen: (isFullscreen) => ipcRenderer.send("toggle-fullscreen", isFullscreen),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  removeListener: (channel) => ipcRenderer.removeAllListeners(channel),
});

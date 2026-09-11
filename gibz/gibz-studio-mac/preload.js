// GIBZ Studio — pont sécurisé entre la fenêtre et le système (macOS)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('win-minimize'),
  maximize: () => ipcRenderer.send('win-maximize'),
  close: () => ipcRenderer.send('win-close'),
  setMiniMode: (on) => ipcRenderer.send('win-minimode', !!on),
  saveVideo: (data) => ipcRenderer.invoke('save-video', data),
  saveImage: (data) => ipcRenderer.invoke('save-image', data),
  onOpenFile: (cb) => ipcRenderer.on('open-file', (_e, filePath, buf) => cb(filePath, buf))
});

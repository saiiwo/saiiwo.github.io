// GIBZ Studio — point d'entrée Electron (macOS)
const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
let pendingFile = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#050507',
    frame: false, // barre de titre customisée (gérée dans index.html)
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false // le son + les visuels continuent en arrière-plan
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
    if (pendingFile) {
      const f = pendingFile;
      pendingFile = null;
      sendAudioFile(f);
    }
  });

  win.on('closed', () => { win = null; });
}

// --- Ouvrir un fichier audio (double-clic / glisser-déposer sur l'icône) ---
function sendAudioFile(filePath) {
  if (!win) {
    pendingFile = filePath;
    return;
  }
  try {
    const buf = fs.readFileSync(filePath);
    win.webContents.send('open-file', filePath, buf);
  } catch (err) {
    dialog.showErrorBox('GIBZ Studio', "Impossible d'ouvrir ce fichier : " + err.message);
  }
}

// Fichiers ouverts depuis le Finder (macOS)
app.on('open-file', (e, filePath) => {
  e.preventDefault();
  if (win && win.webContents) sendAudioFile(filePath);
  else pendingFile = filePath;
});

// --- Contrôles fenêtre (barre de titre custom) ---
ipcMain.on('win-minimize', () => { if (win) win.minimize(); });
ipcMain.on('win-maximize', () => {
  if (!win) return;
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});
ipcMain.on('win-close', () => { if (win) win.close(); });
ipcMain.on('win-minimode', (_e, on) => {
  if (!win) return;
  try { win.setAlwaysOnTop(!!on, 'floating'); } catch (_) { /* ignore */ }
});

// --- Sauvegardes (vidéo WEBM / capture PNG) ---
async function saveBuffer(data, opts) {
  if (!win) return false;
  const { canceled, filePath } = await dialog.showSaveDialog(win, opts);
  if (canceled || !filePath) return false;
  fs.writeFileSync(filePath, Buffer.from(data));
  shell.showItemInFolder(filePath);
  return true;
}

ipcMain.handle('save-video', (_e, data) => saveBuffer(data, {
  title: 'Enregistrer la vidéo GIBZ',
  defaultPath: `gibz-${Date.now()}.webm`,
  filters: [{ name: 'Vidéo WebM', extensions: ['webm'] }]
}));

ipcMain.handle('save-image', (_e, data) => saveBuffer(data, {
  title: 'Enregistrer la capture GIBZ',
  defaultPath: `gibz-${Date.now()}.png`,
  filters: [{ name: 'Image PNG', extensions: ['png'] }]
}));

// --- Menu macOS (indispensable : Cmd+Q, copier/coller, etc.) ---
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  buildMenu();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

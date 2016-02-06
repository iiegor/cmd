'use strict';

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const globalShortcut = electron.globalShortcut; // Module to register global keyboard shortcuts.
const ipc = electron.ipcMain; // Module to handle asynchronous and synchronous messages sent from a renderer process.
const path = require('path'); // Provide system path utilities

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 700,
    height: 400,
    minWidth: 500,
    minHeight: 200,
    frame: false,
    titleBarStyle: 'hidden-inset'
  });

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Expose DevTools on dev mode
  if (process.argv.indexOf('--dev') !== -1) {
    globalShortcut.register('ctrl+shift+j', function() {
      mainWindow.webContents.openDevTools();
    });
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Bind window events.
  mainWindow.on('blur', function() {
    mainWindow.webContents.send('blur');
  });

  mainWindow.on('focus', function() {
    mainWindow.webContents.send('focus');
  });
});
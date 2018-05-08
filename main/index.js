'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');
const url = require('url');
const isDevelopment = require('electron-is-dev');
const controllers = require('./controllers')

let mainWindow

function createMainWindow() {
  const window = new BrowserWindow({
    x: 0,
    y: 0,
    width: 600,
    height: 600,
    // backgroundColor: '#000000',
  })

  if (isDevelopment) {
    // window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:3000`)
  }

  else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, '../build/index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})

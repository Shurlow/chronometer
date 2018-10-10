const { exec } = require('child_process')
const { promisify } = require('util')
const execAsPromise = promisify(exec)
const path = require('path')

// const fs = require('fs')

const { app, ipcMain } = require('electron')
const Store = require('electron-store');
const store = new Store();
const isDevelopment = require('electron-is-dev');
const app_path = app.getAppPath()
const data_path = app.getPath('userData')
const img_dir = path.join(data_path, 'images')

const gradientModel = require('../models/gradient')

// app.getAppPath() is different in prod? simple workaround here...
let wallpaperCMD = isDevelopment ? path.join(app_path, 'set_wallpaper') : path.join(app_path, '..', 'set_wallpaper')
const env = {
  DATA_PATH: data_path,
  PATH: process.env.PATH
}

ipcMain.on('save-gradient', (event, colors) => {
  gradientModel.createGradient(colors, img_dir)
    .then((gID) => store.set({ gID, colors }))
    .then(() => execAsPromise(wallpaperCMD, { env }))
    .then(() => event.sender.send('sync-gradient-reply', { colors }))
    .catch(console.error)
})

ipcMain.on('sync-gradient', (event) => {
  const colors = store.get('colors')
  if (colors) {
    event.sender.send('sync-gradient-reply', { colors })
  }
})

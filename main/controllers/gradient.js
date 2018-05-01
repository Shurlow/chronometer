const { app, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const gradientModel = require('../models/gradient')
const Store = require('electron-store');
const store = new Store();

ipcMain.on('save-gradient', (event, colors) => {
  gradientModel.createGradient(colors)
    .then((config) => {
      console.log('Colors saved.', config);
      store.set(config)
      event.sender.send('sync-gradient-reply', { colors })
    })
    .catch(console.error)
})

ipcMain.on('sync-gradient', (event) => {
  colors = store.get('colors')
  if (colors) {
    event.sender.send('sync-gradient-reply', { colors })
  }
})

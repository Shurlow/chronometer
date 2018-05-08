const { app, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const gradientModel = require('../models/gradient')

ipcMain.on('save-gradient', (event, colors) => {
  gradientModel.createGradient(colors)
    .then(() => {
      event.sender.send('sync-gradient-reply', { colors })
    })
    .catch(console.error)
})

ipcMain.on('sync-gradient', (event) => {
  const colors = gradientModel.getSavedColors()
  if (colors) {
    event.sender.send('sync-gradient-reply', { colors })
  }
})

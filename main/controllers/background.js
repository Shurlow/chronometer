const { ipcMain } = require('electron')
const backgroundModel = require('../models/background')

ipcMain.on('start-background', (event) => {
  backgroundModel.start()
    .then(() => {
      console.log('started background');
    })
})

ipcMain.on('stop-background', (event) => {
  backgroundModel.stop()
    .then(() => {
      console.log('stopped background');
    })
})

ipcMain.on('sync-background', (event) => {
  backgroundModel.isActive()
    .then(res => {
      event.sender.send('sync-background-reply', { active: true })
    })
    .catch(err => {
      event.sender.send('sync-background-reply', { active: false })
    })
})

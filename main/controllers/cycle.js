const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')
const cycleModel = require('../models/cycle')

let cycle

ipcMain.on('start-cycle', (event) => {
  clearInterval(cycle)
  cycle = cycleModel.start()
})

ipcMain.on('stop-cycle', (event) => {
  cycleModel.stop(cycle)
})

ipcMain.on('sync-cycle', (event) => {
  event.sender.send('sync-cycle-reply', { cycle: !!cycle })
})

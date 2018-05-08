const { app } = require('electron')
const { exec } = require('child_process')
const { promisify } = require('util')
const execAsPromise = promisify(exec)
const fs = require('fs-extra')
const path = require('path')
const chroma = require('chroma-js')
const gm = require('gm')
const uuid = require('uuid/v4')
const isDevelopment = require('electron-is-dev');
const Store = require('electron-store');
const store = new Store();

const app_path = app.getAppPath()
const data_path = app.getPath('userData')
const img_dir = path.join(data_path, 'images')

function createGradient(colors) {
  const gID = uuid()
  const chromaColors = colors.map(c => chroma(c))
  const colorScale = chroma.scale(chromaColors)
      .domain([0, 1])
      .mode('lch')

  // TODO: Why is app.getAppPath() diff in prod? simple workaround here...
  let cmd = isDevelopment ? path.join(app_path, 'set_wallpaper') : path.join(app_path, '..', 'set_wallpaper')
  console.log(cmd, data_path);
  const env = {
    DATA_PATH: data_path,
    PATH: process.env.PATH
  }

  return clearImages()
    .then(createGradientSeries(colorScale, gID))
    .then(() => {
      store.set({ gID, colors })
      return execAsPromise(cmd, {env})
    })
    .then((thing) => {
      console.log('here?', thing);
    })
    // .then(() => ({ gID, colors }))
    .catch(console.error)
}

function createGradientSeries(colorScale, gID) {
  const pendingImages = []
  for (let i = 0; i < 24; i++) {
    const step = hourRange(i)
    const colors = {
      start: colorScale(step).hex(),
      end: colorScale(step + 1).hex(),
    }
    pendingImages.push(saveGradientImage(colors, i, gID))
  }

  return Promise.all(pendingImages)
}

function saveGradientImage(colors, hour, gID) {
  const { start, end } = colors
  const file = `gradient-${hour}-${gID}.png`
  const imgPath = path.join(img_dir, file)
  const cmdStr = 'magick -size 200x200 -define gradient:angle=45 -colorspace LCHuv'

  return execAsPromise(`${cmdStr} gradient:${start}-${end} '${imgPath}'`)
    .then(() => `saving wallpaper: ${imgPath}`)
}

function getSavedColors() {
  return store.get('colors')
}

function clearImages() {
  return fs.emptyDir(img_dir)
}

function hourRange(x) {
	return 0.5 * Math.cos( ( 2 * Math.PI / 24 ) * x + Math.PI ) + 0.5
}

module.exports = { createGradient, getSavedColors }

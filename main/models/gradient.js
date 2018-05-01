const { app } = require('electron')
const { exec } = require('child_process')
const { promisify } = require('util')
const execAsPromise = promisify(exec)
const fs = require('fs-extra')
const path = require('path')
const chroma = require('chroma-js')
const wallpaper = require('wallpaper')
const gm = require('gm')
const uuid = require('uuid/v4')

const img_dir = path.join(app.getPath('userData'), 'images')

function createGradient(colors) {
  const gID = uuid()
  const chromaColors = colors.map(c => chroma(c))
  const colorScale = chroma.scale(chromaColors)
      .domain([0, 1])
      .mode('lch')

  const cmd = path.join(app.getAppPath(), 'main', 'set_wallpaper')
  const env = {
    IMG_DIR: img_dir,
    GID: gID,
    PATH: process.env.PATH
  }

  return clearImages()
    .then(createGradientSeries(colorScale, gID))
    .then(execAsPromise(cmd, {env}))
    .then(() => ({ gID, colors }))
    .catch(console.error)
}

function createGradientSeries(colorScale, gID) {
  const pendingImages = []
  for (var i = 0; i < 24; i++) {
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

function clearImages() {
  return fs.emptyDir(img_dir)
}

function hourRange(x) {
	return 0.5 * Math.cos( (2*Math.PI/24) * x + Math.PI) + 0.5
}

module.exports = { createGradient }

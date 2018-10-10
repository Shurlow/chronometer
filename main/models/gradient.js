const { exec } = require('child_process')
const { promisify } = require('util')
const execAsPromise = promisify(exec)
const fs = require('fs-extra')
const path = require('path')
const chroma = require('chroma-js')
// const gm = require('gm').subClass({ imageMagick: true })
const uuid = require('uuid/v4')


function createGradient(colors, img_dir) {
  const gID = uuid()
  const chromaColors = colors.map(c => chroma(c))
  const colorScale = chroma.scale(chromaColors)
      .domain([0, 1])
      .mode('lch')

  return clearImages(img_dir)
    .then(createGradientSeries(colorScale, gID, img_dir))
    .then(() => gID)
    .catch(console.error)
}

function createGradientSeries(colorScale, gID, img_dir) {
  const pendingImages = []
  for (let i = 0; i < 24; i++) {
    const step = hourRange(i)
    const colors = {
      start: colorScale(step).hex(),
      end: colorScale(step + 1).hex(),
    }
    pendingImages.push(saveGradientImage(colors, i, gID, img_dir))
  }

  return Promise.all(pendingImages)
    .then((images) => {
      // console.log(images);
      
      images.map((img,hour) => {
        execAsPromise(`convert -pointsize 20 -fill yellow -draw 'text 610,40 "${hour}"' "${img}" "${img}"`)
          .catch(console.error)
      })
    })
    .catch(console.error)
}

function saveGradientImage(colors, hour, gID, img_dir) {
  const { start, end } = colors
  const file = `gradient-${hour}-${gID}.png`
  const imgPath = path.join(img_dir, file)
  const cmdStr = "magick -size 640x400 -define gradient:angle=45 -colorspace LCHuv"

  return execAsPromise(`${cmdStr} gradient:${start}-${end} '${imgPath}'`)
    .then(() => imgPath)
}

function clearImages(img_dir) {
  return fs.emptyDir(img_dir)
}

function hourRange(x) {
	return 0.5 * Math.cos( ( 2 * Math.PI / 24 ) * x + Math.PI ) + 0.5
}

module.exports = { createGradient }

const { app } = require('electron')
const fs = require('fs')
const path = require('path')
const wallpaper = require('wallpaper')
const img_dir = path.join(app.getPath('userData'), 'images')
const Store = require('electron-store');
const store = new Store();

function start() {
  let counter = 0
  let flip = false
  console.log('running cycle...');

  return setInterval(() => {
    let gID = store.get('gID')
    const file = path.join(img_dir, `gradient-${counter}-${gID}.png`)
    wallpaper.set(file, {scale: 'fill'})
      // .then((msg) => { console.log('Running cycle', counter, 'output', msg) })
      .catch(err => { console.log('Yikes!', err) })

    if (counter === 0 || counter === 23) {
      flip = !flip
    }

    if (flip) counter++
    else counter--

  }, 200)
}

function stop(intervalID) {
  clearInterval(intervalID)
  console.log('cycle stopped');
}

module.exports = {
  start,
  stop
}

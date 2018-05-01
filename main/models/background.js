const { app } = require('electron')
const fs = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')
const execAsPromise = promisify(exec)
const writeFilePromise = promisify(fs.writeFile)
const plist = require('plist')
const Store = require('electron-store');
const store = new Store();

const app_path = app.getAppPath()
const home_path = app.getPath('home')
const data_path = app.getPath('userData')
const output_path = `${home_path}/Library/LaunchAgents/com.chronometer.background.plist`

function setLaunchAgent() {
  const config = {
    Label: 'com.chronometer.background',
    Program: path.join(app_path, 'main', 'set_wallpaper'),
    EnvironmentVariables: {
     PATH: '/bin:/usr/bin:/usr/local/bin',
     IMG_DIR: path.join(data_path, 'images'),
     GID: store.get('gID')
    },
    // WorkingDirectory: path.join(app_path, 'main'),
    StandardOutPath: path.join(app_path, 'logs', 'launch.log'),
    StandardErrorPath: path.join(app_path, 'logs', 'error.log'),
    RunAtLoad: true,
    StartInterval: 60,
    KeepAlive: true,
  }

  const file = plist.build(config)
  return writeFilePromise(output_path, file)
}

function removeLaunchAgent() {
  return fs.remove(output_path)
}

function start() {
  return setLaunchAgent()
    .then(execAsPromise(`launchctl load ${output_path}`))
    .catch(console.error)
}

function stop() {
  return isActive()
    .then((foundError) => {
      return execAsPromise(`launchctl unload ${output_path}`)
    })
    .then(res => {
      return removeLaunchAgent()
    })
    .catch(console.error)
}

function isActive() {
  return execAsPromise(`launchctl list com.chronometer.background`)
}

module.exports = {
  start,
  stop,
  isActive,
}

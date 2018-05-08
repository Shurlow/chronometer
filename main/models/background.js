const { app } = require('electron')
const fs = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')
const execAsPromise = promisify(exec)
const writeFilePromise = promisify(fs.writeFile)
const plist = require('plist')
const isDevelopment = require('electron-is-dev');
const Store = require('electron-store');
const store = new Store();

const app_path = app.getAppPath()
const home_path = app.getPath('home')
const data_path = app.getPath('userData')
const logs_path = app.getPath('logs')
const output_path = `${home_path}/Library/LaunchAgents/com.chronometer.background.plist`

function setLaunchAgent() {
  let cmd = isDevelopment ? path.join(app.getAppPath(), 'set_wallpaper') : path.join(app.getAppPath(), '..', 'set_wallpaper')

  const config = {
    Label: 'com.chronometer.background',
    Program: cmd,
    EnvironmentVariables: {
     PATH: '/bin:/usr/bin:/usr/local/bin',
     DATA_PATH: data_path,
     // GID: store.get('gID')
    },
    // WorkingDirectory: path.join(app_path, 'main'),
    StandardOutPath: path.join(logs_path, 'launch.log'),
    StandardErrorPath: path.join(logs_path, 'error.log'),
    RunAtLoad: true,
    StartInterval: 4000,
    StartCalendarInterval: {
      Minute: 0
    }
    // KeepAlive: true,
  }

  const file = plist.build(config)
  return writeFilePromise(output_path, file)
}

function removeLaunchAgent() {
  return fs.remove(output_path)
}

function start() {
  return setLaunchAgent()
    .then(execAsPromise(`launchctl load -F ${output_path}`))
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

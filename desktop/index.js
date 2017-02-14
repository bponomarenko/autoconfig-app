const { app, BrowserWindow } = require('electron')

const path = require('path')
const url = require('url')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    'min-width': 250,
    'min-height': 400
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../dist/web4app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  win.on('closed', function () {
    win = null
  })

  // Disable internal in-app navigation
  win.webContents.on('will-navigate', function(event) {
    event.preventDefault()
  })
}

// Permanently enabe --ignore-certificate-errors switch
app.commandLine.appendSwitch('ignore-certificate-errors');

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})

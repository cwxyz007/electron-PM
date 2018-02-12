const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

if (process.env.NODE_ENV == 'development') {
  // hot reload
  require('electron-reload')(__dirname)

  const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
  // react devtool extension
  installExtension(REACT_DEVELOPER_TOOLS)
    .then( name => console.log(`Add Extension:  ${name}`))
    .catch( error => console.log(`An error occurred: `, error))
}

let win

let createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, './app/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if(win == null) createWindow()
})

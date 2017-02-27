import {electron, BrowserWindow}        from 'electron'
import path                             from 'path'
import url                              from 'url'
import fs                               from 'fs'

let injectStyle = 'body{background-color:transparent !important;}'

function createLoginWindow () {
    let win = new BrowserWindow({
        width: 288,
        height: 400,
        // titleBarStyle: 'hidden-inset',
        resizable: false,
        frame: false, // Specify false to create a Frameless Window. Default is true.
        transparent: true
    })

    win.setMenu(null)

    win.loadURL(url.format({
        pathname: path.resolve(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'login'
    }))

    // Open the DevTools.
    if (process.env.NODE_ENV === 'development') {
        win.webContents.on('devtools-opened', () => {
            setImmediate(() => {
            win.focus()
            })
        })
        win.webContents.openDevTools()
    }

    let page = win.webContents

    page.on('dom-ready', () => {
    // page.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'))
        page.executeJavaScript(`document.body.className="platform_${process.platform}"`, false)
        page.insertCSS(injectStyle)
    })

    // Open links external
    page.on('new-window', (e, url) => {
        e.preventDefault()
        electron.shell.openExternal(url)
    })

    return win
}

export default createLoginWindow

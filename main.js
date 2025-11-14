const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')

  // Create menu template
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Load Book Data...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(win, {
              title: 'Load Book Data',
              filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile']
            })

            if (!result.canceled && result.filePaths.length > 0) {
              try {
                const filePath = result.filePaths[0]
                const fileContent = fs.readFileSync(filePath, 'utf8')
                const data = JSON.parse(fileContent)

                // Send data to renderer process
                win.webContents.send('load-book-data', data)

                dialog.showMessageBox(win, {
                  type: 'info',
                  title: 'Success',
                  message: 'Book data loaded successfully!'
                })
              } catch (error) {
                dialog.showMessageBox(win, {
                  type: 'error',
                  title: 'Error',
                  message: 'Failed to load book data',
                  detail: error.message
                })
              }
            }
          }
        },
        {
          label: 'Save Book Data...',
          accelerator: 'CmdOrCtrl+S',
          click: async () => {
            // Request data from renderer
            win.webContents.send('request-book-data')
          }
        },
        {
          label: 'Save Book Data As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: async () => {
            // Request data from renderer with force save as
            win.webContents.send('request-book-data', { saveAs: true })
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Select All' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: (item, focusedWindow) => {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Reset Zoom' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'AI Assistant...',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => {
            win.webContents.send('open-ai-panel')
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox({
              type: 'info',
              title: 'About Novel Writer',
              message: 'Novel Writer',
              detail: 'A novel writing application built with Electron.\nVersion 1.0.0'
            })
          }
        }
      ]
    }
  ]

  // Build menu from template
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)

  // Handle save-book-data from renderer
  ipcMain.on('save-book-data', async (event, data, saveAs = false) => {
    try {
      let filePath = path.join(__dirname, 'data', 'book-data.json')

      if (saveAs) {
        const result = await dialog.showSaveDialog(win, {
          title: 'Save Book Data',
          defaultPath: 'book-data.json',
          filters: [
            { name: 'JSON Files', extensions: ['json'] },
            { name: 'All Files', extensions: ['*'] }
          ]
        })

        if (result.canceled) return
        filePath = result.filePath
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')

      dialog.showMessageBox(win, {
        type: 'info',
        title: 'Success',
        message: 'Book data saved successfully!',
        detail: `Saved to: ${filePath}`
      })
    } catch (error) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Error',
        message: 'Failed to save book data',
        detail: error.message
      })
    }
  })

  // Open DevTools automatically (optional - remove if not needed)
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})
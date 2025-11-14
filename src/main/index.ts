/* eslint-disable @typescript-eslint/no-require-imports */
// src/main/index.ts (rename indexed.ts to index.ts)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path, { join } from 'path'
import { DownloadManager } from './download-manager'
import Store from 'electron-store'

const isDev = import.meta.env.DEV

let mainWindow: BrowserWindow | null = null
let downloadManager: DownloadManager

// Initialize persistent store
const store = new Store()

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.resolve(process.cwd(), 'out/preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    autoHideMenuBar: true,
    icon: join(__dirname, '../../public/icon.png')
  })

  // Log the preload path for debugging
  const preloadPath = path.resolve(process.cwd(), 'out/preload/index.mjs')
  console.log('Preload path:', preloadPath)
  console.log('Exists?', require('fs').existsSync(preloadPath))

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()

    // Suppress DevTools autofill warnings
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.devToolsWebContents?.executeJavaScript(`
        const originalConsoleError = console.error;
        console.error = (...args) => {
          if (args[0]?.includes?.('Autofill')) return;
          originalConsoleError(...args);
        };
      `)
    })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Wait for the page to load before initializing download manager
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window finished loading')

    // Test if preload worked
    mainWindow?.webContents
      .executeJavaScript('typeof window.electron')
      .then((result) => console.log('window.electron type:', result))
      .catch((err) => console.error('Error checking window.electron:', err))
  })

  downloadManager = new DownloadManager(mainWindow, store)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers
ipcMain.handle('fetch-video-info', async (_event, url: string) => {
  try {
    const videoInfo = await downloadManager.fetchVideoInfo(url)
    return JSON.parse(JSON.stringify(videoInfo))
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching video info:', errorMessage)
    throw new Error(errorMessage)
  }
})

ipcMain.handle(
  'start-download',
  async (_event, url: string, formatId: string, title: string, audioOnly: boolean = false) => {
    try {
      return await downloadManager.startDownload(url, formatId, title, audioOnly)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(errorMessage)
    }
  }
)

ipcMain.handle('cancel-download', async (_event, id: string) => {
  return downloadManager.cancelDownload(id)
})

ipcMain.handle('retry-download', async (_event, id: string) => {
  return downloadManager.retryDownload(id)
})

ipcMain.handle('get-downloads', async () => {
  try {
    const downloads = downloadManager.getDownloads()
    return JSON.parse(JSON.stringify(downloads))
  } catch (error) {
    console.error('Error in get-downloads handler:', error)
    return []
  }
})

ipcMain.handle('delete-download', async (_event, id: string) => {
  return downloadManager.deleteDownload(id)
})

ipcMain.handle('clear-completed', async () => {
  return downloadManager.clearCompleted()
})

ipcMain.handle('open-file-location', async (_event, filePath: string) => {
  shell.showItemInFolder(filePath)
})

ipcMain.handle('select-download-path', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Download Location'
  })
  if (!result.canceled && result.filePaths.length > 0) {
    store.set('downloadPath', result.filePaths[0])
    downloadManager.updateDownloadPath(result.filePaths[0])
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('get-settings', async () => {
  return {
    downloadPath: store.get('downloadPath', downloadManager.getDefaultDownloadPath()),
    maxConcurrent: store.get('maxConcurrent', 3),
    audioFormat: store.get('audioFormat', 'mp3')
  }
})

ipcMain.handle('save-settings', async (_event, settings: any) => {
  store.set('downloadPath', settings.downloadPath)
  store.set('maxConcurrent', settings.maxConcurrent)
  store.set('audioFormat', settings.audioFormat)
  downloadManager.updateSettings(settings)
  return true
})

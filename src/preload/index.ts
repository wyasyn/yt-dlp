// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRendererEvent } from 'electron'

console.log('🚀 Preload script is running!')

interface VideoFormat {
  id: string
  resolution: string
  ext: string
  hasAudio: boolean
  size: string
}

interface VideoInfo {
  title: string
  formats: VideoFormat[]
  audioFormats: VideoFormat[]
  duration: number
  thumbnail: string
}

interface Download {
  id: string
  title: string
  url: string
  format: string
  audioOnly: boolean
  status: 'queued' | 'downloading' | 'completed' | 'failed' | 'cancelled'
  progress: number
  speed: string
  eta: string
  size: string
  downloaded: string
  timestamp: number
  filePath?: string
  error?: string
}

interface Settings {
  downloadPath: string
  maxConcurrent: number
  audioFormat: string
}

const api = {
  fetchVideoInfo: (url: string): Promise<VideoInfo> => {
    console.log('fetchVideoInfo called with:', url)
    return ipcRenderer.invoke('fetch-video-info', url)
  },

  startDownload: (
    url: string,
    formatId: string,
    title: string,
    audioOnly = false
  ): Promise<string> => {
    console.log('startDownload called')
    return ipcRenderer.invoke('start-download', url, formatId, title, audioOnly)
  },

  cancelDownload: (id: string): Promise<boolean> => {
    console.log('cancelDownload called with:', id)
    return ipcRenderer.invoke('cancel-download', id)
  },

  retryDownload: (id: string): Promise<string> => {
    console.log('retryDownload called with:', id)
    return ipcRenderer.invoke('retry-download', id)
  },

  getDownloads: (): Promise<Download[]> => {
    console.log('getDownloads called')
    return ipcRenderer.invoke('get-downloads')
  },

  deleteDownload: (id: string): Promise<boolean> => {
    console.log('deleteDownload called with:', id)
    return ipcRenderer.invoke('delete-download', id)
  },

  clearCompleted: (): Promise<void> => {
    console.log('clearCompleted called')
    return ipcRenderer.invoke('clear-completed')
  },

  openFileLocation: (filePath: string): Promise<void> => {
    console.log('openFileLocation called with:', filePath)
    return ipcRenderer.invoke('open-file-location', filePath)
  },

  selectDownloadPath: (): Promise<string | null> => {
    console.log('selectDownloadPath called')
    return ipcRenderer.invoke('select-download-path')
  },

  getSettings: (): Promise<Settings> => {
    console.log('getSettings called')
    return ipcRenderer.invoke('get-settings')
  },

  saveSettings: (settings: Settings): Promise<boolean> => {
    console.log('saveSettings called with:', settings)
    return ipcRenderer.invoke('save-settings', settings)
  },

  onDownloadUpdate: (callback: (download: Download) => void): (() => void) => {
    console.log('onDownloadUpdate listener registered')

    const subscription = (_event: IpcRendererEvent, downloadData: unknown): void => {
      try {
        // Parse the data to ensure it's clean
        const download = JSON.parse(JSON.stringify(downloadData)) as Download
        console.log('Download update received:', download.id)
        callback(download)
      } catch (error) {
        console.error('Error processing download update:', error)
      }
    }

    ipcRenderer.on('download-update', subscription)

    return (): void => {
      console.log('onDownloadUpdate listener removed')
      ipcRenderer.removeListener('download-update', subscription)
    }
  },
  onDownloadDeleted: (callback: (id: string) => void): (() => void) => {
    console.log('onDownloadDeleted listener registered')

    const subscription = (_event: IpcRendererEvent, idData: unknown): void => {
      try {
        const id = String(idData)
        console.log('Download deleted:', id)
        callback(id)
      } catch (error) {
        console.error('Error processing download deleted:', error)
      }
    }

    ipcRenderer.on('download-deleted', subscription)

    return (): void => {
      console.log('onDownloadDeleted listener removed')
      ipcRenderer.removeListener('download-deleted', subscription)
    }
  }
}

// Expose the API
try {
  contextBridge.exposeInMainWorld('electron', api)
  console.log('✅ Electron API exposed successfully!')
} catch (error) {
  console.error('❌ Failed to expose Electron API:', error)
}

// src/types/index.ts

export interface VideoFormat {
  id: string
  resolution: string
  ext: string
  hasAudio: boolean
  size: string
}

export interface VideoInfo {
  title: string
  formats: VideoFormat[]
  audioFormats: VideoFormat[]
  duration: number
  thumbnail: string
}

export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'failed' | 'cancelled'

export interface Download {
  id: string
  title: string
  url: string
  format: string
  audioOnly: boolean
  status: DownloadStatus
  progress: number
  speed: string
  eta: string
  size: string
  downloaded: string
  timestamp: number
  filePath?: string
  error?: string
}

export interface AppSettings {
  downloadPath: string
  maxConcurrent: number
  audioFormat: string
}

export type DownloadType = 'video' | 'audio'
export type TabType = 'downloader' | 'history' | 'settings'

export interface ElectronAPI {
  fetchVideoInfo: (url: string) => Promise<VideoInfo>
  startDownload: (
    url: string,
    formatId: string,
    title: string,
    audioOnly?: boolean
  ) => Promise<string>
  cancelDownload: (id: string) => Promise<boolean>
  retryDownload: (id: string) => Promise<string>
  getDownloads: () => Promise<Download[]>
  deleteDownload: (id: string) => Promise<boolean>
  clearCompleted: () => Promise<void>
  openFileLocation: (filePath: string) => Promise<void>
  selectDownloadPath: () => Promise<string | null>
  getSettings: () => Promise<AppSettings>
  saveSettings: (settings: AppSettings) => Promise<boolean>
  onDownloadUpdate: (callback: (download: Download) => void) => () => void
  onDownloadDeleted: (callback: (id: string) => void) => () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}

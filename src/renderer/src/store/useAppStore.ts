// src/store/useAppStore.ts
import { create } from 'zustand'
import { Download, VideoInfo, AppSettings, DownloadType, TabType } from '../types'

interface AppState {
  // UI State
  url: string
  videoInfo: VideoInfo | null
  selectedFormat: string
  downloadType: DownloadType
  downloads: Download[]
  activeTab: TabType
  isLoading: boolean
  error: string
  settings: AppSettings

  // Actions
  setUrl: (url: string) => void
  setVideoInfo: (info: VideoInfo | null) => void
  setSelectedFormat: (format: string) => void
  setDownloadType: (type: DownloadType) => void
  setDownloads: (downloads: Download[]) => void
  setActiveTab: (tab: TabType) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string) => void
  setSettings: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void

  // Complex Actions
  updateDownload: (download: Download) => void
  removeDownload: (id: string) => void
  loadDownloads: () => Promise<void>
  loadSettings: () => Promise<void>
  fetchVideoInfo: () => Promise<void>
  startDownload: () => Promise<void>
  retryDownload: (download: Download) => Promise<void>
  deleteDownload: (id: string) => Promise<void>
  clearCompleted: () => Promise<void>
  openFileLocation: (filePath: string) => Promise<void>
  selectDownloadPath: () => Promise<void>
  saveSettings: () => Promise<void>
  resetDownloadForm: () => void

  // Computed Values
  activeDownloads: number
  completedDownloads: number
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  url: '',
  videoInfo: null,
  selectedFormat: '',
  downloadType: 'video',
  downloads: [],
  activeTab: 'downloader',
  isLoading: false,
  error: '',
  settings: {
    downloadPath: '',
    maxConcurrent: 3,
    audioFormat: 'mp3'
  },

  // Simple Setters
  setUrl: (url) => set({ url }),
  setVideoInfo: (videoInfo) => set({ videoInfo }),
  setSelectedFormat: (selectedFormat) => set({ selectedFormat }),
  setDownloadType: (downloadType) => set({ downloadType, selectedFormat: '' }),
  setDownloads: (downloads) => set({ downloads }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSettings: (settings) =>
    set((state) => ({
      settings: typeof settings === 'function' ? settings(state.settings) : settings
    })),

  // Complex Actions
  updateDownload: (download) =>
    set((state) => {
      const index = state.downloads.findIndex((d) => d.id === download.id)
      if (index >= 0) {
        const newDownloads = [...state.downloads]
        newDownloads[index] = download
        return { downloads: newDownloads }
      }
      return { downloads: [download, ...state.downloads] }
    }),

  removeDownload: (id) =>
    set((state) => ({
      downloads: state.downloads.filter((d) => d.id !== id)
    })),

  loadDownloads: async () => {
    try {
      console.log('Loading downloads...')
      const downloads = await window.electron.getDownloads()
      console.log('Downloads loaded:', downloads.length)
      set({ downloads, error: '' })
    } catch (error) {
      console.error('Failed to load downloads:', error)
      set({
        error: 'Failed to load download history',
        downloads: []
      })
    }
  },

  loadSettings: async () => {
    try {
      const settings = await window.electron.getSettings()
      set({ settings })
    } catch (error) {
      console.error('Failed to load settings:', error)
      set({ error: 'Failed to load settings' })
    }
  },

  fetchVideoInfo: async () => {
    const { url } = get()

    if (!url.trim()) {
      set({ error: 'Please enter a valid YouTube URL' })
      return
    }

    set({ isLoading: true, error: '' })

    try {
      const info = await window.electron.fetchVideoInfo(url)
      set({
        videoInfo: info,
        error: '',
        selectedFormat: '',
        isLoading: false
      })
    } catch (err) {
      console.error('Fetch error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch video info'
      set({
        error: errorMessage,
        videoInfo: null,
        isLoading: false
      })
    }
  },

  startDownload: async () => {
    const { videoInfo, selectedFormat, url, downloadType } = get()

    if (!videoInfo || !selectedFormat) {
      set({ error: 'Please select a quality option' })
      return
    }

    try {
      await window.electron.startDownload(
        url,
        selectedFormat,
        videoInfo.title,
        downloadType === 'audio'
      )

      set({
        activeTab: 'history',
        error: '',
        url: '',
        videoInfo: null,
        selectedFormat: ''
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start download'
      set({ error: errorMessage })
    }
  },

  retryDownload: async (download) => {
    try {
      await window.electron.retryDownload(download.id)
    } catch (err) {
      console.error('Retry failed:', err)
      set({ error: 'Failed to retry download' })
    }
  },

  deleteDownload: async (id) => {
    try {
      await window.electron.deleteDownload(id)
    } catch (err) {
      console.error('Delete failed:', err)
      set({ error: 'Failed to delete download' })
    }
  },

  clearCompleted: async () => {
    try {
      await window.electron.clearCompleted()
    } catch (err) {
      console.error('Clear completed failed:', err)
      set({ error: 'Failed to clear completed downloads' })
    }
  },

  openFileLocation: async (filePath) => {
    try {
      await window.electron.openFileLocation(filePath)
    } catch (err) {
      console.error('Open file location failed:', err)
      set({ error: 'Failed to open file location' })
    }
  },

  selectDownloadPath: async () => {
    try {
      const newPath = await window.electron.selectDownloadPath()
      if (newPath) {
        set((state) => ({
          settings: { ...state.settings, downloadPath: newPath }
        }))
      }
    } catch (err) {
      console.error('Select download path failed:', err)
      set({ error: 'Failed to select download path' })
    }
  },

  saveSettings: async () => {
    const { settings } = get()
    try {
      await window.electron.saveSettings(settings)
      alert('Settings saved successfully!')
    } catch (err) {
      console.error('Save settings failed:', err)
      set({ error: 'Failed to save settings' })
    }
  },

  resetDownloadForm: () => {
    set({
      url: '',
      videoInfo: null,
      selectedFormat: '',
      error: ''
    })
  },

  // Computed Values
  get activeDownloads() {
    return get().downloads.filter((d) => d.status === 'downloading' || d.status === 'queued').length
  },

  get completedDownloads() {
    return get().downloads.filter((d) => d.status === 'completed').length
  }
}))

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/main/download-manager.ts
import { BrowserWindow } from 'electron'
import type { ChildProcessWithoutNullStreams } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import Store from 'electron-store'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

interface VideoFormat {
  id: string
  resolution: string
  ext: string
  hasAudio: boolean
  size: string
  filesize?: number
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

/**
 * DownloadManager
 * - Uses `yt-dlp-wrap` to download videos / audio
 * - Stores download metadata in electron-store
 * - Manages a simple queue with concurrency control
 */
export class DownloadManager {
  private ytDlp: any
  private YTDlpWrap: any
  private downloads: Map<string, Download>
  private processes: Map<string, ChildProcessWithoutNullStreams>
  private window: BrowserWindow
  private downloadPath: string
  private store: Store
  private downloadQueue: string[] = []
  private activeDownloads = 0
  private maxConcurrent = 3
  private audioFormat = 'mp3'

  constructor(window: BrowserWindow, store: Store) {
    this.window = window
    this.store = store
    this.downloads = new Map()
    this.processes = new Map()

    // Load saved download path or use default
    this.downloadPath = store.get('downloadPath', this.getDefaultDownloadPath()) as string
    this.maxConcurrent = store.get('maxConcurrent', 3) as number
    this.audioFormat = store.get('audioFormat', 'mp3') as string

    // Ensure download directory exists
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true })
    }

    // Initialize yt-dlp using CommonJS require
    try {
      this.YTDlpWrap = require('yt-dlp-wrap').default || require('yt-dlp-wrap')
      this.ytDlp = new this.YTDlpWrap()
      console.log('YTDlpWrap initialized successfully')

      // handle promise rejection from async call so constructor doesn't produce unhandled rejections
      this.ensureYtDlp().catch((err) => console.error('ensureYtDlp error:', err))
    } catch (error) {
      console.error('Failed to initialize YTDlpWrap:', error)
    }

    // Load saved downloads from store
    this.loadSavedDownloads()
  }

  getDefaultDownloadPath(): string {
    return path.join(os.homedir(), 'Downloads', 'YouTube')
  }

  private loadSavedDownloads(): void {
    try {
      const saved = (this.store.get('downloads', []) as Download[]) || []
      saved.forEach((download) => {
        const cleanDownload: Download = {
          id: String(download.id),
          title: String(download.title),
          url: String(download.url),
          format: String(download.format),
          audioOnly: Boolean(download.audioOnly),
          status: download.status,
          progress: Number(download.progress) || 0,
          speed: String(download.speed),
          eta: String(download.eta),
          size: String(download.size),
          downloaded: String(download.downloaded),
          timestamp: Number(download.timestamp)
        }

        if (download.filePath) {
          cleanDownload.filePath = String(download.filePath)
        }
        if (download.error) {
          cleanDownload.error = String(download.error)
        }

        this.downloads.set(cleanDownload.id, cleanDownload)
      })
      console.log(`Loaded ${this.downloads.size} downloads from storage`)
    } catch (error) {
      console.error('Error loading saved downloads:', error)
      this.store.set('downloads', [])
    }
  }

  private saveDownloads(): void {
    try {
      const downloads = Array.from(this.downloads.values()).map((download) => ({
        id: String(download.id),
        title: String(download.title),
        url: String(download.url),
        format: String(download.format),
        audioOnly: Boolean(download.audioOnly),
        status: download.status,
        progress: Number(download.progress) || 0,
        speed: String(download.speed),
        eta: String(download.eta),
        size: String(download.size),
        downloaded: String(download.downloaded),
        timestamp: Number(download.timestamp),
        ...(download.filePath && { filePath: String(download.filePath) }),
        ...(download.error && { error: String(download.error) })
      }))

      this.store.set('downloads', downloads)
    } catch (error) {
      console.error('Error saving downloads:', error)
    }
  }

  private async ensureYtDlp(): Promise<void> {
    try {
      await this.ytDlp.getVersion()
      console.log('yt-dlp is available')
    } catch {
      console.log('yt-dlp not available locally; attempting download...')
      try {
        if (typeof this.YTDlpWrap.downloadFromGithub === 'function') {
          await this.YTDlpWrap.downloadFromGithub()
          console.log('yt-dlp downloaded successfully')
        }
      } catch (error) {
        console.error('Failed to download yt-dlp:', error)
      }
    }
  }

  async fetchVideoInfo(url: string): Promise<VideoInfo> {
    if (!this.ytDlp) {
      throw new Error('YTDlpWrap not initialized')
    }

    if (!this.isValidYouTubeUrl(url)) {
      throw new Error('Invalid YouTube URL')
    }

    try {
      const info = await this.ytDlp.getVideoInfo(url)

      const videoFormats: VideoFormat[] = []
      const audioFormats: VideoFormat[] = []
      const seenVideo = new Set<string>()
      const seenAudio = new Set<string>()

      for (const format of info.formats || []) {
        // video formats (have vcodec and height)
        if (format.vcodec && format.vcodec !== 'none' && format.height) {
          const resolution = `${format.height}p`
          const key = `${resolution}-${format.acodec !== 'none'}`

          if (!seenVideo.has(key)) {
            seenVideo.add(key)

            const filesize = format.filesize || format.filesize_approx || 0
            const sizeMB = filesize / (1024 * 1024)

            videoFormats.push({
              id: String(format.format_id),
              resolution: String(resolution),
              ext: String(format.ext || 'mp4'),
              hasAudio: !!(format.acodec && format.acodec !== 'none'),
              size: filesize ? `${sizeMB.toFixed(1)} MB` : 'Unknown',
              filesize: Number(filesize || 0)
            })
          }
        }

        // audio-only formats
        if (
          format.acodec &&
          format.acodec !== 'none' &&
          (!format.vcodec || format.vcodec === 'none')
        ) {
          const abr = format.abr || 128
          const key = `${abr}`

          if (!seenAudio.has(key)) {
            seenAudio.add(key)

            const filesize = format.filesize || format.filesize_approx || 0
            const sizeMB = filesize / (1024 * 1024)

            audioFormats.push({
              id: String(format.format_id),
              resolution: `${abr}kbps`,
              ext: String(format.ext || 'm4a'),
              hasAudio: true,
              size: filesize ? `${sizeMB.toFixed(1)} MB` : 'Unknown',
              filesize: Number(filesize || 0)
            })
          }
        }
      }

      videoFormats.sort((a, b) => {
        const aRes = parseInt(a.resolution) || 0
        const bRes = parseInt(b.resolution) || 0
        return bRes - aRes
      })

      audioFormats.sort((a, b) => {
        const aRes = parseInt(a.resolution) || 0
        const bRes = parseInt(b.resolution) || 0
        return bRes - aRes
      })

      return {
        title: String(info.title || 'Unknown'),
        formats: videoFormats,
        audioFormats: audioFormats,
        duration: Number(info.duration || 0),
        thumbnail: String(info.thumbnail || '')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Failed to fetch video info: ${errorMessage}`)
    }
  }

  private isValidYouTubeUrl(url: string): boolean {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/
    ]
    return patterns.some((pattern) => pattern.test(url))
  }

  async startDownload(
    url: string,
    formatId: string,
    title: string,
    audioOnly: boolean = false
  ): Promise<string> {
    if (!this.ytDlp) {
      throw new Error('YTDlpWrap not initialized')
    }

    const id = Date.now().toString()

    const download: Download = {
      id,
      title,
      url,
      format: audioOnly ? `Audio (${this.audioFormat})` : formatId,
      audioOnly,
      status: 'queued',
      progress: 0,
      speed: '0 KB/s',
      eta: 'Unknown',
      size: 'Unknown',
      downloaded: '0 MB',
      timestamp: Date.now()
    }

    this.downloads.set(id, download)
    this.saveDownloads()
    this.notifyRenderer('download-update', download)

    // Add to queue and start processing
    this.downloadQueue.push(id)
    void this.processQueue()

    return id
  }

  private async processQueue(): Promise<void> {
    while (this.activeDownloads < this.maxConcurrent && this.downloadQueue.length > 0) {
      const id = this.downloadQueue.shift()
      if (!id) break

      const download = this.downloads.get(id)
      if (!download) continue

      this.activeDownloads++
      this.updateDownload(id, { status: 'downloading' })

      try {
        await this.executeDownload(id, download)
      } catch (error) {
        console.error('Download error:', error)
        this.updateDownload(id, { status: 'failed', error: String(error) })
      } finally {
        this.activeDownloads--
        void this.processQueue()
      }
    }
  }

  private async executeDownload(id: string, download: Download): Promise<void> {
    const sanitizedTitle = this.sanitizeFilename(download.title)
    let outputPath: string
    let args: string[]

    if (download.audioOnly) {
      outputPath = path.join(this.downloadPath, `${sanitizedTitle}.${this.audioFormat}`)
      args = [
        download.url,
        '-x',
        '--audio-format',
        this.audioFormat,
        '--audio-quality',
        '0',
        '-o',
        outputPath,
        '--newline',
        '--no-playlist'
      ]
    } else {
      outputPath = path.join(this.downloadPath, `${sanitizedTitle}.%(ext)s`)
      const formatArg = `${download.format}+bestaudio/best`
      args = [
        download.url,
        '-f',
        formatArg,
        '-o',
        outputPath,
        '--newline',
        '--no-playlist',
        '--merge-output-format',
        'mp4'
      ]
    }

    try {
      const ytDlpProcess = this.ytDlp.exec(args) as unknown as ChildProcessWithoutNullStreams
      this.processes.set(id, ytDlpProcess)

      if (ytDlpProcess.stdout) {
        ytDlpProcess.stdout.on('data', (data: Buffer) => {
          this.parseProgress(id, data.toString())
        })
      }

      if (ytDlpProcess.stderr) {
        ytDlpProcess.stderr.on('data', (data: Buffer) => {
          console.error('yt-dlp stderr:', data.toString())
          this.parseProgress(id, data.toString())
        })
      }

      ytDlpProcess.on('exit', (code: number | null) => {
        this.processes.delete(id)

        if (code === 0) {
          try {
            const files = fs.readdirSync(this.downloadPath)
            const downloadedFile = files.find((f) =>
              f.toLowerCase().startsWith(sanitizedTitle.toLowerCase())
            )

            if (downloadedFile) {
              const filePath = path.join(this.downloadPath, downloadedFile)
              const stats = fs.statSync(filePath)
              const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

              this.updateDownload(id, {
                status: 'completed',
                progress: 100,
                filePath,
                size: `${sizeMB} MB`,
                downloaded: `${sizeMB} MB`,
                speed: '0 KB/s',
                eta: '00:00'
              })
            } else {
              this.updateDownload(id, {
                status: 'failed',
                error: 'Downloaded file not found'
              })
            }
          } catch (err) {
            this.updateDownload(id, { status: 'failed', error: String(err) })
          }
        } else if (code !== null) {
          this.updateDownload(id, {
            status: 'failed',
            error: `Download failed with code ${code}`
          })
        }
      })

      ytDlpProcess.on('error', (error: Error) => {
        this.processes.delete(id)
        this.updateDownload(id, {
          status: 'failed',
          error: error.message
        })
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.updateDownload(id, { status: 'failed', error: errorMessage })
    }
  }

  private parseProgress(id: string, output: string): void {
    const progressMatch = output.match(/(\d+\.?\d*)%/)
    const speedMatch = output.match(/([\d.]+\s*[KMG]iB\/s|[\d.]+\s*[KMG]B\/s)/)
    const etaMatch = output.match(/ETA\s+([\d:]+)/)
    const downloadedMatch = output.match(/(\d+\.?\d*\s*(?:KiB|MiB|GiB|KB|MB|GB))(?:\s+of)?/i)

    const updates: Partial<Download> = {}

    if (progressMatch) {
      updates.progress = parseFloat(progressMatch[1])
    }
    if (speedMatch) {
      updates.speed = speedMatch[1]
    }
    if (etaMatch) {
      updates.eta = etaMatch[1]
    }
    if (downloadedMatch) {
      updates.downloaded = downloadedMatch[1]
    }

    if (Object.keys(updates).length > 0) {
      this.updateDownload(id, updates)
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 200)
  }

  cancelDownload(id: string): boolean {
    const process = this.processes.get(id)
    const download = this.downloads.get(id)

    if (process) {
      try {
        process.kill()
      } catch (err) {
        console.error('Failed to kill process', err)
      }
      this.processes.delete(id)
    }

    if (download) {
      const queueIndex = this.downloadQueue.indexOf(id)
      if (queueIndex > -1) {
        this.downloadQueue.splice(queueIndex, 1)
      }

      this.updateDownload(id, { status: 'cancelled' })
      return true
    }

    return false
  }

  async retryDownload(id: string): Promise<string> {
    const download = this.downloads.get(id)
    if (!download) {
      throw new Error('Download not found')
    }

    const { url, format, title, audioOnly } = download
    return await this.startDownload(url, format, title, audioOnly)
  }

  deleteDownload(id: string): boolean {
    this.cancelDownload(id)
    this.downloads.delete(id)
    this.saveDownloads()
    this.notifyRenderer('download-deleted', id)
    return true
  }

  clearCompleted(): void {
    const completed = Array.from(this.downloads.values())
      .filter((d) => d.status === 'completed')
      .map((d) => d.id)

    completed.forEach((id) => this.deleteDownload(id))
  }

  getDownloads(): Download[] {
    try {
      return Array.from(this.downloads.values()).map((download) => ({
        id: String(download.id),
        title: String(download.title),
        url: String(download.url),
        format: String(download.format),
        audioOnly: Boolean(download.audioOnly),
        status: download.status,
        progress: Number(download.progress) || 0,
        speed: String(download.speed),
        eta: String(download.eta),
        size: String(download.size),
        downloaded: String(download.downloaded),
        timestamp: Number(download.timestamp),
        ...(download.filePath && { filePath: String(download.filePath) }),
        ...(download.error && { error: String(download.error) })
      }))
    } catch (error) {
      console.error('Error getting downloads:', error)
      return []
    }
  }

  updateDownloadPath(newPath: string): void {
    this.downloadPath = newPath
    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true })
    }
  }

  updateSettings(settings: Settings): void {
    this.downloadPath = settings.downloadPath
    this.maxConcurrent = settings.maxConcurrent
    this.audioFormat = settings.audioFormat

    if (!fs.existsSync(this.downloadPath)) {
      fs.mkdirSync(this.downloadPath, { recursive: true })
    }
  }

  private updateDownload(id: string, updates: Partial<Download>): void {
    const download = this.downloads.get(id)
    if (download) {
      Object.assign(download, updates)
      this.saveDownloads()

      if (this.window?.webContents && !this.window.webContents.isDestroyed()) {
        this.notifyRenderer('download-update', download)
      }
    }
  }

  private notifyRenderer(channel: string, data: Download | string): void {
    try {
      if (!this.window?.webContents) return

      if (typeof data === 'object' && data !== null && 'id' in data) {
        const cleanDownload: Download = {
          id: String(data.id),
          title: String(data.title),
          url: String(data.url),
          format: String(data.format),
          audioOnly: Boolean(data.audioOnly),
          status: data.status,
          progress: Number(data.progress) || 0,
          speed: String(data.speed),
          eta: String(data.eta),
          size: String(data.size),
          downloaded: String(data.downloaded),
          timestamp: Number(data.timestamp)
        }

        if (data.filePath) {
          cleanDownload.filePath = String(data.filePath)
        }
        if (data.error) {
          cleanDownload.error = String(data.error)
        }

        const serialized = JSON.parse(JSON.stringify(cleanDownload))
        this.window.webContents.send(channel, serialized)
      } else {
        this.window.webContents.send(channel, String(data))
      }
    } catch (err) {
      console.error('Failed to notify renderer:', err)
    }
  }
}

// src/components/DownloaderTab.tsx
import { JSX } from 'react'
import { VideoInfo, DownloadType } from '../types'
import { StatsCards } from './StatsCards'
import { UrlInput } from './UrlInput'
import { VideoInfoCard } from './VideoInfoCard'

interface DownloaderTabProps {
  url: string
  videoInfo: VideoInfo | null
  selectedFormat: string
  downloadType: DownloadType
  isLoading: boolean
  error: string
  activeDownloads: number
  completedDownloads: number
  onUrlChange: (url: string) => void
  onFetchInfo: () => void
  onFormatSelect: (formatId: string) => void
  onTypeChange: (type: DownloadType) => void
  onStartDownload: () => void
}

export const DownloaderTab = ({
  url,
  videoInfo,
  selectedFormat,
  downloadType,
  isLoading,
  error,
  activeDownloads,
  completedDownloads,
  onUrlChange,
  onFetchInfo,
  onFormatSelect,
  onTypeChange,
  onStartDownload
}: DownloaderTabProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <StatsCards activeDownloads={activeDownloads} completedDownloads={completedDownloads} />

      <UrlInput
        url={url}
        isLoading={isLoading}
        error={error}
        onUrlChange={onUrlChange}
        onFetchInfo={onFetchInfo}
      />

      {videoInfo && (
        <VideoInfoCard
          videoInfo={videoInfo}
          selectedFormat={selectedFormat}
          downloadType={downloadType}
          onFormatSelect={onFormatSelect}
          onTypeChange={onTypeChange}
          onStartDownload={onStartDownload}
        />
      )}
    </div>
  )
}

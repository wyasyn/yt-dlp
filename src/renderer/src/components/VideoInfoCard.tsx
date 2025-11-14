// src/components/VideoInfoCard.tsx
import { Download, Play } from 'lucide-react'
import { VideoInfo, DownloadType } from '../types'
import { formatDuration } from '../utils/helpers'
import { DownloadTypeToggle } from './DownloadTypeToggle'
import { FormatSelector } from './FormatSelector'
import { JSX } from 'react'

interface VideoInfoCardProps {
  videoInfo: VideoInfo
  selectedFormat: string
  downloadType: DownloadType
  onFormatSelect: (formatId: string) => void
  onTypeChange: (type: DownloadType) => void
  onStartDownload: () => void
}

export const VideoInfoCard = ({
  videoInfo,
  selectedFormat,
  downloadType,
  onFormatSelect,
  onTypeChange,
  onStartDownload
}: VideoInfoCardProps): JSX.Element => {
  const formats = downloadType === 'video' ? videoInfo.formats : videoInfo.audioFormats

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex gap-4 mb-6">
        {videoInfo.thumbnail && (
          <img
            src={videoInfo.thumbnail}
            alt="Thumbnail"
            className="w-40 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            {videoInfo.title}
          </h3>
          <p className="text-sm text-slate-400">Duration: {formatDuration(videoInfo.duration)}</p>
        </div>
      </div>

      <DownloadTypeToggle downloadType={downloadType} onTypeChange={onTypeChange} />

      <FormatSelector
        formats={formats}
        selectedFormat={selectedFormat}
        downloadType={downloadType}
        onFormatSelect={onFormatSelect}
      />

      <button
        onClick={onStartDownload}
        disabled={!selectedFormat}
        className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        Start Download
      </button>
    </div>
  )
}

// src/components/DownloadTypeToggle.tsx
import { Music, Video } from 'lucide-react'
import { DownloadType } from '../types'
import { JSX } from 'react'

interface DownloadTypeToggleProps {
  downloadType: DownloadType
  onTypeChange: (type: DownloadType) => void
}

export const DownloadTypeToggle = ({
  downloadType,
  onTypeChange
}: DownloadTypeToggleProps): JSX.Element => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">Download Type</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onTypeChange('video')}
          className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
            downloadType === 'video'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-900 hover:border-slate-600'
          }`}
        >
          <Video className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Video</div>
            <div className="text-xs text-slate-400">Video + Audio</div>
          </div>
        </button>
        <button
          onClick={() => onTypeChange('audio')}
          className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
            downloadType === 'audio'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-900 hover:border-slate-600'
          }`}
        >
          <Music className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Audio Only</div>
            <div className="text-xs text-slate-400">MP3 Format</div>
          </div>
        </button>
      </div>
    </div>
  )
}

// src/components/FormatSelector.tsx
import { JSX } from 'react'
import { VideoFormat, DownloadType } from '../types'

interface FormatSelectorProps {
  formats: VideoFormat[]
  selectedFormat: string
  downloadType: DownloadType
  onFormatSelect: (formatId: string) => void
}

export const FormatSelector = ({
  formats,
  selectedFormat,
  downloadType,
  onFormatSelect
}: FormatSelectorProps): JSX.Element => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        {downloadType === 'video' ? 'Select Video Quality' : 'Select Audio Quality'}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {formats.map((format) => (
          <button
            key={format.id}
            onClick={() => onFormatSelect(format.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedFormat === format.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-900 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">{format.resolution}</span>
              <span className="text-sm text-slate-400">{format.size}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{format.ext.toUpperCase()}</span>
              {downloadType === 'video' && (
                <>
                  <span>•</span>
                  <span>{format.hasAudio ? '🔊 Audio' : '🔇 No Audio'}</span>
                </>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

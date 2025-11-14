// src/components/DownloadItem.tsx
import { X, RotateCcw, Trash2, FolderOpen } from 'lucide-react'
import { Download } from '../types'
import { getStatusColor, getStatusIcon } from '../utils/helpers'
import { JSX } from 'react'

interface DownloadItemProps {
  download: Download
  onCancel: (id: string) => void
  onRetry: (download: Download) => void
  onDelete: (id: string) => void
  onOpenLocation: (filePath: string) => void
}

export const DownloadItem = ({
  download,
  onCancel,
  onRetry,
  onDelete,
  onOpenLocation
}: DownloadItemProps): JSX.Element => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">{download.title}</h4>
            {download.audioOnly && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                Audio
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-3 flex-wrap">
            <span className={`flex items-center gap-1 ${getStatusColor(download.status)}`}>
              {getStatusIcon(download.status)}
              {download.status.charAt(0).toUpperCase() + download.status.slice(1)}
            </span>
            <span>•</span>
            <span>{download.format}</span>
            {download.status === 'downloading' && (
              <>
                <span>•</span>
                <span>{download.speed}</span>
                <span>•</span>
                <span>ETA: {download.eta}</span>
              </>
            )}
          </div>

          {(download.status === 'downloading' || download.status === 'queued') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {download.downloaded} / {download.size}
                </span>
                <span className="font-medium">{Math.round(download.progress)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${download.progress}%` }}
                />
              </div>
            </div>
          )}

          {download.status === 'completed' && download.filePath && (
            <button
              onClick={() => onOpenLocation(download.filePath!)}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Show in folder
            </button>
          )}

          {download.status === 'failed' && download.error && (
            <div className="text-sm text-red-400 mt-2">Error: {download.error}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(download.status === 'downloading' || download.status === 'queued') && (
            <button
              onClick={() => onCancel(download.id)}
              className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {download.status === 'failed' && (
            <button
              onClick={() => onRetry(download)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
              title="Retry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(download.id)}
            className="p-2 bg-red-600/20 hover:bg-red-600 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

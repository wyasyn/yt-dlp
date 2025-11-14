// src/components/HistoryTab.tsx
import { Clock } from 'lucide-react'
import { Download } from '../types'
import { DownloadItem } from './DownloadItem'
import { JSX } from 'react'

interface HistoryTabProps {
  downloads: Download[]
  completedCount: number
  onClearCompleted: () => void
  onCancelDownload: (id: string) => void
  onRetryDownload: (download: Download) => void
  onDeleteDownload: (id: string) => void
  onOpenFileLocation: (filePath: string) => void
}

export const HistoryTab = ({
  downloads,
  completedCount,
  onClearCompleted,
  onCancelDownload,
  onRetryDownload,
  onDeleteDownload,
  onOpenFileLocation
}: HistoryTabProps): JSX.Element => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Download History</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">
            {downloads.length} {downloads.length === 1 ? 'item' : 'items'}
          </div>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-all"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {downloads.length === 0 ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
          <p className="text-slate-400">Your download history will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map((download) => (
            <DownloadItem
              key={download.id}
              download={download}
              onCancel={onCancelDownload}
              onRetry={onRetryDownload}
              onDelete={onDeleteDownload}
              onOpenLocation={onOpenFileLocation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

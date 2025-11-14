// src/utils/helpers.ts
import { DownloadStatus } from '../types'
import { Clock, Download, CheckCircle, AlertCircle, X } from 'lucide-react'
import { JSX } from 'react'

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

export const getStatusColor = (status: DownloadStatus): string => {
  switch (status) {
    case 'queued':
      return 'text-yellow-400'
    case 'downloading':
      return 'text-blue-400'
    case 'completed':
      return 'text-green-400'
    case 'failed':
      return 'text-red-400'
    case 'cancelled':
      return 'text-gray-400'
    default:
      return 'text-gray-400'
  }
}

export const getStatusIcon = (status: DownloadStatus): JSX.Element => {
  switch (status) {
    case 'queued':
      return <Clock className="w-4 h-4" />
    case 'downloading':
      return <Download className="w-4 h-4" />
    case 'completed':
      return <CheckCircle className="w-4 h-4" />
    case 'failed':
      return <AlertCircle className="w-4 h-4" />
    case 'cancelled':
      return <X className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

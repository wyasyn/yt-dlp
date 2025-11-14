// src/components/StatsCards.tsx

import { JSX } from 'react'

interface StatsCardsProps {
  activeDownloads: number
  completedDownloads: number
}

export const StatsCards = ({
  activeDownloads,
  completedDownloads
}: StatsCardsProps): JSX.Element => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="text-sm text-blue-400 mb-1">Active Downloads</div>
        <div className="text-2xl font-bold">{activeDownloads}</div>
      </div>
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="text-sm text-green-400 mb-1">Completed</div>
        <div className="text-2xl font-bold">{completedDownloads}</div>
      </div>
    </div>
  )
}

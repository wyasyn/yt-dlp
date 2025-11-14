// src/components/Header.tsx
import { Download, Settings } from 'lucide-react'
import { TabType } from '../types'
import { JSX } from 'react'

interface HeaderProps {
  activeTab: TabType
  downloadCount: number
  onTabChange: (tab: TabType) => void
}

export const Header = ({ activeTab, downloadCount, onTabChange }: HeaderProps): JSX.Element => {
  return (
    <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">YouTube Downloader</h1>
              <p className="text-sm text-slate-400">Download videos & audio in any quality</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onTabChange('downloader')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'downloader'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Downloader
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              History
              {downloadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {downloadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onTabChange('settings')}
              title="Settings"
              aria-label="Settings"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/SettingsTab.tsx
import { FolderOpen } from 'lucide-react'
import { AppSettings } from '../types'
import { JSX } from 'react'

interface SettingsTabProps {
  settings: AppSettings
  onSettingsChange: (settings: AppSettings | ((prev: AppSettings) => AppSettings)) => void
  onSelectDownloadPath: () => void
  onSaveSettings: () => void
}

export const SettingsTab = ({
  settings,
  onSettingsChange,
  onSelectDownloadPath,
  onSaveSettings
}: SettingsTabProps): JSX.Element => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="space-y-6">
          {/* Download Path */}
          <div>
            <label htmlFor="downloadPath" className="block text-sm font-medium mb-2">
              Download Location
            </label>
            <div className="flex gap-3">
              <input
                id="downloadPath"
                type="text"
                value={settings.downloadPath}
                readOnly
                placeholder="No folder selected"
                title="Download location"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-400"
              />
              <button
                onClick={onSelectDownloadPath}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Browse
              </button>
            </div>
          </div>

          {/* Max Concurrent Downloads */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Concurrent Downloads: {settings.maxConcurrent}
            </label>
            <input
              title="range"
              type="range"
              min="1"
              max="5"
              value={settings.maxConcurrent}
              onChange={(e) =>
                onSettingsChange((prev) => ({
                  ...prev,
                  maxConcurrent: parseInt(e.target.value)
                }))
              }
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          {/* Audio Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Audio Format</label>
            <div className="grid grid-cols-3 gap-3">
              {(['mp3', 'm4a', 'wav'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() =>
                    onSettingsChange((prev) => ({
                      ...prev,
                      audioFormat: format
                    }))
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.audioFormat === format
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onSaveSettings}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <h3 className="font-semibold mb-4">About</h3>
        <div className="space-y-2 text-sm text-slate-400">
          <p>YouTube Downloader v1.0.0</p>
          <p>Built with Electron, React, and TypeScript</p>
          <p className="text-xs mt-4 text-slate-500">
            This tool is for personal use only. Please respect YouTube&apos;s Terms of Service and
            copyright laws.
          </p>
        </div>
      </div>
    </div>
  )
}

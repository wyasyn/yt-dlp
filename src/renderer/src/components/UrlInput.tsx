// src/components/UrlInput.tsx
import { Download } from 'lucide-react'
import { JSX } from 'react'

interface UrlInputProps {
  url: string
  isLoading: boolean
  error: string
  onUrlChange: (url: string) => void
  onFetchInfo: () => void
}

export const UrlInput = ({
  url,
  isLoading,
  error,
  onUrlChange,
  onFetchInfo
}: UrlInputProps): JSX.Element => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onFetchInfo()
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <label className="block text-sm font-medium mb-3">Video URL</label>
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={onFetchInfo}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Fetch Info
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

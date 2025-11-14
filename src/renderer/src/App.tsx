// src/renderer/src/App.tsx
import { JSX, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { Header } from './components/Header'
import { DownloaderTab } from './components/DownloaderTab'
import { HistoryTab } from './components/HistoryTab'
import { SettingsTab } from './components/SettingsTab'

export default function App(): JSX.Element {
  const {
    // State
    url,
    videoInfo,
    selectedFormat,
    downloadType,
    downloads,
    activeTab,
    isLoading,
    error,
    settings,
    activeDownloads,
    completedDownloads,

    // Actions
    setUrl,
    setActiveTab,
    setSelectedFormat,
    setDownloadType,
    setSettings,
    updateDownload,
    removeDownload,
    loadDownloads,
    loadSettings,
    fetchVideoInfo,
    startDownload,
    retryDownload,
    deleteDownload,
    clearCompleted,
    openFileLocation,
    selectDownloadPath,
    saveSettings
  } = useAppStore()

  // Initialize app data
  useEffect(() => {
    loadDownloads()
    loadSettings()
  }, [loadDownloads, loadSettings])

  // Setup download listeners
  useEffect(() => {
    const removeUpdate = window.electron.onDownloadUpdate(updateDownload)
    const removeDeleted = window.electron.onDownloadDeleted(removeDownload)

    return () => {
      removeUpdate()
      removeDeleted()
    }
  }, [updateDownload, removeDownload])

  // Cancel download handler
  const handleCancelDownload = async (id: string): Promise<void> => {
    await window.electron.cancelDownload(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header activeTab={activeTab} downloadCount={downloads.length} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'downloader' && (
          <DownloaderTab
            url={url}
            videoInfo={videoInfo}
            selectedFormat={selectedFormat}
            downloadType={downloadType}
            isLoading={isLoading}
            error={error}
            activeDownloads={activeDownloads}
            completedDownloads={completedDownloads}
            onUrlChange={setUrl}
            onFetchInfo={fetchVideoInfo}
            onFormatSelect={setSelectedFormat}
            onTypeChange={setDownloadType}
            onStartDownload={startDownload}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab
            downloads={downloads}
            completedCount={completedDownloads}
            onClearCompleted={clearCompleted}
            onCancelDownload={handleCancelDownload}
            onRetryDownload={retryDownload}
            onDeleteDownload={deleteDownload}
            onOpenFileLocation={openFileLocation}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onSettingsChange={setSettings}
            onSelectDownloadPath={selectDownloadPath}
            onSaveSettings={saveSettings}
          />
        )}
      </div>
    </div>
  )
}

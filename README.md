# 🎬 YouTube Downloader

<div align="center">

**A modern, feature-rich desktop application for downloading YouTube videos**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🎯 Core Features

- **Multiple Quality Options** - Download videos in any available quality from 360p to 4K
- **Audio-Only Downloads** - Extract audio in MP3, M4A, or WAV format
- **Audio Selection** - Choose formats with or without audio
- **Real-time Progress** - Live download progress with speed and ETA
- **Download Management** - Cancel downloads and retry failed ones
- **Download History** - Complete history with persistent storage
- **Download Queue** - Smart queue system with concurrent download limits

### 🚀 Advanced Features

- **Persistent Storage** - All downloads saved across app restarts
- **Settings Page** - Customize download location, concurrent downloads, and audio format
- **Batch Information** - Fetch video information including title, duration, and thumbnail
- **File Management** - Quick access to downloaded files
- **Error Handling** - Retry failed downloads with one click
- **Cross-platform** - Works on Windows, macOS, and Linux
- **URL Validation** - Validates YouTube URLs before processing

### 💎 User Experience

- **Modern UI** - Beautiful gradient design with smooth animations
- **Dark Mode** - Eye-friendly dark theme
- **Responsive Layout** - Adapts to different window sizes
- **Intuitive Controls** - Simple and easy-to-use interface
- **Live Statistics** - See active and completed downloads at a glance

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Tailwind CSS v3** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Backend

- **Electron** - Cross-platform desktop framework
- **yt-dlp-wrap** - YouTube download engine
- **electron-store** - Persistent data storage
- **Node.js** - JavaScript runtime

### Build Tools

- **Vite** - Lightning-fast build tool
- **electron-builder** - Package and build for all platforms

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Clone the Repository

```bash
git clone https://github.com/yourusername/youtube-downloader.git
cd youtube-downloader
```

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run electron:dev
```

This will start both the Vite dev server and Electron in development mode with hot reload.

---

## 🎯 Usage

### Download a Video

1. **Enter URL** - Paste a YouTube video URL in the input field
2. **Fetch Info** - Click "Fetch Info" to load video details
3. **Choose Type** - Select Video or Audio Only
4. **Select Quality** - Choose your preferred video quality or audio bitrate
5. **Start Download** - Click "Start Download" to begin

### Manage Downloads

- **Cancel** - Click the X button to cancel active downloads
- **Retry** - Click the retry button on failed downloads
- **Delete** - Remove download entries from history
- **Open Folder** - Click "Show in folder" to locate downloaded files
- **Clear Completed** - Remove all completed downloads from history

### Configure Settings

1. **Download Location** - Browse and select where files should be saved
2. **Concurrent Downloads** - Set how many downloads can run simultaneously (1-5)
3. **Audio Format** - Choose MP3, M4A, or WAV for audio-only downloads

---

## 🏗️ Building

### Build for Current Platform

```bash
npm run build
```

### Build for Specific Platforms

#### Windows

```bash
npm run build:win
```

Creates:

- `youtube-downloader-setup-1.0.0.exe` (installer)
- `youtube-downloader-1.0.0-portable.exe` (portable)

#### macOS

```bash
npm run build:mac
```

Creates:

- `youtube-downloader-1.0.0.dmg` (installer)
- `youtube-downloader-1.0.0-mac.zip` (archive)

#### Linux

```bash
npm run build:linux
```

Creates:

- `youtube-downloader-1.0.0.AppImage` (portable)
- `youtube-downloader-1.0.0.deb` (Debian/Ubuntu)
- `youtube-downloader-1.0.0.rpm` (Fedora/RHEL)

### Build for All Platforms

```bash
npm run build:all
```

**Note:** Building for macOS requires a Mac, and building for Linux is best done on a Linux machine.

---

## 📁 Project Structure

```
youtube-downloader/
├── src/
│   ├── main/                  # Electron main process
│   │   ├── main.ts           # Main entry point
│   │   ├── preload.ts        # Preload script for IPC
│   │   └── download-manager.ts # Download logic
│   ├── renderer/              # React frontend
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # React entry point
│   │   ├── index.html        # HTML template
│   │   └── index.css         # Global styles
├── public/                    # Static assets
│   └── icon.png
├── dist-electron/             # Built electron files
├── release/                   # Distribution packages
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── electron-builder.json
```

---

## 🔧 Configuration

### Download Location

Default: `~/Downloads/YouTube`

Can be changed in Settings or modified in `src/main/download-manager.ts`:

```typescript
getDefaultDownloadPath(): string {
  return path.join(os.homedir(), 'Downloads', 'YouTube');
}
```

### App Icon

Replace `public/icon.png` with your custom icon (recommended size: 512x512px).

### Build Settings

Modify `electron-builder.json` to customize:

- App ID and name
- Target platforms
- Installer settings
- File associations

---

## ✅ What's Fixed

### Critical Fixes

✅ **Fixed Tailwind CSS** - Now using v3 instead of non-existent v4
✅ **Added Persistent Storage** - Downloads saved with electron-store
✅ **Removed Pause/Resume** - Replaced with proper Cancel/Retry functionality
✅ **Fixed Download Manager** - Improved error handling and process management
✅ **URL Validation** - Validates YouTube URLs before processing
✅ **Better Progress Parsing** - More robust progress tracking

### New Features

✅ **Audio-Only Downloads** - MP3, M4A, WAV support
✅ **Settings Page** - Configure download location and preferences
✅ **Download Queue** - Concurrent download management
✅ **Clear Completed** - Bulk removal of completed downloads
✅ **Download Statistics** - Live stats for active and completed downloads
✅ **Audio/Video Toggle** - Easy switching between download types
✅ **Retry Mechanism** - One-click retry for failed downloads

### Improvements

✅ **Better Error Messages** - User-friendly error reporting
✅ **File Size Tracking** - Shows downloaded size vs total size
✅ **Queue Status** - Visual indication of queued downloads
✅ **Settings Persistence** - All settings saved across restarts
✅ **Clean Cancellation** - Proper process cleanup on cancel
✅ **Sanitized Filenames** - Safe filename generation

---

## 🐛 Troubleshooting

### yt-dlp not working

The app automatically downloads yt-dlp on first run. If issues persist:

```bash
npm install yt-dlp-wrap --save
```

### Build fails

Clear cache and rebuild:

```bash
rm -rf node_modules dist-electron release
npm install
npm run build
```

### Videos won't download

- Check your internet connection
- Verify the YouTube URL is valid
- Ensure you have write permissions to the download folder
- Try updating yt-dlp (delete and let app re-download)

### Downloads not persisting

- Check if electron-store is properly installed
- Verify app has write access to config directory

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is for personal use only. Please respect YouTube's Terms of Service and copyright laws. Only download videos you have permission to download.

---

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - The powerful download engine
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [electron-store](https://github.com/sindresorhus/electron-store) - Persistent storage

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with ❤️

</div>

# 🎵 Lyrics Sync Manual

A powerful React-based web application for manually synchronizing lyrics with audio files. Create perfectly timed LRC (Lyrics with Rich Content) files with an intuitive interface and real-time preview.

![Lyrics Sync Manual](https://img.shields.io/badge/React-18.2.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Active-brightgreen)

## ✨ Features

### 🎧 Audio Management
- **Audio Upload**: Support for various audio formats (MP3, WAV, M4A, etc.)
- **Real-time Playback**: Smooth audio playback with precise time controls
- **Playback Controls**: Play, pause, seek, volume control, and speed adjustment
- **Waveform Visualization**: Visual representation of audio for better synchronization

### 📝 Lyrics Synchronization
- **Manual Sync Editor**: Intuitive interface for precise timestamp editing
- **Real-time Preview**: See your synchronized lyrics while editing
- **Keyboard Shortcuts**: Efficient workflow with keyboard controls
- **Line-by-line Editing**: Fine-tune timing for each lyric line

### 🎨 User Experience
- **Dark/Light Theme**: Choose your preferred theme
- **Karaoke Mode**: Highlight lyrics as they play
- **Auto-scroll**: Automatic scrolling to current lyrics
- **Responsive Design**: Works on desktop and mobile devices

### 💾 Project Management
- **Save/Load Projects**: Persistent storage of your work
- **Undo/Redo**: Full history management
- **Export LRC**: Generate standard LRC files for use in other applications
- **Import/Export**: Share and backup your synchronized lyrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manan-Khanna05/Lyrics-Sync-Manual.git
   cd Lyrics-Sync-Manual
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 How to Use

### 1. Upload Audio
- Click "Upload Audio" and select your audio file
- The app supports MP3, WAV, M4A, and other common formats

### 2. Input Lyrics
- Paste or type your lyrics in the text area
- Each line will become a synchronized lyric entry

### 3. Synchronize
- Use the sync editor to add timestamps to each line
- Play the audio and click on lyrics at the right moments
- Fine-tune timings using the keyboard shortcuts

### 4. Preview & Export
- Switch to play mode to preview your synchronized lyrics
- Export as LRC file for use in other applications

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause |
| `←` | Previous line |
| `→` | Next line |
| `↑` | Increase timestamp |
| `↓` | Decrease timestamp |
| `Enter` | Sync current line |

## 🔧 Technical Details

### Architecture
- **Frontend**: React 18 with functional components and hooks
- **State Management**: React useReducer for complex state
- **Audio Handling**: Web Audio API with proper error handling
- **Storage**: LocalStorage for project persistence

### Key Components
- `Player.jsx`: Main audio player with controls
- `SyncEditor.jsx`: Lyrics synchronization interface
- `LyricsDisplay.jsx`: Real-time lyrics display
- `useAudio.js`: Custom hook for audio management

### Recent Fixes
- ✅ Fixed AbortError in audio playback
- ✅ Improved async audio handling
- ✅ Added proper error handling for interrupted play requests
- ✅ Implemented debounce mechanism for rapid clicking

## 📁 Project Structure

```
src/
├── components/
│   ├── AudioUpload.jsx      # Audio file upload component
│   ├── Controls.jsx         # Playback controls
│   ├── LyricsDisplay.jsx    # Real-time lyrics display
│   ├── LyricsInput.jsx      # Lyrics text input
│   ├── Player.jsx          # Main player component
│   ├── SyncEditor.jsx      # Synchronization editor
│   └── Waveform.jsx        # Audio waveform visualization
├── hooks/
│   ├── useAudio.js         # Audio management hook
│   └── useKeyboard.js      # Keyboard shortcuts hook
├── utils/
│   ├── algorithms.js       # Utility algorithms
│   ├── lrcParser.js        # LRC file parsing/generation
│   └── storage.js          # LocalStorage utilities
└── App.jsx                 # Main application component
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Web Audio API for audio handling capabilities
- Open source community for inspiration and tools

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the existing issues for solutions
- Review the documentation

---

**Made with ❤️ by [Manan Khanna](https://github.com/Manan-Khanna05)**

*Happy lyrics syncing! 🎵*

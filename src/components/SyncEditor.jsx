import React, { useState, useRef, useEffect } from 'react';
import useKeyboard from '../hooks/useKeyboard';
import Waveform from './Waveform';

function SyncEditor({ audioURL, lyrics, syncedLyrics, onSyncUpdate, onComplete, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(syncedLyrics.length);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTime, setEditTime] = useState('');
  
  const audioRef = useRef(null);
  const lyricsArray = lyrics.split('\n').filter(l => l.trim());

  useEffect(() => {
    if (audioURL && audioRef.current) {
      audioRef.current.src = audioURL;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [audioURL, playbackRate]);

  const handleTimestamp = () => {
    if (currentIndex >= lyricsArray.length) return;

    const currentTime = audioRef.current.currentTime;
    const newSynced = [...syncedLyrics];
    
    newSynced[currentIndex] = {
      text: lyricsArray[currentIndex],
      startTime: currentTime,
      endTime: null,
      id: currentIndex
    };

    if (currentIndex > 0 && newSynced[currentIndex - 1]) {
      newSynced[currentIndex - 1].endTime = currentTime;
    }

    onSyncUpdate(newSynced);
    setCurrentIndex(currentIndex + 1);
  };

  const undoLastTimestamp = () => {
    if (currentIndex > 0) {
      const newSynced = syncedLyrics.slice(0, -1);
      onSyncUpdate(newSynced);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekRelative = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + seconds);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditTime(syncedLyrics[index].startTime.toFixed(2));
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newSynced = [...syncedLyrics];
      const newTime = parseFloat(editTime);
      
      if (!isNaN(newTime) && newTime >= 0) {
        newSynced[editingIndex].startTime = newTime;
        
        if (editingIndex > 0) {
          newSynced[editingIndex - 1].endTime = newTime;
        }
        if (editingIndex < newSynced.length - 1) {
          newSynced[editingIndex].endTime = newSynced[editingIndex + 1].startTime;
        }
        
        onSyncUpdate(newSynced);
      }
      
      setEditingIndex(null);
      setEditTime('');
    }
  };

  const deleteLine = (index) => {
    if (window.confirm('Delete this synced line?')) {
      const newSynced = syncedLyrics.filter((_, i) => i !== index);
      onSyncUpdate(newSynced);
      if (currentIndex > index) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  useKeyboard({
    ' ': handleTimestamp,
    'Enter': handleTimestamp,
    'Backspace': undoLastTimestamp,
    'ArrowLeft': () => seekRelative(-5),
    'ArrowRight': () => seekRelative(5),
    'p': togglePlayPause
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const progress = (syncedLyrics.length / lyricsArray.length) * 100;

  return (
    <div className="sync-editor">
      <div className="sync-header">
        <h2>Sync Lyrics to Audio</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">
            {syncedLyrics.length} / {lyricsArray.length} lines synced
          </span>
        </div>
      </div>

      <div className="audio-controls">
        <audio 
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        <div className="control-buttons">
          <button onClick={() => seekRelative(-5)}>⏪ -5s</button>
          <button onClick={togglePlayPause} className="play-pause-btn">
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button onClick={() => seekRelative(5)}>⏩ +5s</button>
        </div>

        <div className="playback-speed">
          <label>Speed: {playbackRate}x</label>
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <Waveform audioURL={audioURL} audioRef={audioRef} />

      <div className="sync-instructions">
        <h3>⌨️ Keyboard Shortcuts:</h3>
        <p><kbd>SPACE</kbd> or <kbd>ENTER</kbd> - Mark timestamp | <kbd>BACKSPACE</kbd> - Undo last | 
        <kbd>P</kbd> - Play/Pause | <kbd>←</kbd> -5s | <kbd>→</kbd> +5s</p>
      </div>

      <div className="current-line-display">
        <h3>Current Line to Sync:</h3>
        <div className="current-line">
          {currentIndex < lyricsArray.length ? (
            <p className="highlight-text">{lyricsArray[currentIndex]}</p>
          ) : (
            <p className="complete-text">✅ All lines synced!</p>
          )}
        </div>
        {currentIndex < lyricsArray.length && (
          <button onClick={handleTimestamp} className="btn-primary btn-large">
            🎯 Mark Current Time
          </button>
        )}
      </div>

      <div className="synced-lyrics-list">
        <h3>Synced Lines:</h3>
        <div className="synced-list">
          {syncedLyrics.map((line, index) => (
            <div key={index} className="synced-line-item">
              {editingIndex === index ? (
                <div className="edit-mode">
                  <input 
                    type="number" 
                    step="0.01"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    autoFocus
                  />
                  <button onClick={saveEdit} className="btn-success">✓</button>
                  <button onClick={() => setEditingIndex(null)} className="btn-danger">✗</button>
                </div>
              ) : (
                <>
                  <span className="time-badge">{formatTime(line.startTime)}</span>
                  <span className="lyric-text">{line.text}</span>
                  <div className="line-actions">
                    <button onClick={() => startEdit(index)} className="btn-icon">✏️</button>
                    <button onClick={() => deleteLine(index)} className="btn-icon">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sync-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Lyrics
        </button>
        <button onClick={undoLastTimestamp} disabled={syncedLyrics.length === 0} className="btn-secondary">
          ↶ Undo Last
        </button>
        <button 
          onClick={onComplete} 
          disabled={syncedLyrics.length === 0}
          className="btn-primary"
        >
          Complete & Play →
        </button>
      </div>
    </div>
  );
}

export default SyncEditor;
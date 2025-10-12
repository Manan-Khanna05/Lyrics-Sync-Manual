import React, { useState, useRef, useEffect } from 'react';
import LyricsDisplay from './LyricsDisplay';
import Controls from './Controls';
import { generateLRC } from '../utils/lrcParser';

function Player({ audioURL, syncedLyrics, settings, onSettingsChange, onEdit }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [isToggling, setIsToggling] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioURL && audioRef.current) {
      audioRef.current.src = audioURL;
      audioRef.current.playbackRate = settings.playbackSpeed;
      audioRef.current.volume = volume;
    }
  }, [audioURL, settings.playbackSpeed, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = async () => {
    if (audioRef.current && !isToggling) {
      setIsToggling(true);
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          // Wait for any pending play() calls to complete
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        // Handle AbortError and other play() errors gracefully
        if (error.name === 'AbortError') {
          console.log('Play request was interrupted');
        } else {
          console.error('Audio playback error:', error);
        }
        // Ensure state is consistent
        setIsPlaying(false);
      } finally {
        setIsToggling(false);
      }
    }
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleExportLRC = () => {
    const lrcContent = generateLRC(syncedLyrics, {
      title: 'Synced Lyrics',
      artist: 'Unknown',
      album: 'Unknown',
      creator: 'Lyrics Sync Studio'
    });

    const blob = new Blob([lrcContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyrics.lrc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="player-container">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
        }}
        />

        <div className="player-header">
          <h2>🎵 Now Playing</h2>
          <div className="player-actions">
            <button onClick={onEdit} className="btn-secondary">
              ✏️ Edit Sync
            </button>
            <button onClick={handleExportLRC} className="btn-primary">
              💾 Export LRC
            </button>
          </div>
        </div>
  
        <LyricsDisplay 
          syncedLyrics={syncedLyrics}
          currentTime={currentTime}
          settings={settings}
          onSeek={handleSeek}
        />
  
        <Controls 
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          playbackSpeed={settings.playbackSpeed}
          onPlayPause={togglePlayPause}
          onSeek={handleSeek}
          onVolumeChange={setVolume}
          onSpeedChange={(speed) => onSettingsChange({ playbackSpeed: speed })}
        />
  
        <div className="player-settings">
          <label>
            <input 
              type="checkbox" 
              checked={settings.autoScroll}
              onChange={(e) => onSettingsChange({ autoScroll: e.target.checked })}
            />
            Auto-scroll lyrics
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={settings.karaoke}
              onChange={(e) => onSettingsChange({ karaoke: e.target.checked })}
            />
            Karaoke mode
          </label>
          <label>
            Theme:
            <select 
              value={settings.theme}
              onChange={(e) => onSettingsChange({ theme: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
      </div>
    );
  }
  
  export default Player;
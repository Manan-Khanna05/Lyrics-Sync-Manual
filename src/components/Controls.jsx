import React from 'react';

function Controls({ 
  isPlaying, 
  currentTime, 
  duration, 
  volume, 
  playbackSpeed,
  onPlayPause, 
  onSeek, 
  onVolumeChange,
  onSpeedChange 
}) {

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onSeek(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="controls-container">
      <div className="progress-container" onClick={handleProgressClick}>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="playback-controls">
        <button 
          onClick={() => onSeek(Math.max(0, currentTime - 10))}
          className="control-btn"
        >
          ⏪
        </button>

        <button 
          onClick={onPlayPause}
          className="control-btn play-btn"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <button 
          onClick={() => onSeek(Math.min(duration, currentTime + 10))}
          className="control-btn"
        >
          ⏩
        </button>
      </div>

      <div className="additional-controls">
        <div className="volume-control">
          <span>🔊</span>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="slider"
          />
          <span>{Math.round(volume * 100)}%</span>
        </div>

        <div className="speed-control">
          <span>⚡</span>
          <select 
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="speed-select"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Controls;
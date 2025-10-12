import React, { useEffect, useRef } from 'react';
import { getCurrentLyricIndex } from '../utils/algorithms';

function LyricsDisplay({ syncedLyrics, currentTime, settings, onSeek }) {
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const lyricsRef = useRef(null);

  useEffect(() => {
    const index = getCurrentLyricIndex(syncedLyrics, currentTime);
    setCurrentIndex(index);
  }, [syncedLyrics, currentTime]);

  useEffect(() => {
    if (settings.autoScroll && lyricsRef.current && currentIndex >= 0) {
      const activeElement = lyricsRef.current.querySelector('.lyric-line.active');
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentIndex, settings.autoScroll]);

  const handleLineClick = (index) => {
    if (syncedLyrics[index] && onSeek) {
      onSeek(syncedLyrics[index].startTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!syncedLyrics || syncedLyrics.length === 0) {
    return (
      <div className="lyrics-display">
        <div className="no-lyrics">
          <h3>No synced lyrics available</h3>
          <p>Please sync your lyrics first to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lyrics-display" ref={lyricsRef}>
      <div className="lyrics-list">
        {syncedLyrics.map((lyric, index) => {
          let className = 'lyric-line';
          
          if (index < currentIndex) {
            className += ' past';
          } else if (index === currentIndex) {
            className += ' active';
          } else {
            className += ' future';
          }

          if (settings.karaoke && index === currentIndex) {
            className += ' karaoke';
          }

          return (
            <div
              key={lyric.id || index}
              className={className}
              onClick={() => handleLineClick(index)}
            >
              <span className="line-number">{index + 1}</span>
              <span className="line-text">{lyric.text}</span>
              {settings.karaoke && index === currentIndex && (
                <div className="karaoke-fill" style={{ width: '0%' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LyricsDisplay;
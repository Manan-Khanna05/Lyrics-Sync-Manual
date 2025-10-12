import React, { useState } from 'react';

function AudioUpload({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const [audioInfo, setAudioInfo] = useState(null);
  const [error, setError] = useState('');

  const validateAudioFile = (file) => {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
    const maxSize = 50 * 1024 * 1024;

    if (!file.type.startsWith('audio/') && !validTypes.includes(file.type)) {
      setError('Please upload a valid audio file (MP3, WAV, OGG, M4A)');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size should be less than 50MB');
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = (file) => {
    if (validateAudioFile(file)) {
      const url = URL.createObjectURL(file);
      
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        setAudioInfo({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          duration: formatDuration(audio.duration),
          type: file.type
        });
      });

      onUpload(file, url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="upload-container">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="audio-input"
          accept="audio/*" 
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="audio-input" className="upload-label">
          <div className="upload-icon">🎵</div>
          <h2>Upload Audio File</h2>
          <p>Drag & drop or click to browse</p>
          <p className="supported">Supported: MP3, WAV, OGG, M4A (Max 50MB)</p>
        </label>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {audioInfo && (
        <div className="audio-info">
          <h3>✅ File Loaded Successfully</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {audioInfo.name}
            </div>
            <div className="info-item">
              <strong>Size:</strong> {audioInfo.size}
            </div>
            <div className="info-item">
              <strong>Duration:</strong> {audioInfo.duration}
            </div>
            <div className="info-item">
              <strong>Type:</strong> {audioInfo.type}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioUpload;
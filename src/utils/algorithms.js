// Get current lyric index based on current time (Binary Search - Optimized)
export function getCurrentLyricIndex(syncedLyrics, currentTime) {
    if (!syncedLyrics || syncedLyrics.length === 0) return -1;
  
    let left = 0;
    let right = syncedLyrics.length - 1;
    let result = -1;
  
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (syncedLyrics[mid].startTime <= currentTime) {
        result = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  
    return result;
  }
  
  // Adjust all timestamps by offset (seconds)
  export function adjustTimestamps(syncedLyrics, offsetSeconds) {
    return syncedLyrics.map(lyric => ({
      ...lyric,
      startTime: Math.max(0, lyric.startTime + offsetSeconds),
      endTime: lyric.endTime ? Math.max(0, lyric.endTime + offsetSeconds) : null
    }));
  }
  
  // Validate timestamp chronological order
  export function validateTimestamps(syncedLyrics) {
    for (let i = 1; i < syncedLyrics.length; i++) {
      if (syncedLyrics[i].startTime < syncedLyrics[i - 1].startTime) {
        return {
          valid: false,
          error: `Timestamp at index ${i} is before previous timestamp`,
          index: i
        };
      }
    }
    return { valid: true };
  }
  
  // Interpolate timestamps linearly between two points
  export function interpolateTimestamps(lyrics, startIndex, endIndex, startTime, endTime) {
    const numLines = endIndex - startIndex + 1;
    const timeInterval = (endTime - startTime) / (numLines - 1);
    
    const result = [];
    
    for (let i = 0; i < numLines; i++) {
      const currentTime = startTime + (i * timeInterval);
      result.push({
        text: lyrics[startIndex + i],
        startTime: currentTime,
        endTime: i < numLines - 1 ? currentTime + timeInterval : null,
        id: startIndex + i
      });
    }
    
    return result;
  }
  
  // Merge two synced lyrics arrays
  export function mergeSyncedLyrics(lyrics1, lyrics2) {
    const merged = [...lyrics1, ...lyrics2];
    merged.sort((a, b) => a.startTime - b.startTime);
    
    // Recalculate end times
    for (let i = 0; i < merged.length - 1; i++) {
      merged[i].endTime = merged[i + 1].startTime;
    }
    
    return merged;
  }
  
  // Calculate average time between lyrics
  export function getAverageInterval(syncedLyrics) {
    if (syncedLyrics.length < 2) return 0;
    
    let totalInterval = 0;
    
    for (let i = 1; i < syncedLyrics.length; i++) {
      totalInterval += syncedLyrics[i].startTime - syncedLyrics[i - 1].startTime;
    }
    
    return totalInterval / (syncedLyrics.length - 1);
  }
  
  // Detect potential timing errors (outliers)
  export function detectTimingErrors(syncedLyrics, threshold = 2) {
    const avgInterval = getAverageInterval(syncedLyrics);
    const errors = [];
    
    for (let i = 1; i < syncedLyrics.length; i++) {
      const interval = syncedLyrics[i].startTime - syncedLyrics[i - 1].startTime;
      
      if (interval > avgInterval * threshold || interval < avgInterval / threshold) {
        errors.push({
          index: i,
          interval,
          expected: avgInterval,
          lyric: syncedLyrics[i].text
        });
      }
    }
    
    return errors;
  }
  
  // Auto-detect beats in audio buffer (simplified)
  export function detectBeats(audioBuffer, threshold = 0.8) {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const windowSize = Math.floor(sampleRate / 10); // 100ms windows
    
    const beatTimes = [];
    let maxEnergy = 0;
    
    // Find maximum energy
    for (let i = 0; i < channelData.length; i += windowSize) {
      let energy = 0;
      const end = Math.min(i + windowSize, channelData.length);
      
      for (let j = i; j < end; j++) {
        energy += Math.abs(channelData[j]);
      }
      
      if (energy > maxEnergy) {
        maxEnergy = energy;
      }
    }
    
    // Detect beats
    let lastBeatTime = -1;
    
    for (let i = 0; i < channelData.length; i += windowSize) {
      let energy = 0;
      const end = Math.min(i + windowSize, channelData.length);
      
      for (let j = i; j < end; j++) {
        energy += Math.abs(channelData[j]);
      }
      
      if (energy > threshold * maxEnergy) {
        const timestamp = i / sampleRate;
        
        // Avoid detecting same beat multiple times (min 300ms apart)
        if (timestamp - lastBeatTime > 0.3) {
          beatTimes.push(timestamp);
          lastBeatTime = timestamp;
        }
      }
    }
    
    return beatTimes;
  }
  
  // Format duration to mm:ss
  export function formatDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Format duration to hh:mm:ss
  export function formatLongDuration(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Calculate sync accuracy score (0-100)
  export function calculateSyncAccuracy(syncedLyrics) {
    if (syncedLyrics.length < 2) return 100;
    
    const avgInterval = getAverageInterval(syncedLyrics);
    let totalDeviation = 0;
    
    for (let i = 1; i < syncedLyrics.length; i++) {
      const interval = syncedLyrics[i].startTime - syncedLyrics[i - 1].startTime;
      const deviation = Math.abs(interval - avgInterval);
      totalDeviation += deviation;
    }
    
    const avgDeviation = totalDeviation / (syncedLyrics.length - 1);
    const accuracy = Math.max(0, 100 - (avgDeviation * 10));
    
    return Math.round(accuracy);
  }
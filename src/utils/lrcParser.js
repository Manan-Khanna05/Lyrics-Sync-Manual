// Parse LRC file content into synced lyrics array
export function parseLRC(lrcContent) {
    const lines = lrcContent.split('\n');
    const syncedLyrics = [];
    let lineId = 0;
  
    // Regex pattern: [mm:ss.xx]text or [mm:ss]text
    const timePattern = /\[(\d{2}):(\d{2})\.?(\d{2})?\](.*)/;
  
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
  
      const match = trimmedLine.match(timePattern);
      
      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const centiseconds = match[3] ? parseInt(match[3], 10) : 0;
        const text = match[4].trim();
  
        if (text) {
          const startTime = (minutes * 60) + seconds + (centiseconds / 100);
          
          syncedLyrics.push({
            text,
            startTime,
            endTime: null,
            id: lineId++
          });
        }
      }
    });
  
    // Sort by start time
    syncedLyrics.sort((a, b) => a.startTime - b.startTime);
  
    // Calculate end times
    for (let i = 0; i < syncedLyrics.length - 1; i++) {
      syncedLyrics[i].endTime = syncedLyrics[i + 1].startTime;
    }
  
    // Set last lyric's end time to a large value
    if (syncedLyrics.length > 0) {
      syncedLyrics[syncedLyrics.length - 1].endTime = 999999;
    }
  
    return syncedLyrics;
  }
  
  // Generate LRC file content from synced lyrics
  export function generateLRC(syncedLyrics, metadata = {}) {
    let lrcContent = '';
  
    // Add metadata headers
    if (metadata.title) lrcContent += `[ti:${metadata.title}]\n`;
    if (metadata.artist) lrcContent += `[ar:${metadata.artist}]\n`;
    if (metadata.album) lrcContent += `[al:${metadata.album}]\n`;
    if (metadata.creator) lrcContent += `[by:${metadata.creator}]\n`;
    
    lrcContent += '\n';
  
    // Add synced lyrics
    syncedLyrics.forEach(lyric => {
      const minutes = Math.floor(lyric.startTime / 60);
      const seconds = lyric.startTime % 60;
      const wholeSeconds = Math.floor(seconds);
      const centiseconds = Math.floor((seconds - wholeSeconds) * 100);
  
      const timestamp = `[${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`;
      lrcContent += `${timestamp}${lyric.text}\n`;
    });
  
    return lrcContent;
  }
  
  // Validate LRC format
  export function validateLRC(lrcContent) {
    const lines = lrcContent.split('\n');
    const timePattern = /\[(\d{2}):(\d{2})\.?(\d{2})?\]/;
    
    let hasValidTimestamp = false;
  
    for (const line of lines) {
      if (timePattern.test(line)) {
        hasValidTimestamp = true;
        break;
      }
    }
  
    return hasValidTimestamp;
  }
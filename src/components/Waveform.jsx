import React, { useEffect, useRef } from 'react';

function Waveform({ audioURL, audioRef }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!audioURL) return;

    const drawWaveform = async () => {
      try {
        const response = await fetch(audioURL);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const data = audioBuffer.getChannelData(0);
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
          let min = 1.0;
          let max = -1.0;

          for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }

          const yMin = (1 + min) * amp;
          const yMax = (1 + max) * amp;

          if (i === 0) {
            ctx.moveTo(i, yMin);
          } else {
            ctx.lineTo(i, yMin);
          }
          ctx.lineTo(i, yMax);
        }

        ctx.stroke();

      } catch (error) {
        console.error('Error drawing waveform:', error);
      }
    };

    drawWaveform();
  }, [audioURL]);

  const handleCanvasClick = (e) => {
    if (!audioRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / canvas.width;
    const newTime = percentage * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="waveform-container" ref={containerRef}>
      <canvas 
        ref={canvasRef}
        width={800}
        height={100}
        onClick={handleCanvasClick}
        className="waveform-canvas"
      />
      <div className="waveform-hint">Click on waveform to seek</div>
    </div>
  );
}

export default Waveform;
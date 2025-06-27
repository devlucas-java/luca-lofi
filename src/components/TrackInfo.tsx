import React, { useState, useEffect } from 'react';

interface Track {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'live';
}

interface TrackInfoProps {
  track: Track;
  currentIndex: number;
  totalTracks: number;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, currentIndex, totalTracks }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Reset animation when track changes
  useEffect(() => {
    setDisplayText('');
    setCurrentCharIndex(0);
  }, [track.title]);

  // Typing animation effect
  useEffect(() => {
    if (currentCharIndex < track.title.length) {
      const timeout = setTimeout(() => {
        setDisplayText(track.title.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(currentCharIndex + 1);
      }, 100); // Speed of typing
      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, track.title]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500); // Blinking speed
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="bg-transparent border-b-2 border-b-black/50 p-4 mb-4 text-center">
      <div className="text-gray-100 pixel-font text-xs mb-2">
        NOW PLAYING
      </div>
      <div className="text-green-500 pixel-font text-base mb-2 min-h-6">
        {displayText}
        {showCursor && (
          <span className="text-green-500 animate-pulse">|</span>
        )}
      </div>
      <div className="text-gray-400 pixel-font text-xs mt-2">
        {track.type === 'live' ? '🔴 LIVE' : '📹 VIDEO'} • {currentIndex + 1} / {totalTracks}
      </div>
    </div>
  );
};
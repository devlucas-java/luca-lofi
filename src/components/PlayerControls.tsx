import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle } from 'lucide-react';
import { PixelButton } from './PixelButton';

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffleOn: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleShuffle: () => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffleOn,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleShuffle
}) => {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <PixelButton onClick={onPrevTrack} className="p-2 sm:p-3">
        <SkipBack className="w-4 h-4 sm:w-6 sm:h-6" />
      </PixelButton>
      
      <PixelButton onClick={onTogglePlay} className="px-4 py-3 sm:px-8 sm:py-4">
        {isPlaying ? 
          <Pause className="w-6 h-6 sm:w-8 sm:h-8" /> : 
          <Play className="w-6 h-6 sm:w-8 sm:h-8" />
        }
      </PixelButton>
      
      <PixelButton onClick={onNextTrack} className="p-2 sm:p-3">
        <SkipForward className="w-4 h-4 sm:w-6 sm:h-6" />
      </PixelButton>
      
      <PixelButton onClick={onToggleShuffle} active={isShuffleOn} className="p-2 sm:p-3">
        <Shuffle className="w-4 h-4 sm:w-6 sm:h-6" />
      </PixelButton>
    </div>
  );
};
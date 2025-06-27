import React from 'react';
import { TrackInfo } from './TrackInfo';
import { PlayerControls } from './PlayerControls';
import { PixelVolume } from './PixelVolume';

interface Track {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'live';
}

interface ControlPanelProps {
  currentTrack: Track;
  currentTrackIndex: number;
  totalTracks: number;
  isPlaying: boolean;
  isShuffleOn: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onToggleShuffle: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentTrack,
  currentTrackIndex,
  totalTracks,
  isPlaying,
  isShuffleOn,
  volume,
  isMuted,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onToggleShuffle,
  onVolumeChange,
  onToggleMute
}) => {
  return (
    <div className="fixed bg-transparent w-screen justify-center items-center bottom-0 left-0 right-0 z-30 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-opacity-95 bg-black/30 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="p-3 sm:p-6">
            
            <TrackInfo
              track={currentTrack}
              currentIndex={currentTrackIndex}
              totalTracks={totalTracks}
            />

            <PlayerControls
              isPlaying={isPlaying}
              isShuffleOn={isShuffleOn}
              onTogglePlay={onTogglePlay}
              onNextTrack={onNextTrack}
              onPrevTrack={onPrevTrack}
              onToggleShuffle={onToggleShuffle}
            />

            <div className="flex justify-center">
              <PixelVolume 
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={onVolumeChange}
                onToggleMute={onToggleMute}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

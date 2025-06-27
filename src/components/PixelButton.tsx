import React from 'react';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiHeart, FiUser, FiSettings, FiHome } from 'react-icons/fi';

interface PixelButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
  className?: string;
  active?: boolean;
  iconType?: 'play' | 'volume' | 'heart' | 'user' | 'settings' | 'home';
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  onClick,
  className = '',
  active = false,
  iconType
}) => {
  const getIcon = () => {
    if (children) return children;
    
    switch (iconType) {
      case 'play':
        return active ? <FiPause size={20} /> : <FiPlay size={20} />;
      case 'volume':
        return active ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />;
      case 'heart':
        return active ? <FiHeart size={20} fill="currentColor" /> : <FiHeart size={20} />;
      case 'user':
        return <FiUser size={20} />;
      case 'settings':
        return <FiSettings size={20} />;
      case 'home':
        return <FiHome size={20} />;
      default:
        return <FiPlay size={20} />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative
        rounded-full
        font-extrabold
        bg-transparent
        hover:bg-white/10
        ${active ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' : 'text-gray-300 hover:text-white'}
        transition-all
        duration-200
        p-4
        transform
        hover:scale-105
        active:scale-95
        ${className}
      `}
      style={{
        imageRendering: 'pixelated',
        boxShadow: active ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
      }}
    >
      <div
        className="flex items-center justify-center relative z-10"
        style={{
          imageRendering: 'pixelated',
          filter: active ? 'brightness(1.3) contrast(1.2)' : 'brightness(1.1) contrast(1.1)',
        }}
      >
        {getIcon()}
      </div>
      
      {/* Efeito de brilho quando ativo */}
      {active && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            filter: 'blur(1px)',
          }}
        />
      )}
      
      {/* Efeito hover pixelado */}
      <div
        className="absolute rounded-full inset-0 pointer-events-none opacity-0 hover:opacity-30 transition-opacity duration-200"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              transparent 0px,
              rgba(255,255,255,0.05) 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent 0px,
              rgba(255,255,255,0.05) 1px,
              transparent 3px
            )
          `,
          backgroundSize: '6px 6px',
          imageRendering: 'pixelated',
        }}
      />
    </button>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { AudioLines, VolumeX, Volume1, Volume2 } from 'lucide-react';

interface PixelVolumeProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export const PixelVolume: React.FC<PixelVolumeProps> = ({ 
  volume, 
  isMuted, 
  onVolumeChange, 
  onToggleMute 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const volumeBars = isMobile ? 10 : 20;
  const activeBars = Math.floor((volume / 100) * volumeBars);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 768;
    };
    
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controle de volume usando teclas do teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Não interferir em inputs
      }
      
      switch (e.key.toLowerCase()) {
        case 'm':
          onToggleMute();
          break;
        case 'arrowup':
        case '+':
          e.preventDefault();
          onVolumeChange(Math.min(100, volume + 5));
          break;
        case 'arrowdown':
        case '-':
          e.preventDefault();
          onVolumeChange(Math.max(0, volume - 5));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, onVolumeChange, onToggleMute]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateVolumeFromPosition(e.clientX);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateVolumeFromPosition(e.touches[0].clientX);
    e.preventDefault();
  };

  const updateVolumeFromPosition = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newVolume = Math.round(percentage * 100);
      onVolumeChange(newVolume);
      
      // Se estava mutado e mudou o volume, desmutar
      if (isMuted && newVolume > 0) {
        // O componente pai já vai desmutar automaticamente
      }
    }
  };

  const handleMuteClick = () => {
    onToggleMute();
    
    // Feedback visual rápido
    if (containerRef.current) {
      containerRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
  };

  const handleBarClick = (barIndex: number) => {
    const newVolume = Math.round(((barIndex + 1) / volumeBars) * 100);
    onVolumeChange(newVolume);
  };

  // Ícone dinâmico baseado no volume
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    } else if (volume < 30) {
      return <Volume1 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    } else if (volume < 70) {
      return <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    } else {
      return <AudioLines className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />;
    }
  };

  // Cor das barras baseada no volume
  const getBarColor = (barIndex: number) => {
    if (isMuted) return 'bg-gray-600 border-gray-500';
    if (barIndex >= activeBars) return 'bg-gray-700 border-gray-600';
    
    const percentage = (barIndex + 1) / volumeBars;
    if (percentage <= 0.3) return 'bg-green-100 border-green-300';
    if (percentage <= 0.7) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateVolumeFromPosition(e.clientX);
      }
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateVolumeFromPosition(e.touches[0].clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, volumeBars]);

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-2">
      {/* Botão de Mute com feedback visual */}
      <button 
        onClick={handleMuteClick}
        className={`text-white hover:text-gray-300 transition-all duration-200 p-1 flex-shrink-0 rounded-lg ${
          isMuted ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10'
        } transform hover:scale-105 active:scale-95`}
        aria-label={isMuted ? "Desmutar (M)" : "Mutar (M)"}
        title={isMuted ? "Desmutar (M)" : "Mutar (M)"}
      >
        {getVolumeIcon()}
      </button>

      {/* Container das Barras de Volume */}
      <div 
        ref={containerRef}
        className={`flex gap-px items-center select-none p-1 rounded transition-all duration-200 ${
          isDragging || isHovering ? 'bg-white/5' : ''
        } cursor-pointer`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        title={`Volume: ${volume}% (↑↓ ou +- para ajustar)`}
      >
        {Array.from({ length: volumeBars }, (_, i) => (
          <div
            key={i}
            className={`w-1 sm:w-1.5 md:w-2 h-3 sm:h-4 md:h-5 transition-all duration-150 ${
              getBarColor(i)
            } hover:brightness-110 ${
              isDragging ? 'scale-110' : ''
            } ${
              isHovering && i < activeBars ? 'brightness-125' : ''
            }`}
            onClick={() => handleBarClick(i)}
            style={{
              opacity: isMuted ? 0.4 : 1,
              transform: `scaleY(${isDragging && i === activeBars - 1 ? 1.2 : 1})`
            }}
          />
        ))}
      </div>

      {/* Indicador de Volume com animação */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className={`text-white font-mono text-xs sm:text-sm font-bold px-1 sm:px-2 py-1 min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem] text-center transition-all duration-200 ${
          isMuted ? 'text-red-400 line-through' : 'text-white'
        } ${
          isDragging ? 'scale-110 text-yellow-400' : ''
        }`}>
          {isMuted ? '0%' : `${volume}%`}
        </span>
        
        {/* Barra de progresso visual adicional */}
        <div className="w-full h-0.5 bg-gray-700 rounded overflow-hidden">
          <div 
            className={`h-full transition-all duration-200 ${
              isMuted ? 'bg-red-400' : volume < 30 ? 'bg-green-400' : volume < 70 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ 
              width: `${isMuted ? 0 : volume}%`,
              opacity: isMuted ? 0.3 : 1
            }}
          />
        </div>
      </div>

      {/* Dicas de teclado (apenas desktop) */}
      {!isMobile && isHovering && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap backdrop-blur-sm">
          M: Mute | ↑↓: Volume | +−: Volume
        </div>
      )}
    </div>
  );
};
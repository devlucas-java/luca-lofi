import React, { useState, useEffect } from 'react';

export const LoadingScreen: React.FC = () => {
  const [dots, setDots] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Animação dos pontos de loading
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    // Animação do cursor piscando
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <>
      {/* CSS para fonte pixelada e scan lines */}
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
          
          .pixel-font {
            font-family: "Press Start 2P", monospace;
            image-rendering: pixelated;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: grayscale;
          }

          .scan-lines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: linear-gradient(
              transparent 0%,
              rgba(0, 255, 0, 0.03) 50%,
              transparent 100%
            );
            background-size: 100% 4px;
            animation: scanlines 0.1s linear infinite;
          }

          @keyframes scanlines {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 0 4px;
            }
          }

          .crt-flicker {
            animation: crtFlicker 0.15s infinite linear alternate;
          }

          @keyframes crtFlicker {
            0% {
              opacity: 1;
            }
            98% {
              opacity: 1;
            }
            99% {
              opacity: 0.98;
            }
            100% {
              opacity: 0.99;
            }
          }

          .retro-glow {
            text-shadow: 
              0 0 5px currentColor,
              0 0 10px currentColor,
              0 0 15px currentColor,
              0 0 20px currentColor;
          }

          .loading-bar {
            background: linear-gradient(90deg, 
              #00ff00 0%, 
              #00cc00 50%, 
              #009900 100%);
            animation: loadingPulse 2s ease-in-out infinite;
          }

          @keyframes loadingPulse {
            0%, 100% {
              opacity: 0.6;
              transform: scaleX(0.95);
            }
            50% {
              opacity: 1;
              transform: scaleX(1);
            }
          }

          .pixel-border {
            border: 4px solid #00ff00;
            border-image: 
              repeating-linear-gradient(
                45deg,
                #00ff00 0px,
                #00ff00 2px,
                transparent 2px,
                transparent 4px
              ) 4;
          }
        `}
      </style>

      {/* Scan Lines - ficam por cima de tudo */}
      <div className="scan-lines" />

      {/* Tela de carregamento */}
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 crt-flicker">
        {/* Ruído de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-green-500/20 via-transparent to-green-500/20 animate-pulse" />
        </div>

        {/* Container principal */}
        <div className="relative text-center p-8">
          {/* Título principal */}
          <div className="pixel-font text-green-400 text-2xl sm:text-4xl md:text-6xl mb-8 retro-glow">
            LUCA-LOFI
          </div>

          {/* Subtítulo */}
          <div className="pixel-font text-green-300 text-sm sm:text-lg md:text-xl mb-12">
            RETRO RADIO SYSTEM
          </div>

          {/* Barra de loading */}
          <div className="w-64 sm:w-80 md:w-96 mx-auto mb-8">
            <div className="pixel-border bg-black p-2">
              <div className="loading-bar h-4 w-full rounded-none" />
            </div>
          </div>

          {/* Status de loading */}
          <div className="pixel-font text-green-400 text-xs sm:text-sm md:text-base mb-4 retro-glow">
            INITIALIZING LOFI RADIO{dots}
          </div>

          {/* Detalhes técnicos */}
          <div className="pixel-font text-green-300 text-xs opacity-70 space-y-2">
            <div>LOADING AUDIO DRIVERS...</div>
            <div>CONNECTING TO FREQUENCY...</div>
            <div>CALIBRATING SPEAKERS...</div>
          </div>

          {/* Cursor piscando */}
          <div className="mt-8">
            <span className={`pixel-font text-green-400 text-xl transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
              █
            </span>
          </div>

          {/* Decoração adicional */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-green-400 opacity-50" />
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-green-400 opacity-50" />
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-green-400 opacity-50" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-green-400 opacity-50" />
        </div>

        {/* Efeito de interferência */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-pulse" 
               style={{ 
                 background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
                 animation: 'slideRight 0.1s linear infinite'
               }} />
        </div>
      </div>

      {/* Animação adicional para o efeito de interferência */}
      <style>
        {`
          @keyframes slideRight {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Coffee, Heart } from 'lucide-react';

interface TerminalModalProps {
  isVisible: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isVisible, onClose, isMobile }) => {
  const [showCursor, setShowCursor] = useState(true);
  const [backgroundPath, setBackgroundPath] = useState('');
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Definir background apenas uma vez quando o componente monta
  useEffect(() => {
    const getBackgroundPath = () => {
      const randomNumber = Math.floor(Math.random() * (isMobile ? 7 : 22)) + 1;
      return isMobile ? `/mobile/mb${randomNumber}.mp4` : `/desktop/bg-${randomNumber}.mp4`;
    };

    setBackgroundPath(getBackgroundPath());
  }, [isMobile]); // Só muda quando isMobile muda

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e: MouseEvent) => {
      if (isMobile) {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    if (isMobile) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (isMobile) {
        document.removeEventListener('click', handleClick);
      }
    };
  }, [isVisible, onClose, isMobile]);

  if (!isVisible) return null;

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

          /* Brilho verde sutil como console antigo */
          .retro-glow {
            text-shadow: 
              0 0 2px rgba(0, 255, 0, 0.3),
              0 0 4px rgba(0, 255, 0, 0.2),
              0 0 6px rgba(0, 255, 0, 0.1);
          }

          /* Brilho mais forte para textos principais */
          .retro-glow-strong {
            text-shadow: 
              0 0 3px rgba(0, 255, 0, 0.4),
              0 0 6px rgba(0, 255, 0, 0.3),
              0 0 9px rgba(0, 255, 0, 0.2);
          }

          /* Brilho para botões coloridos - mais sutil */
          .button-glow-red {
            box-shadow: 
              0 0 5px rgba(255, 0, 0, 0.3),
              0 0 10px rgba(255, 0, 0, 0.2);
          }

          .button-glow-blue {
            box-shadow: 
              0 0 5px rgba(0, 100, 255, 0.3),
              0 0 10px rgba(0, 100, 255, 0.2);
          }

          .button-glow-purple {
            box-shadow: 
              0 0 5px rgba(150, 0, 255, 0.3),
              0 0 10px rgba(150, 0, 255, 0.2);
          }

          .button-glow-amber {
            box-shadow: 
              0 0 5px rgba(255, 191, 0, 0.3),
              0 0 10px rgba(255, 191, 0, 0.2);
          }

          .button-glow-pink {
            box-shadow: 
              0 0 5px rgba(255, 0, 150, 0.3),
              0 0 10px rgba(255, 0, 150, 0.2);
          }
        `}
      </style>

      {/* Scan Lines - ficam por cima de tudo */}
      <div className="scan-lines" />

      <div className="fixed inset-0 z-50 flex items-center justify-center crt-flicker">
        {/* Background Video - fixo */}
        {backgroundPath && (
          <video
            ref={bgVideoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src={backgroundPath}
            key={backgroundPath} // Força recriação apenas quando o path muda
          />
        )}
        
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Container principal */}
        <div className="relative z-10 w-full max-w-6xl mx-4 flex flex-col items-center justify-center min-h-screen">
          
          {/* Logos dos sites */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-12 sm:mb-16">
            <a
              href="https://lucasflix.netlify.app"
              className="pixel-font bg-red-600 hover:bg-red-500 text-white px-6 sm:px-8 py-4 sm:py-6 text-lg sm:text-2xl font-bold transition-all duration-300 border-4 border-red-400 shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 button-glow-red"
              onClick={(e) => e.stopPropagation()}
            >
              LUCAFLIX
            </a>
            
            <a
              href="https://lucastv.netlify.app"
              className="pixel-font bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-4 sm:py-6 text-lg sm:text-2xl font-bold transition-all duration-300 border-4 border-blue-400 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 button-glow-blue"
              onClick={(e) => e.stopPropagation()}
            >
              LUCATV+
            </a>
            
            <div className="pixel-font bg-purple-600 text-white px-6 sm:px-8 py-4 sm:py-6 text-lg sm:text-2xl font-bold border-4 border-purple-400 shadow-2xl button-glow-purple">
              LUCA-LOFI
            </div>
          </div>

          {/* Texto de boas-vindas grande */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="pixel-font text-white text-2xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl animate-pulse retro-glow-strong">
              BEM-VINDOS
            </h1>
            <div className="pixel-font text-green-400 text-xl sm:text-2xl md:text-3xl drop-shadow-lg retro-glow-strong">
              AO LUCA-LOFI
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 sm:mb-12">
            <a
              href="Coffee"
              className="pixel-font bg-amber-500 hover:bg-amber-400 text-black px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center gap-2 transition-all duration-300 border-4 border-amber-300 shadow-xl hover:shadow-amber-500/50 transform hover:scale-105 button-glow-amber"
              onClick={(e) => e.stopPropagation()}
            >
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
              COMPRAR CAFE
            </a>
            
            <a
              href="about"
              className="pixel-font bg-pink-500 hover:bg-pink-400 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base flex items-center gap-2 transition-all duration-300 border-4 border-pink-300 shadow-xl hover:shadow-pink-500/50 transform hover:scale-105 button-glow-pink"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              SOBRE
            </a>
          </div>
          
          {/* Instrução para continuar */}
          <div className="pixel-font text-center">
            <div className="text-yellow-400 text-lg sm:text-2xl md:text-3xl mb-4 animate-bounce retro-glow">
              {isMobile ? 'TOQUE NA TELA' : 'APERTE QUALQUER TECLA'}
            </div>
            <div className="text-white text-sm sm:text-lg retro-glow">
              PARA INICIAR
            </div>
            <div className={`text-green-400 text-2xl sm:text-4xl mt-2 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity retro-glow`}>
              █
            </div>
          </div>

          {/* Decoração de cantos */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-green-400 opacity-50" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-green-400 opacity-50" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-green-400 opacity-50" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-green-400 opacity-50" />
        </div>
      </div>
    </>
  );
};
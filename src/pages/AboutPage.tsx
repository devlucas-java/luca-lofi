import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Coffee, Heart, Github, Instagram, Twitter } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [bgNumber, setBgNumber] = useState(1);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      return (
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Definir background aleatório
  useEffect(() => {
    if (isMobile) {
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      setBgNumber(randomNumber);
    } else {
      const randomNumber = Math.floor(Math.random() * 22) + 1;
      setBgNumber(randomNumber);
    }
  }, [isMobile]);

  const getBackgroundPath = () => {
    if (isMobile) {
      return `/mobile/mb${bgNumber}.mp4`;
    } else {
      return `/desktop/bg-${bgNumber}.mp4`;
    }
  };

  return (
    <>
      {/* CSS para efeitos CRT e fonte pixelada */}
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
          
          .pixel-font {
            font-family: "Press Start 2P", monospace;
            image-rendering: pixelated;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Scan Lines - linhas horizontais que descem */
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

          /* Linhas verticais que se movem */
          .vertical-lines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
            background: repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 0, 0.02) 2px,
              rgba(0, 255, 0, 0.02) 4px
            );
            animation: verticalLines 8s linear infinite;
          }

          @keyframes verticalLines {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(4px);
            }
          }

          /* Flicker da tela CRT */
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

          /* Brilho verde sutil */
          .retro-glow {
            text-shadow: 
              0 0 2px rgba(0, 255, 0, 0.3),
              0 0 4px rgba(0, 255, 0, 0.2),
              0 0 6px rgba(0, 255, 0, 0.1);
          }

          .retro-glow-strong {
            text-shadow: 
              0 0 3px rgba(0, 255, 0, 0.4),
              0 0 6px rgba(0, 255, 0, 0.3),
              0 0 9px rgba(0, 255, 0, 0.2);
          }

          /* Curvatura da tela CRT */
          .crt-curve {
            border-radius: 10px;
            box-shadow: 
              inset 0 0 50px rgba(0, 0, 0, 0.5),
              0 0 20px rgba(0, 255, 0, 0.1);
          }

          /* Animação de typing */
          .typing-effect {
            overflow: hidden;
            border-right: 2px solid rgba(0, 255, 0, 0.7);
            white-space: nowrap;
            animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
          }

          @keyframes typing {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          @keyframes blink-caret {
            from, to {
              border-color: transparent;
            }
            50% {
              border-color: rgba(0, 255, 0, 0.7);
            }
          }
        `}
      </style>

      {/* Scan Lines - ficam por cima de tudo */}
      <div className="scan-lines" />
      
      {/* Linhas verticais */}
      <div className="vertical-lines" />

      <div className="min-h-screen relative overflow-hidden crt-flicker">
        {/* Background Video */}
        <video
          ref={bgVideoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={getBackgroundPath()}
          key={`about-bg-${bgNumber}-${isMobile ? 'mobile' : 'desktop'}`}
        />
        
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        {/* Container principal */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
          
          {/* Botão voltar */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
            <button
              onClick={() => window.history.back()}
              className="pixel-font bg-red-600 hover:bg-red-500 text-white px-4 py-2 text-xs sm:text-sm flex items-center gap-2 transition-all duration-300 border-2 border-red-400 retro-glow hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              VOLTAR
            </button>
          </div>

          {/* Container do conteúdo com efeito CRT */}
          <div className="w-full max-w-4xl mx-auto crt-curve bg-black/40 border-4 border-green-400/30 p-6 sm:p-12">
            
            {/* Título principal */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="pixel-font text-green-400 text-2xl sm:text-4xl md:text-6xl font-bold mb-4 retro-glow-strong typing-effect">
                SOBRE O LUCA-LOFI
              </h1>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50 mb-8"></div>
            </div>

            {/* Conteúdo principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12">
              
              {/* Coluna da esquerda */}
              <div className="space-y-6">
                <div className="pixel-font text-white text-sm sm:text-base leading-relaxed retro-glow">
                  <h2 className="text-yellow-400 text-lg sm:text-xl mb-4 retro-glow">MISSÃO:</h2>
                  <p className="mb-4">
                    CRIAR UM ESPAÇO NOSTÁLGICO ONDE LO-FI MUSIC E VISUAL RETRO SE ENCONTRAM.
                  </p>
                  <p>
                    INSPIRADO NOS ANOS 90 E NA ESTÉTICA CYBERPUNK, LUCA-LOFI É SEU PORTAL PARA RELAXAMENTO.
                  </p>
                </div>

                <div className="pixel-font text-white text-sm sm:text-base leading-relaxed retro-glow">
                  <h2 className="text-cyan-400 text-lg sm:text-xl mb-4 retro-glow">RECURSOS:</h2>
                  <ul className="space-y-2">
                    <li>• BACKGROUNDS ANIMADOS RETRÔ</li>
                    <li>• PLAYLIST LO-FI CURADA</li>
                    <li>• INTERFACE TERMINAL NOSTÁLGICA</li>
                    <li>• EXPERIÊNCIA IMERSIVA CRT</li>
                  </ul>
                </div>
              </div>

              {/* Coluna da direita */}
              <div className="space-y-6">
                <div className="pixel-font text-white text-sm sm:text-base leading-relaxed retro-glow">
                  <h2 className="text-pink-400 text-lg sm:text-xl mb-4 retro-glow">TECNOLOGIA:</h2>
                  <ul className="space-y-2">
                    <li>• REACT + TYPESCRIPT</li>
                    <li>• TAILWIND CSS</li>
                    <li>• LUCIDE ICONS</li>
                    <li>• HTML5 AUDIO/VIDEO</li>
                  </ul>
                </div>

                <div className="pixel-font text-white text-sm sm:text-base leading-relaxed retro-glow">
                  <h2 className="text-orange-400 text-lg sm:text-xl mb-4 retro-glow">CRIADOR:</h2>
                  <p className="mb-4">
                    DESENVOLVIDO COM ❤️ POR LUCAS
                  </p>
                  <p>
                    "COMBINANDO NOSTALGIA DIGITAL COM BEATS RELAXANTES"
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de links sociais */}
            <div className="text-center">
              <h2 className="pixel-font text-green-400 text-xl sm:text-2xl mb-6 retro-glow-strong">
                CONECTE-SE
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a
                  href="#github"
                  className="pixel-font bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-xs flex items-center gap-2 transition-all duration-300 border-2 border-gray-500 retro-glow hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                  GITHUB
                </a>
                
                <a
                  href="#instagram"
                  className="pixel-font bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 text-xs flex items-center gap-2 transition-all duration-300 border-2 border-pink-400 retro-glow hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                  INSTAGRAM
                </a>
                
                <a
                  href="#twitter"
                  className="pixel-font bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs flex items-center gap-2 transition-all duration-300 border-2 border-blue-400 retro-glow hover:scale-105"
                >
                  <Twitter className="w-4 h-4" />
                  TWITTER
                </a>
              </div>

              {/* Call to action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/coffee"
                  className="pixel-font bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 text-sm flex items-center gap-2 justify-center transition-all duration-300 border-4 border-amber-300 retro-glow hover:scale-105"
                >
                  <Coffee className="w-5 h-5" />
                  APOIE O PROJETO
                </a>
                
                <button
                  onClick={() => window.history.back()}
                  className="pixel-font bg-green-600 hover:bg-green-500 text-white px-6 py-3 text-sm flex items-center gap-2 justify-center transition-all duration-300 border-4 border-green-400 retro-glow hover:scale-105"
                >
                  <Heart className="w-5 h-5" />
                  VOLTAR À MÚSICA
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t border-green-400/30">
              <p className="pixel-font text-green-400 text-xs retro-glow">
                © 2024 LUCA-LOFI - TODOS OS DIREITOS RESERVADOS
              </p>
              <p className="pixel-font text-gray-400 text-xs mt-2 retro-glow">
                "QUANDO A NOSTALGIA ENCONTRA O FUTURO"
              </p>
            </div>
          </div>

          {/* Decorações nos cantos */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-green-400 opacity-30" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-green-400 opacity-30" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-green-400 opacity-30" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-green-400 opacity-30" />
        </div>
      </div>
    </>
  );
};
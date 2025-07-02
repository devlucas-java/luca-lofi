import React, { useState, useEffect, useRef } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { VideoPlayer } from "../components/VideoPlayer";
import { ControlPanel } from "../components/ControlPanel";
import { TerminalModal } from "./TerminalModal";
import { tracks } from "../utils/tracks";
import { Header } from "../components/Header";

export const RadioPage: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffleOn, setIsShuffleOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bgNumber, setBgNumber] = useState(1);
  const [showStatic, setShowStatic] = useState(false);
  const [staticNumber, setStaticNumber] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [nextBgNumber, setNextBgNumber] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Refs para controle de áudio e vídeo
  const staticAudioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef<number>(50);
  const bgVideoRef = useRef<HTMLVideoElement | null>(null);
  const nextBgVideoRef = useRef<HTMLVideoElement | null>(null);
  const staticVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dev = false;

  // Constantes para número de backgrounds
  const DESKTOP_BACKGROUNDS = 11;
  const MOBILE_BACKGROUNDS = 4;

  // Função para obter número aleatório de background baseado no dispositivo
  const getRandomBackgroundNumber = () => {
    if (isMobile) {
      return Math.floor(Math.random() * MOBILE_BACKGROUNDS) + 1;
    } else {
      return Math.floor(Math.random() * DESKTOP_BACKGROUNDS) + 1;
    }
  };

  // Detectar mudanças de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Detectar se é mobile ou desktop
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

  // Definir background inicial
  useEffect(() => {
    const randomNumber = getRandomBackgroundNumber();
    setBgNumber(randomNumber);
    setNextBgNumber(randomNumber === 1 ? 2 : 1); // Garante que o próximo seja diferente
    
    if (dev) {
      if (isMobile) {
        console.log(`🎵 Background Mobile Inicial: mb${randomNumber}.mp4`);
      } else {
        console.log(`🖥️ Background Desktop Inicial: bg-${randomNumber}.mp4`);
      }
    }
  }, [isMobile]);

  // Debug: Imprimir sempre que o bgNumber mudar
  useEffect(() => {
    if (!isMobile) {
      if (dev) {
        console.log(`🖥️ Background Desktop Renderizado: bg-${bgNumber}.mp4`);
      }
    } else {
      if (dev) {
        console.log(`📱 Background Mobile Renderizado: mb${bgNumber}.mp4`);
      }
    }
  }, [bgNumber, isMobile]);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Função para fechar o modal terminal e iniciar música
  const handleCloseTerminalModal = () => {
    setShowTerminalModal(false);
    setHasInteracted(true);
    setTimeout(() => {
      setIsPlaying(true);
    }, 500);
  };

  // Função para aplicar volume/mute em todos os elementos de vídeo de fundo
  const applyAudioSettings = () => {
    const videoVolume = isMuted ? 0 : volume / 100;

    if (bgVideoRef.current) {
      bgVideoRef.current.volume = videoVolume;
      bgVideoRef.current.muted = isMuted;
    }

    if (nextBgVideoRef.current) {
      nextBgVideoRef.current.volume = videoVolume;
      nextBgVideoRef.current.muted = isMuted;
    }

    if (staticVideoRef.current) {
      staticVideoRef.current.volume = videoVolume;
      staticVideoRef.current.muted = isMuted;
    }

    if (staticAudioRef.current) {
      staticAudioRef.current.volume = videoVolume;
      staticAudioRef.current.muted = isMuted;
    }

    const otherMediaElements = document.querySelectorAll(
      "audio:not([data-bg-audio]), video:not([data-bg-video])"
    );
    otherMediaElements.forEach((element) => {
      const mediaElement = element as HTMLAudioElement | HTMLVideoElement;
      mediaElement.volume = videoVolume;
      mediaElement.muted = isMuted;
    });
  };

  useEffect(() => {
    applyAudioSettings();
  }, [volume, isMuted]);

  const playStaticSound = () => {
    const randomStaticSound = Math.floor(Math.random() * 3) + 1;

    if (staticAudioRef.current) {
      staticAudioRef.current.src = `/som/static/static${randomStaticSound}.mp3`;
      staticAudioRef.current.volume = isMuted ? 0 : volume / 100;
      staticAudioRef.current.muted = isMuted;
      staticAudioRef.current.play().catch((error) => {
        if (dev) {
          console.log("Erro ao tocar som da estática:", error);
        }
      });
    }
  };

  const stopStaticSound = () => {
    if (staticAudioRef.current) {
      staticAudioRef.current.pause();
      staticAudioRef.current.currentTime = 0;
    }
  };

  const showStaticTransition = () => {
    const randomStatic = Math.floor(Math.random() * 3) + 1;
    setStaticNumber(randomStatic);

    // Gera o próximo background garantindo que seja diferente do atual
    let newBgNumber;
    do {
      newBgNumber = getRandomBackgroundNumber();
    } while (newBgNumber === bgNumber);
    
    setNextBgNumber(newBgNumber);

    if (dev) {
      if (isMobile) {
        console.log(`📱 Próximo Background Mobile: mb${newBgNumber}.mp4`);
      } else {
        console.log(`🖥️ Próximo Background Desktop: bg-${newBgNumber}.mp4`);
      }
    }

    setShowStatic(true);
    playStaticSound();

    setTimeout(() => {
      setShowStatic(false);
      setBgNumber(nextBgNumber);
      stopStaticSound();
    }, 1000);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    showStaticTransition();

    if (isShuffleOn) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const prevTrack = () => {
    showStaticTransition();

    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) {
        setVolume(
          previousVolumeRef.current > 0 ? previousVolumeRef.current : 50
        );
      }
    } else {
      if (volume > 0) {
        previousVolumeRef.current = volume;
      }
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      if (dev) {
        console.log("Erro ao alternar tela cheia:", error);
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getBackgroundPath = () => {
    if (isMobile) {
      return `/mobile/mb${bgNumber}.mp4`;
    } else {
      return `/desktop/bg-${bgNumber}.mp4`;
    }
  };

  const getNextBackgroundPath = () => {
    if (isMobile) {
      return `/mobile/mb${nextBgNumber}.mp4`;
    } else {
      return `/desktop/bg-${nextBgNumber}.mp4`;
    }
  };

  // Função para lidar com erro de carregamento de vídeo
  const handleVideoError = (isNext: boolean = false) => {
    return () => {
      if (dev) {
        console.log(`Erro ao carregar vídeo: ${isNext ? getNextBackgroundPath() : getBackgroundPath()}`);
      }
      
      // Se for o vídeo principal que falhou, usar um fallback
      if (!isNext) {
        const fallbackNumber = isMobile ? 1 : 1; // Usar sempre o primeiro como fallback
        setBgNumber(fallbackNumber);
        if (dev) {
          console.log(`Usando fallback: ${isMobile ? 'mb1.mp4' : 'bg-1.mp4'}`);
        }
      }
    };
  };

  return (
    <div>
      {/* CSS para fonte pixelada e efeito CRT */}
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
          
          .pixel-font {
            font-family: "Press Start 2P", monospace;
            image-rendering: pixelated;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Efeito CRT Scanlines */
          .crt-scanlines {
            position: relative;
            overflow: hidden;
          }

          .crt-scanlines::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            pointer-events: none;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 0, 0.03) 2px,
              rgba(0, 255, 0, 0.03) 4px
            );
            animation: scanlines 0.1s linear infinite;
          }

          .crt-scanlines::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
            pointer-events: none;
            background: linear-gradient(
              180deg,
              rgba(0, 255, 0, 0.02) 0%,
              transparent 50%,
              rgba(0, 255, 0, 0.02) 100%
            );
            animation: crt-flicker 2s ease-in-out infinite alternate;
          }

          @keyframes scanlines {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100vh);
            }
          }

          @keyframes crt-flicker {
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
              opacity: 1;
            }
          }

          /* Linha de scan principal que desce */
          .crt-moving-line {
            position: absolute;
            top: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(0, 255, 0, 0.4) 50%,
              transparent
            );
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
            z-index: 1002;
            pointer-events: none;
            animation: moving-scanline-down 3s linear infinite;
          }

          /* Linha de scan que sobe */
          .crt-moving-line-up {
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(0, 255, 0, 0.6) 50%,
              transparent
            );
            box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
            z-index: 1001;
            pointer-events: none;
            animation: moving-scanline-up 4s linear infinite;
            animation-delay: 1.5s;
          }

          @keyframes moving-scanline-down {
            0% {
              top: -2px;
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
            100% {
              top: 100vh;
              opacity: 1;
            }
          }

          @keyframes moving-scanline-up {
            0% {
              bottom: -2px;
              opacity: 0.7;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              bottom: 100vh;
              opacity: 0.7;
            }
          }

          /* Efeito de curvatura da tela CRT */
          .crt-screen {
            border-radius: 10px;
            box-shadow: 
              inset 0 0 50px rgba(0, 0, 0, 0.3),
              0 0 100px rgba(0, 0, 0, 0.8);
          }

          /* Vinheta nas bordas para simular CRT */
          .crt-vignette {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 999;
            pointer-events: none;
            background: radial-gradient(
              ellipse at center,
              transparent 60%,
              rgba(0, 0, 0, 0.3) 100%
            );
          }
        `}
      </style>

      {/* Modal Terminal - aparece primeiro */}
      <TerminalModal
        isVisible={showTerminalModal}
        onClose={handleCloseTerminalModal}
        isMobile={isMobile}
      />

      {/* Header - só aparece após interação */}
      {hasInteracted && (
        <Header
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      <div
        ref={containerRef}
        className="min-h-screen min-w-screen relative overflow-hidden crt-scanlines crt-screen"
      >
        {/* Vinheta CRT */}
        <div className="crt-vignette" />

        {/* Linhas de scan que descem e sobem */}
        <div className="crt-moving-line" />
        <div className="crt-moving-line-up" />

        {/* Áudio da estática */}
        <audio
          ref={staticAudioRef}
          preload="auto"
          style={{ display: "none" }}
          data-bg-audio="true"
        />

        {/* Background principal */}
        <video
          ref={bgVideoRef}
          className="absolute top-0 left-0 w-full z-10 h-full object-cover"
          autoPlay
          loop
          playsInline
          src={getBackgroundPath()}
          key={`bg-${bgNumber}-${isMobile ? "mobile" : "desktop"}`}
          data-bg-video="true"
          onError={handleVideoError(false)}
        />

        {/* Pré-carregamento do próximo background */}
        <video
          ref={nextBgVideoRef}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          src={getNextBackgroundPath()}
          preload="auto"
          data-bg-video="true"
          onError={handleVideoError(true)}
        />

        {/* Estática sobreposta */}
        {showStatic && (
          <video
            ref={staticVideoRef}
            className="absolute top-0 left-0 w-full z-20 h-full object-cover"
            autoPlay
            loop
            playsInline
            src={`/static/static${staticNumber}.mp4`}
            data-bg-video="true"
          />
        )}

        <VideoPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
        />

        {/* ControlPanel - só aparece após interação */}
        {hasInteracted && (
          <ControlPanel
            currentTrack={currentTrack}
            currentTrackIndex={currentTrackIndex}
            totalTracks={tracks.length}
            isPlaying={isPlaying}
            isShuffleOn={isShuffleOn}
            volume={volume}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onNextTrack={nextTrack}
            onPrevTrack={prevTrack}
            onToggleShuffle={toggleShuffle}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />
        )}
      </div>
    </div>
  );
};
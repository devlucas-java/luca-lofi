import { useRef, useEffect, useCallback, useState } from 'react';

// Tipos para a YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface UseYouTubePlayerOptions {
  videoId: string;
  autoplay?: boolean;
  startTime?: number;
  volume?: number;
  muted?: boolean;
}

interface UseYouTubePlayerReturn {
  playerRef: React.RefObject<HTMLDivElement>;
  isReady: boolean;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  loadVideo: (videoId: string) => void;
}

export const useYouTubePlayer = (
  options: UseYouTubePlayerOptions
): UseYouTubePlayerReturn => {
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Carrega a API do YouTube
  const loadYouTubeAPI = useCallback((): Promise<void> => {
    if (window.YT && window.YT.Player) {
      setApiLoaded(true);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      
      if (existingScript) {
        // Se o script já existe, aguarda ele carregar
        const checkYT = () => {
          if (window.YT && window.YT.Player) {
            setApiLoaded(true);
            resolve();
          } else {
            setTimeout(checkYT, 100);
          }
        };
        checkYT();
        return;
      }

      // Cria callback global
      window.onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
        resolve();
      };

      // Carrega o script
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    });
  }, []);

  // Inicializa o player
  const initializePlayer = useCallback(() => {
    if (!window.YT || !playerRef.current || !apiLoaded) {
      return;
    }

    // Destroi player existente
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch (error) {
        console.warn('Erro ao destruir player anterior:', error);
      }
    }

    ytPlayerRef.current = new window.YT.Player(playerRef.current, {
      height: '1',
      width: '1',
      videoId: options.videoId,
      playerVars: {
        autoplay: options.autoplay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0,
        start: options.startTime || 0,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          console.log('YouTube player pronto:', options.videoId);
          
          // Configura volume inicial
          if (options.muted) {
            event.target.mute();
          } else {
            event.target.unMute();
            event.target.setVolume(options.volume || 50);
          }
          
          setIsReady(true);
        },
        onStateChange: (event: any) => {
          // Estados: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
          console.log('Estado do player mudou:', event.data);
        },
        onError: (event: any) => {
          console.error('Erro no YouTube player:', event.data);
          setIsReady(false);
        }
      }
    });
  }, [apiLoaded, options.videoId, options.autoplay, options.startTime, options.volume, options.muted]);

  // Funções de controle
  const play = useCallback(() => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.playVideo();
      } catch (error) {
        console.warn('Erro ao reproduzir:', error);
      }
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch (error) {
        console.warn('Erro ao pausar:', error);
      }
    }
  }, [isReady]);

  const setVolume = useCallback((volume: number) => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.setVolume(Math.max(0, Math.min(100, volume)));
      } catch (error) {
        console.warn('Erro ao alterar volume:', error);
      }
    }
  }, [isReady]);

  const mute = useCallback(() => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.mute();
      } catch (error) {
        console.warn('Erro ao mutar:', error);
      }
    }
  }, [isReady]);

  const unmute = useCallback(() => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.unMute();
      } catch (error) {
        console.warn('Erro ao desmutar:', error);
      }
    }
  }, [isReady]);

  const loadVideo = useCallback((videoId: string) => {
    if (ytPlayerRef.current && isReady) {
      try {
        ytPlayerRef.current.loadVideoById({
          videoId,
          startSeconds: options.startTime || 0,
        });
      } catch (error) {
        console.warn('Erro ao carregar vídeo:', error);
      }
    }
  }, [isReady, options.startTime]);

  // Efeito para inicializar
  useEffect(() => {
    const init = async () => {
      try {
        await loadYouTubeAPI();
        // Pequeno delay para garantir que tudo está pronto
        setTimeout(() => {
          initializePlayer();
        }, 100);
      } catch (error) {
        console.error('Erro ao inicializar YouTube API:', error);
      }
    };

    init();

    // Cleanup
    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (error) {
          console.warn('Erro no cleanup:', error);
        }
      }
      setIsReady(false);
    };
  }, []);

  // Efeito para mudança de vídeo
  useEffect(() => {
    if (isReady && ytPlayerRef.current) {
      loadVideo(options.videoId);
    }
  }, [options.videoId, isReady, loadVideo]);

  return {
    playerRef,
    isReady,
    play,
    pause,
    setVolume,
    mute,
    unmute,
    loadVideo,
  };
};
import React, { useRef, useEffect } from "react";

interface Track {
  id: string;
  title: string;
  url: string;
  type: "video" | "live";
}

interface VideoPlayerProps {
  track: Track;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  track,
  isPlaying,
  volume,
  isMuted,
}) => {
  const foregroundVideoRef = useRef<HTMLIFrameElement>(null);

  // Função para enviar comandos para o YouTube
  const sendYouTubeCommand = (command: string, args?: any) => {
    if (
      foregroundVideoRef.current &&
      foregroundVideoRef.current.contentWindow
    ) {
      const message = {
        event: "command",
        func: command,
        args: args || [],
      };
      foregroundVideoRef.current.contentWindow.postMessage(
        JSON.stringify(message),
        "*"
      );
    }
  };

  // Controlar volume quando mudar
  useEffect(() => {
    if (track.url.includes("youtube.com") || track.url.includes("youtu.be")) {
      const youtubeVolume = isMuted ? 0 : volume;
      sendYouTubeCommand("setVolume", youtubeVolume);

      if (isMuted) {
        sendYouTubeCommand("mute");
      } else {
        sendYouTubeCommand("unMute");
      }
    }
  }, [volume, isMuted, track.url]);

  // Controlar play/pause quando mudar
  useEffect(() => {
    if (track.url.includes("youtube.com") || track.url.includes("youtu.be")) {
      if (isPlaying) {
        sendYouTubeCommand("playVideo");
      } else {
        sendYouTubeCommand("pauseVideo");
      }
    }
  }, [isPlaying, track.url]);

  // Função para obter URL do YouTube com API habilitada
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  const embedUrl =
    track.url.includes("youtube.com") || track.url.includes("youtu.be")
      ? getYouTubeEmbedUrl(track.url)
      : track.url;

  return (
    <>
<div className="">
        <iframe
          ref={foregroundVideoRef}
          src={embedUrl}
          className="w-full -z-10 h-full rounded-lg shadow-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={track.title}
        />
              <div
        className="z-10 h-screen w-screen"
        style={{ backgroundImage: "url('/default-bg.jpg')" }}
      ></div>
      </div>
    </>
  );
};

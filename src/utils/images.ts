// Função para obter URL de vídeo desktop por número
export const getDesktopVideoUrl = (number: number): string => {
  // Garantir que o número está no intervalo válido (1-22)
  const validNumber = Math.max(1, Math.min(22, number));
  return `https://f003.backblazeb2.com/file/la-chica/bg-${validNumber}.mp4`;
};

// Função para obter URL de vídeo mobile por número
export const getMobileVideoUrl = (number: number): string => {
  // Garantir que o número está no intervalo válido (1-7)
  const validNumber = Math.max(1, Math.min(7, number));
  return `https://f003.backblazeb2.com/file/la-chica/mb${validNumber}.mp4`;
};

// Função para obter URL de vídeo estático por número
export const getStaticVideoUrl = (number: number): string => {
  // Garantir que o número está no intervalo válido (1-6)
  const validNumber = Math.max(1, Math.min(6, number));
  return `https://f003.backblazeb2.com/file/la-chica/static${validNumber}.mp4`;
};

// Função para obter URL de áudio estático por número
export const getStaticAudioUrl = (number: number): string => {
  // Garantir que o número está no intervalo válido (1-5)
  const validNumber = Math.max(1, Math.min(5, number));
  return `https://f003.backblazeb2.com/file/la-chica/static${validNumber}.mp3`;
};

// Arrays originais para compatibilidade (caso ainda sejam necessários)
export const desktopVideos: string[] = Array.from({ length: 22 }, (_, i) =>
  `https://f003.backblazeb2.com/file/la-chica/bg-${i + 1}.mp4`
);

export const mobileVideos: string[] = Array.from({ length: 7 }, (_, i) =>
  `https://f003.backblazeb2.com/file/la-chica/mb${i + 1}.mp4`
);

export const staticVideos: string[] = Array.from({ length: 6 }, (_, i) =>
  `https://f003.backblazeb2.com/file/la-chica/static${i + 1}.mp4`
);

export const staticAudios: string[] = Array.from({ length: 5 }, (_, i) =>
  `https://f003.backblazeb2.com/file/la-chica/static${i + 1}.mp3`
);

// Constantes para os limites
export const DESKTOP_VIDEO_COUNT = 22;
export const MOBILE_VIDEO_COUNT = 7;
export const STATIC_VIDEO_COUNT = 6;
export const STATIC_AUDIO_COUNT = 5;
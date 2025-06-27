import { Coffee, Heart } from "lucide-react";

interface HeaderProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isFullscreen, onToggleFullscreen }) => {
  return (
    <header className="fixed flex w-screen z-30 px-4 sm:px-6 py-3 sm:py-4 text-white justify-end items-center backdrop-blur-md bg-gradient-to-b from-black/60 via-black/30 to-transparent">
      {/* Logo LUCA-LOFI à esquerda com estilo pixelado */}
      <div className="absolute left-4 sm:left-6 md:-top-14 sm:-top-7">
        <img src="/logo.png" alt="LUCA-LOFI" className="w-20 sm:w-30 md:w-45" />
      </div>

      {/* Navegação e controles à direita */}
      <div className="flex flex-row justify-center items-center gap-2 sm:gap-4">
        {/* Navegação desktop */}
        <nav className="hidden sm:flex gap-4 md:gap-6 text-sm md:text-base items-center">
          <a
            href="https://lucasflix.netlify.app"
            className="text-red-600 font-extrabold tracking-wide text-base md:text-lg hover:brightness-125 transition duration-300 drop-shadow-md"
          >
            LUCAFLIX
          </a>

          <a
            href="https://lucastv.netlify.app"
            className="flex items-center text-gray-200 hover:text-white transition duration-300 drop-shadow-md"
          >
            <span className="text-base md:text-lg font-bold">LucaTV</span>
            <span className="text-white -translate-0.5 text-xl md:text-2xl font-extrabold ml-1">
              +
            </span>
          </a>

          {/* Link About com estilo pixelado */}
          <a
            href="about"
            className="hover:text-amber-400 flex flex-row gap-1 transition-colors duration-300 drop-shadow-md pixel-font text-xs"
          >
            <span className="hidden md:inline">About</span>
            <Heart className="w-4 h-4 md:w-5 md:h-5" />
          </a>

          {/* Botão de café com estilo pixelado */}
          <a
            href="Coffee"
            className="bg-amber-500/90 backdrop-blur-sm text-black px-3 md:px-4 py-1 pixel-font flex flex-row gap-1 rounded hover:bg-amber-400/90 transition-all duration-300 drop-shadow-lg border border-amber-300/30 text-xs"
          >
            <span className="hidden md:inline">Me compre um café</span>
            <span className="md:hidden">Café</span>
            <Coffee className="font-extrabold w-4 h-4 md:w-5 md:h-5" />
          </a>
        </nav>

        {/* Menu mobile */}
        <nav className="flex sm:hidden gap-2 items-center">
          <a
            href="https://lucasflix.netlify.app"
            className="text-red-600 font-bold text-sm hover:brightness-125 transition duration-300"
          >
            FLIX
          </a>
          <a
            href="https://lucastv.netlify.app"
            className="text-gray-200 hover:text-white transition duration-300 font-bold text-sm"
          >
            TV+
          </a>
          <a
            href="about"
            className="hover:text-amber-400 transition-colors duration-300 pixel-font"
          >
            <Heart className="w-4 h-4" />
          </a>
          <a
            href="Coffee"
            className="bg-amber-500/90 backdrop-blur-sm text-black px-2 py-1 pixel-font rounded hover:bg-amber-400/90 transition-all duration-300 text-xs"
          >
            <Coffee className="w-4 h-4" />
          </a>
        </nav>

        {/* Botão de tela cheia compacto */}
        <button
          onClick={onToggleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded backdrop-blur-sm transition-all duration-200 pixel-font"
          title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
        >
          {isFullscreen ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ imageRendering: 'pixelated' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ imageRendering: 'pixelated' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};
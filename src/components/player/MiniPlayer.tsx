import React from 'react';
import { X, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store';

interface MiniPlayerProps {
  src: string;
  title: string;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ src, title }) => {
  const navigate = useNavigate();
  const { currentMedia, resetPlayer } = useUIStore();
  
  const handleClose = () => {
    resetPlayer();
  };
  
  const handleMaximize = () => {
    const { id, type, season, episode } = currentMedia;
    if (id && type) {
      let url = `/${type}/${id}`;
      if (type === 'tv' && season !== undefined && episode !== undefined) {
        url += `/season/${season}/episode/${episode}`;
      }
      navigate(url);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 w-80 h-45 rounded-lg shadow-lg overflow-hidden z-50 bg-black transition-all duration-300 ease-in-out">
      <div className="relative w-full h-full">
        <iframe
          src={src}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
        />
        
        {/* Controls overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          {/* Title bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-3 py-2 flex justify-between items-center">
            <h3 className="text-white text-sm font-medium truncate pr-6">
              {title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleMaximize}
                className="text-white/80 hover:text-white"
                aria-label="Maximize player"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white"
                aria-label="Close player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;

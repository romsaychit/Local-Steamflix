import React, { useEffect, useRef } from 'react';
import { MediaType } from '../../types';
import { useUserStore } from '../../store';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  mediaId: number;
  mediaType: MediaType;
  title: string;
  onProgress?: (progress: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  mediaId,
  mediaType,
  title,
  onProgress,
}) => {
  const { addToWatchHistory } = useUserStore();
  const playerRef = useRef<HTMLDivElement>(null);

  // Track progress and update watch history
  useEffect(() => {
    const interval = setInterval(() => {
      // Assuming 50% progress for now since we can't track iframe progress
      const progress = 50;
      if (onProgress) {
        onProgress(progress);
      }
      addToWatchHistory(mediaId, mediaType, progress);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [mediaId, mediaType, addToWatchHistory, onProgress]);

  return (
    <div className="w-full bg-black">
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={src}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;

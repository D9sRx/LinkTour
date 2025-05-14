'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MediaPlayerProps {
  src: string;
  type: 'audio' | 'video';
}

export default function MediaPlayer({ src, type }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement>(null);
  
  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    
    const setAudioData = () => {
      setDuration(media.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(media.currentTime);
    };
    
    // Events
    media.addEventListener('loadedmetadata', setAudioData);
    media.addEventListener('timeupdate', setAudioTime);
    
    return () => {
      media.removeEventListener('loadedmetadata', setAudioData);
      media.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);
  
  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;
    
    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    const media = mediaRef.current;
    if (!media) return;
    
    media.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (newVolume: number[]) => {
    const media = mediaRef.current;
    if (!media) return;
    
    const value = newVolume[0];
    setVolume(value);
    media.volume = value;
    
    if (value === 0) {
      setIsMuted(true);
      media.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      media.muted = false;
    }
  };
  
  const handleTimeChange = (newTime: number[]) => {
    const media = mediaRef.current;
    if (!media) return;
    
    const value = newTime[0];
    media.currentTime = value;
    setCurrentTime(value);
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="rounded-lg overflow-hidden border bg-card">
      {type === 'video' ? (
        <video 
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className="w-full aspect-video bg-black"
          onClick={togglePlay}
        />
      ) : (
        <audio 
          ref={mediaRef as React.RefObject<HTMLAudioElement>}
          src={src}
          className="hidden"
        />
      )}
      
      <div className="p-4 space-y-4">
        {type === 'audio' && (
          <div className="flex justify-center items-center h-20 bg-primary/5 rounded-md">
            <Volume2 className="h-8 w-8 text-primary opacity-50" />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <span className="text-sm w-16 text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleTimeChange}
              className="flex-1"
            />
            
            <span className="text-sm w-16 text-right text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
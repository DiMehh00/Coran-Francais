import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, Volume2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AudioPlayer({ 
  verse, 
  isPlaying, 
  onPlay, 
  onPause, 
  onNext, 
  onEnd,
  surahName 
}) {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Effect to handle verse changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !verse || !verse.audio_url) {
      setAudioError(true);
      return;
    }

    setAudioError(false);
    if (audio.src !== verse.audio_url) {
      audio.src = verse.audio_url;
      audio.load();
    }
  }, [verse]);

  // Effect to handle play/pause actions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audioError) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Erreur de lecture :", err);
            setAudioError(true);
            onPause && onPause();
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audioError, onPause]);

  // Effect to handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => onEnd && onEnd();
    const handleError = () => {
      console.error("Erreur de l'élément audio pour la source :", audio.src);
      setAudioError(true);
      setIsLoading(false);
      onPause && onPause();
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [onEnd, onPause]);
  
  if (!verse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-6 right-6 z-50"
    >
      <Card className="liquid-glass border-0 rounded-2xl shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 liquid-gradient rounded-full flex-shrink-0 flex items-center justify-center">
                {audioError ? (
                  <AlertCircle className="w-6 h-6 text-red-400" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {surahName || 'Sourate'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {audioError ? 'Audio indisponible' : `Verset ${verse.verse_number || 1}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={isPlaying ? onPause : onPlay}
                disabled={audioError}
                className="liquid-glass rounded-full hover:scale-110 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="liquid-glass rounded-full hover:scale-110 transition-all duration-300"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <audio ref={audioRef} preload="metadata" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
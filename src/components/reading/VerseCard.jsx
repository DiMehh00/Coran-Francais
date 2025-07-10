import React from "react";
import { Play, Pause, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function VerseCard({ id, verse, isPlaying, onPlay, onPause, onBookmark, isBookmarked, isUserLoggedIn, delay = 0 }) {
  if (!verse) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <motion.div
      id={id}
      data-verse-number={verse.verse_number}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className={`liquid-glass border-0 rounded-2xl overflow-hidden transition-all duration-500 ${
        isPlaying ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-400/25' : ''
      }`}>
        <CardContent className="p-8">
          {/* Verse Number & Actions */}
          <div className="flex items-center justify-between mb-6">
            <Badge 
              variant="outline" 
              className="liquid-glass border-0 px-3 py-1 text-sm font-medium"
            >
              {verse.surah_number || 1}:{verse.verse_number || 1}
            </Badge>
            
            <div className="flex items-center gap-2">
              {isUserLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onBookmark(verse)}
                  className="liquid-glass rounded-full hover:scale-110 transition-all duration-300"
                  title="Enregistrer la progression"
                >
                  <Bookmark className={`w-5 h-5 transition-colors ${
                    isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-500'
                  }`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className={`liquid-glass rounded-full hover:scale-110 transition-all duration-300 ${
                  isPlaying ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Arabic Text */}
          <div className="text-right mb-6">
            <p className="text-3xl leading-relaxed font-arabic text-gray-800 dark:text-gray-100">
              {verse.text_arabic || ''}
            </p>
          </div>

          {/* Phonetic Text */}
          <div className="mb-6">
            <p className="text-lg italic text-blue-600 dark:text-blue-400 leading-relaxed">
              {verse.text_phonetic || ''}
            </p>
          </div>

          {/* French Translation */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {verse.text_french || ''}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
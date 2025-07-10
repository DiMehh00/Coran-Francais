
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Surah } from "@/api/entities";
import { User } from "@/api/entities";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import _ from "lodash";

import VerseCard from "../components/reading/VerseCard";
import AudioPlayer from "../components/reading/AudioPlayer";

export default function Reading() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const surahNumber = parseInt(urlParams.get('surah'));
  
  const [surah, setSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [bookmarkedVerseKey, setBookmarkedVerseKey] = useState(null); // NEW: State to store the bookmarked verse key

  // DELETED: Intersection Observer related code (observer ref and debouncedSaveProgress)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        // NEW: Set bookmarkedVerseKey if user has last_read data
        if (currentUser && currentUser.last_read) {
          setBookmarkedVerseKey(`${currentUser.last_read.surah_number}:${currentUser.last_read.verse_number}`);
        }
      } catch (e) {
        // If user is not logged in or error, user remains null
        setUser(null); 
        // console.warn("User not logged in or failed to fetch user data.");
      }
    };
    fetchUser();
    
    if (surahNumber) {
      loadSurahData();
    }
  }, [surahNumber]);

  useEffect(() => {
    // Scroll to verse if hash is present
    if (verses.length > 0 && location.hash) {
      const targetId = location.hash.substring(1); // Remove '#'
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }, [verses, location.hash]);

  // DELETED: Intersection Observer useEffect hook

  const loadSurahData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const surahData = await Surah.filter({ number: surahNumber });
      const uniqueSurah = _.uniqBy(surahData || [], 'number');
      setSurah(uniqueSurah[0] || null);

      // Récupérer TOUS les versets de la sourate sans limite
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=en&words=true&translations=31&audio=7&per_page=300`);
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }
      const versesApiData = await response.json();
      
      // Si on a plus de versets que la limite, on fait des requêtes supplémentaires
      let allVerses = versesApiData.verses;
      
      if (versesApiData.pagination && versesApiData.pagination.total_pages > 1) {
        for (let page = 2; page <= versesApiData.pagination.total_pages; page++) {
          const pageResponse = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=en&words=true&translations=31&audio=7&per_page=300&page=${page}`);
          if (pageResponse.ok) {
            const pageData = await pageResponse.json();
            allVerses = [...allVerses, ...pageData.verses];
          }
        }
      }
      
      const formattedVerses = allVerses.map(v => ({
          id: v.id,
          surah_number: parseInt(v.verse_key.split(':')[0]),
          verse_number: parseInt(v.verse_key.split(':')[1]),
          text_arabic: v.text_uthmani,
          text_phonetic: v.words.map(w => w.transliteration?.text).filter(Boolean).join(' '),
          text_french: (v.translations[0]?.text || '').replace(/<[^>]*>?/gm, ''),
          audio_url: `https://verses.quran.com/${v.audio.url}`
      }));
      
      // Trier par numéro de verset pour s'assurer de l'ordre correct
      const sortedVerses = formattedVerses.sort((a, b) => a.verse_number - b.verse_number);
      
      setVerses(sortedVerses);
      
      console.log(`Chargé ${sortedVerses.length} versets pour la sourate ${surahNumber}`);
      
    } catch (err) {
      console.error('Error loading surah data:', err);
      setError("Impossible de charger les données de la sourate. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: handleBookmarkVerse function
  const handleBookmarkVerse = async (verse) => {
    if (!user || !surah) return; // Must be logged in and surah loaded
    try {
      await User.updateMyUserData({
        last_read: {
          surah_number: verse.surah_number,
          verse_number: verse.verse_number,
          surah_name_phonetic: surah.name_phonetic,
        },
      });
      setBookmarkedVerseKey(`${verse.surah_number}:${verse.verse_number}`);
      console.log(`Bookmark saved: Surah ${verse.surah_number}, Verse ${verse.verse_number}`);
    } catch (e) {
      console.error("Failed to save bookmark:", e);
    }
  };
  
  const handlePlayVerse = (verse) => {
    if (verse) {
      if (currentPlaying?.id === verse.id && isPlaying) {
        setIsPlaying(false);
      } else {
        setCurrentPlaying(verse);
        setIsPlaying(true);
      }
    }
  };

  const handlePauseVerse = () => {
    setIsPlaying(false);
  };

  const handleNextVerse = () => {
    if (!currentPlaying || !verses.length) return;
    
    const currentIndex = verses.findIndex(v => v.id === currentPlaying.id);
    if (currentIndex > -1 && currentIndex < verses.length - 1) {
      const nextVerse = verses[currentIndex + 1];
      setCurrentPlaying(nextVerse);
      setIsPlaying(true); // Automatically play next verse
    } else {
      setCurrentPlaying(null);
      setIsPlaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-1/2 mx-auto"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-8 w-1/3 mx-auto"></div>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="mb-8 p-6 bg-gray-200 dark:bg-gray-700 rounded-xl">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4 w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Sourate non trouvée'}</h1>
          <Link to={createPageUrl("Home")}>
            <Button className="liquid-gradient">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-40">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="liquid-glass rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Home")}>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="liquid-glass rounded-full hover:scale-110 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center text-white font-bold">
                {surah?.number || 0}
              </div>
            </div>
            
            {/* Compteur de versets chargés */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {verses.length} versets chargés
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 font-arabic">
              {surah?.name_arabic || ''}
            </h1>
            <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              {surah?.name_phonetic || ''}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              {surah?.name_french || ''}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="liquid-glass border-0">
                {surah?.verses_count || 0} versets
              </Badge>
              <Badge 
                variant="outline" 
                className={`${
                  surah?.revelation_type === 'meccan' 
                    ? 'border-amber-400 text-amber-600' 
                    : 'border-green-400 text-green-600'
                }`}
              >
                {surah?.revelation_type === 'meccan' ? 'Mecquoise' : 'Médinoise'}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Verses */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.02 }}
            className="space-y-6"
          >
            {verses.map((verse, index) => (
              <VerseCard
                key={verse.id}
                id={`verse-${verse.verse_number}`} // Added for scroll-to-hash functionality
                // data-verse-number={verse.verse_number} // REMOVED: for Intersection Observer
                verse={verse}
                isPlaying={currentPlaying?.id === verse.id && isPlaying}
                onPlay={() => handlePlayVerse(verse)}
                onPause={handlePauseVerse}
                onBookmark={handleBookmarkVerse} // NEW: Pass the bookmark handler
                isBookmarked={bookmarkedVerseKey === `${verse.surah_number}:${verse.verse_number}`} // NEW: Pass if this verse is bookmarked
                isUserLoggedIn={!!user} // NEW: Pass user login status
                delay={index * 0.02}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Audio Player */}
        <AnimatePresence>
          {currentPlaying && (
            <AudioPlayer
              verse={currentPlaying}
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={handlePauseVerse}
              onNext={handleNextVerse}
              onEnd={handleNextVerse}
              surahName={surah?.name_phonetic || 'Sourate'}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

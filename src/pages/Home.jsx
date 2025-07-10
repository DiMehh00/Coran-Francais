
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Surah } from "@/api/entities";
import { Search, BookOpen, ArrowRight, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";
import InstallPrompt from "../components/InstallPrompt";
import WelcomeModal from "../components/WelcomeModal";

export default function Home() {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await Surah.list('number');
      const uniqueSurahs = _.uniqBy(data || [], 'number');
      setSurahs(uniqueSurahs);
    } catch (error) {
      console.error('Error loading surahs:', error);
      setSurahs([]); // Ensure surahs state is reset on error
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(surah => {
    if (!surah) return false;
    
    const phonetic = (surah.name_phonetic || '').toLowerCase();
    const french = (surah.name_french || '').toLowerCase();
    const arabic = surah.name_arabic || '';
    const term = (searchTerm || '').toLowerCase();

    return (
      phonetic.includes(term) ||
      french.includes(term) ||
      arabic.includes(searchTerm || '')
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Modal */}
        <WelcomeModal />
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 liquid-text-gradient">
            القرآن الكريم
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Découvrez la beauté du Coran avec une interface moderne et élégante
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Rechercher une sourate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg liquid-glass border-0 rounded-2xl backdrop-blur-xl"
            />
          </div>
        </motion.div>

        {/* Surahs Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              data-surahs-grid
            >
              {filteredSurahs.map((surah) => (
                <motion.div key={surah.id} variants={itemVariants}>
                  <Link to={createPageUrl(`Reading?surah=${surah.number}`)}>
                    <Card className="liquid-glass border-0 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center text-white font-bold">
                            {surah.number || 0}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="liquid-glass border-0 text-xs"
                          >
                            {surah.verses_count || 0} versets
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 font-arabic">
                            {surah.name_arabic || ''}
                          </h3>
                          <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                            {surah.name_phonetic || ''}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {surah.name_french || ''}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="outline" 
                            className={`${
                              surah.revelation_type === 'meccan' 
                                ? 'border-amber-400 text-amber-600' 
                                : 'border-green-400 text-green-600'
                            }`}
                          >
                            {surah.revelation_type === 'meccan' ? 'Mecquoise' : 'Médinoise'}
                          </Badge>
                          
                          <div className="flex items-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <Volume2 className="w-4 h-4" />
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!isLoading && filteredSurahs.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Aucune sourate trouvée pour "{searchTerm}"
            </p>
          </motion.div>
        )}
        
        {/* Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
}

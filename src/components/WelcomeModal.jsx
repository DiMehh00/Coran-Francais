
import React, { useState, useEffect } from "react";
import { X, BookOpen, Headphones, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('coran-app-visited');
    if (!hasVisited) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('coran-app-visited', 'true');
  };

  const handleStart = () => {
    handleClose();
    // Optionally scroll to surahs list
    const surahs = document.querySelector('[data-surahs-grid]');
    if (surahs) {
      surahs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg"
        >
          <Card className="liquid-glass border-0 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              {/* Header with gradient background */}
              <div className="liquid-gradient p-8 text-center text-white relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold mb-2"
                >
                  السلام عليكم
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/90 text-lg"
                >
                  Bienvenue dans votre application Coran
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      Découvrez une nouvelle façon de lire le Coran
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Une expérience complète et moderne pour votre spiritualité
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          Lecture complète
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Texte phonétique et traduction française
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <Headphones className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          Écoute synchronisée
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Récitation audio de qualité pour chaque verset
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 liquid-gradient rounded-full flex items-center justify-center flex-shrink-0">
                        <Bookmark className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          Suivi de progression
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Reprenez votre lecture là où vous vous êtes arrêté
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="flex gap-3 pt-4"
                  >
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="flex-1 liquid-glass border-0"
                    >
                      Plus tard
                    </Button>
                    <Button
                      onClick={handleStart}
                      className="flex-1 liquid-gradient text-white font-semibold"
                    >
                      Commencer
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

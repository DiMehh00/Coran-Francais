
import React, { useState, useEffect } from "react";
import { X, Smartphone, Plus, Share2 } from "lucide-react"; // Changed ArrowUpFromSquare to Share2
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Effect to detect environment and capture the install prompt event
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsStandalone(standalone);
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Effect to decide when to show the prompt UI
  useEffect(() => {
    if (isStandalone || localStorage.getItem('pwa-install-dismissed')) {
      return;
    }

    if (deferredPrompt || isIOS) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt, isIOS, isStandalone]);


  const handleInstall = async () => {
    setShowPrompt(false);
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA a été installée');
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-6 md:w-96"
      >
        <Card className="liquid-glass border-0 rounded-2xl shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 liquid-gradient rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Installer l'app
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Accédez rapidement au Coran
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-600 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isIOS ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pour installer sur votre iPhone :
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Share2 className="w-4 h-4" /> {/* Changed icon to Share2 */}
                  <span>Appuyez sur Partager</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Plus className="w-4 h-4" />
                  <span>Puis "Sur l'écran d'accueil"</span>
                </div>
                <Button
                  onClick={handleDismiss}
                  className="w-full liquid-gradient mt-4"
                >
                  J'ai compris
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="flex-1 liquid-glass border-0"
                >
                  Plus tard
                </Button>
                <Button
                  onClick={handleInstall}
                  className="flex-1 liquid-gradient"
                  disabled={!deferredPrompt}
                >
                  Installer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

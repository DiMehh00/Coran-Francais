import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookMarked, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        // Redirect to login if not authenticated
        User.loginWithRedirect(window.location.href);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by the catch block
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Bienvenue, <span className="liquid-text-gradient">{user.full_name}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Votre espace personnel pour suivre votre lecture du Coran.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="liquid-glass border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookMarked className="w-6 h-6 text-blue-500" />
                <span className="text-2xl">Reprendre la lecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.last_read && user.last_read.surah_number ? (
                <div>
                  <p className="text-lg mb-2">
                    Vous vous êtes arrêté à la sourate{' '}
                    <strong className="text-blue-500">{user.last_read.surah_name_phonetic}</strong>,
                    verset{' '}
                    <strong className="text-blue-500">{user.last_read.verse_number}</strong>.
                  </p>
                  <Link to={createPageUrl(`Reading?surah=${user.last_read.surah_number}#verse-${user.last_read.verse_number}`)}>
                    <Button className="mt-4 liquid-gradient group">
                      Continuer la lecture <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-lg">
                  Commencez à lire une sourate et votre progression sera automatiquement sauvegardée ici.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
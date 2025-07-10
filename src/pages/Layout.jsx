

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Moon, Sun, BookOpen, LogIn, LogOut, UserCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('quran-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
    
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (e) {
        // User not logged in or error fetching user, set user to null
        setUser(null);
      }
    };
    fetchUser();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    localStorage.setItem('quran-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const handleLogout = async () => {
    await User.logout();
    // After logout, refresh the page or redirect to clear user state
    window.location.href = createPageUrl("Home");
  };

  return (
    <div className="min-h-screen transition-all duration-700 ease-out">
      <style>{`
        :root {
          --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
          --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .dark {
          --gradient-primary: linear-gradient(135deg, #2D3748 0%, #1A202C 100%);
          --gradient-secondary: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);
          --gradient-accent: linear-gradient(135deg, #3182CE 0%, #2B6CB0 100%);
          --glass-bg: rgba(0, 0, 0, 0.2);
          --glass-border: rgba(255, 255, 255, 0.1);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
        }

        .liquid-glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .liquid-gradient {
          background: var(--gradient-primary);
        }

        .liquid-text-gradient {
          background: var(--gradient-accent);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          to { box-shadow: 0 0 30px rgba(102, 126, 234, 0.6); }
        }
      `}</style>

      <div className={`min-h-screen transition-all duration-700 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        
        {/* Navigation Header */}
        <header className="liquid-glass border-b-0 sticky top-0 z-50 transition-all duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <div className="w-10 h-10 liquid-gradient rounded-full flex items-center justify-center animate-glow">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold liquid-text-gradient">
                  القرآن الكريم
                </h1>
              </Link>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="liquid-glass rounded-full hover:animate-pulse transition-all duration-300"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-purple-600" />
                  )}
                </Button>
                
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="liquid-glass rounded-full">
                        <UserCircle className="w-6 h-6" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="liquid-glass border-0" align="end">
                      <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Dashboard")} className="flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Mon Espace</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-red-500">
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => User.login()}
                    className="liquid-glass rounded-xl flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Se connecter</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative">
          {children}
        </main>

        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 liquid-gradient rounded-full opacity-10 animate-float" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 liquid-gradient rounded-full opacity-5 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 liquid-gradient rounded-full opacity-15 animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </div>
    </div>
  );
}


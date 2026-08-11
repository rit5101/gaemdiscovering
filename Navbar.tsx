import { useState, useEffect } from 'react';
import { Brain, Search, Menu, X, Sparkles } from 'lucide-react';
import type { Page } from '@/types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSearchClick: () => void;
  onSignIn: () => void;
  onTryDemo: () => void;
}

const navItems: { label: string; page: Page }[] = [
  { label: 'Discover', page: 'home' },
  { label: 'AI Recommendations', page: 'discover' },
  { label: 'Create Game', page: 'studio' },
  { label: 'My Library', page: 'library' },
  { label: 'About', page: 'about' },
];

export function Navbar({ currentPage, onNavigate, onSearchClick, onSignIn, onTryDemo }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => handleNav('home')} className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-neon-purple/30 animate-pulse-ring pointer-events-none" />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-tight">
                GameMind <span className="gradient-text-cyan">AI</span>
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.page
                      ? 'text-white bg-white/[0.06] border border-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={onSearchClick}
                className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-300 hover:text-white hover:border-white/20 transition-all"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={onSignIn}
                className="hidden sm:inline-flex btn-ghost text-sm py-2"
              >
                Sign In
              </button>
              <button onClick={onTryDemo} className="hidden sm:inline-flex btn-primary text-sm py-2">
                <Sparkles className="w-4 h-4" /> Try GameMind AI
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-300"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-strong border-t border-white/10 animate-fade-down">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNav(item.page)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.page
                      ? 'text-white bg-white/[0.06]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={onSignIn} className="btn-ghost text-sm flex-1">Sign In</button>
                <button onClick={() => { onTryDemo(); setMobileOpen(false); }} className="btn-primary text-sm flex-1">
                  <Sparkles className="w-4 h-4" /> Try Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16" />
    </>
  );
}

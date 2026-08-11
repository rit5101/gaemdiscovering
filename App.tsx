import { useMemo, useState } from 'react';
import { ArrowRight, Brain, Check, Github, Instagram, Linkedin, Search, Sparkles, Twitter, X } from 'lucide-react';
import type { CreatedGame, Game, Page, Toast, TasteProfile } from '@/types';
import { games } from '@/data/games';
import { defaultTaste, getPersonalizedRecommendations, scoreGames, updateTaste } from '@/lib/aiEngine';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { DiscoveryPage } from '@/components/DiscoveryPage';
import { PersonalizedSection } from '@/components/PersonalizedSection';
import { MetricSection } from '@/components/MetricSection';
import { TechSection } from '@/components/TechSection';
import { StudioPage } from '@/components/StudioPage';
import { GameDetailsPage } from '@/components/GameDetailsPage';
import { SearchPage } from '@/components/SearchPage';
import { LibraryPage } from '@/components/LibraryPage';
import { ChatAssistant } from '@/components/ChatAssistant';
import { ToastContainer } from '@/components/ui/Toast';

const DEMO_PROMPT = 'Create a futuristic 2D multiplayer survival shooter with neon weapons and increasing enemy difficulty.';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [prompt, setPrompt] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [library, setLibrary] = useState<Game[]>([games[0], games[4], games[7]]);
  const [createdGames, setCreatedGames] = useState<CreatedGame[]>([]);
  const [taste, setTaste] = useState<TasteProfile>(defaultTaste);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSignIn, setShowSignIn] = useState(false);

  const recommendations = useMemo(() => getPersonalizedRecommendations(taste), [taste]);

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    setToasts((current) => [...current, { id: `${Date.now()}-${Math.random()}`, message, type }]);
  };

  const dismissToast = (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id));

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const findGame = (value: string) => {
    setPrompt(value);
    navigate('discover');
  };

  const createGame = (value: string) => {
    setPrompt(value);
    navigate('studio');
  };

  const demoMode = () => {
    setPrompt(DEMO_PROMPT);
    navigate('studio');
    addToast('Demo Mode loaded. Generate the example game to see the full flow.', 'info');
  };

  const openGame = (game: Game) => {
    setSelectedGame(game);
    setTaste((current) => updateTaste(current, game));
    navigate('details');
  };

  const addToLibrary = (game: Game) => {
    setLibrary((current) => current.some((item) => item.id === game.id) ? current : [...current, game]);
    setTaste((current) => updateTaste(current, game));
    addToast(`${game.title} added to your library.`);
  };

  const removeFromLibrary = (game: Game) => {
    setLibrary((current) => current.filter((item) => item.id !== game.id));
    addToast(`${game.title} removed from your library.`, 'info');
  };

  const renderPage = () => {
    if (page === 'home') {
      return <HomePage onFindGame={findGame} onCreateGame={createGame} onDemoMode={demoMode} recommendations={recommendations} taste={taste} onNavigateGame={openGame} />;
    }
    if (page === 'discover') return <DiscoveryPage initialPrompt={prompt || 'A fast-paced futuristic multiplayer game with neon weapons'} onNavigateGame={openGame} onAddToLibrary={addToLibrary} />;
    if (page === 'studio') return <StudioPage initialPrompt={prompt} onSaveCreated={(game) => setCreatedGames((current) => [...current, game])} onToast={(message) => addToast(message)} />;
    if (page === 'library') return <LibraryPage library={library} createdGames={createdGames} onNavigateGame={openGame} onRemove={removeFromLibrary} onCreate={() => navigate('studio')} />;
    if (page === 'search') return <SearchPage initialQuery={prompt} onNavigateGame={openGame} onAddToLibrary={addToLibrary} />;
    if (page === 'details' && selectedGame) return <GameDetailsPage game={selectedGame} onBack={() => navigate('discover')} onAdd={() => addToLibrary(selectedGame)} onSelectSimilar={openGame} onToast={(message) => addToast(message, 'info')} />;
    if (page === 'about') return <AboutPage />;
    return null;
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={page} onNavigate={navigate} onSearchClick={() => navigate('search')} onSignIn={() => setShowSignIn(true)} onTryDemo={demoMode} />
      {renderPage()}
      <ChatAssistant onNavigateGame={openGame} onNavigateSearch={(query) => { setPrompt(query); navigate('search'); }} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} onSubmit={() => { setShowSignIn(false); addToast('Welcome to GameMind AI.'); }} />}
    </div>
  );
}

function HomePage({ onFindGame, onCreateGame, onDemoMode, recommendations, taste, onNavigateGame }: { onFindGame: (prompt: string) => void; onCreateGame: (prompt: string) => void; onDemoMode: () => void; recommendations: Game[]; taste: TasteProfile; onNavigateGame: (game: Game) => void }) {
  return <><Hero onFindGame={onFindGame} onCreateGame={onCreateGame} onDemoMode={onDemoMode} /><section className="max-w-7xl mx-auto px-4 md:px-6 py-14"><div className="grid md:grid-cols-3 gap-4"><FeatureCard number="01" title="AI Game Discovery" text="Describe the feeling, genre, or moment you want. GameMind understands intent beyond keywords." color="from-neon-purple to-neon-blue" /><FeatureCard number="02" title="Personalized Recommendations" text="Every match comes with an explanation, so you know exactly why a game belongs on your list." color="from-neon-blue to-neon-cyan" /><FeatureCard number="03" title="AI Game Creation" text="Turn a sentence into a playable prototype. Your imagination is the starting point." color="from-neon-cyan to-emerald-400" /></div></section><PersonalizedSection taste={taste} recommendations={recommendations} onNavigateGame={onNavigateGame} /><MetricSection /><TechSection /><Footer /></>;
}

function FeatureCard({ number, title, text, color }: { number: string; title: string; text: string; color: string }) { return <div className="glass-card glass-card-hover p-6 group"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-mono text-sm mb-5 shadow-lg`}>{number}</div><h3 className="font-display text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">{title}</h3><p className="text-sm text-slate-400 leading-relaxed">{text}</p><ArrowRight className="w-4 h-4 text-slate-600 mt-5 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" /></div>; }

function AboutPage() { return <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 pb-24"><div className="text-center mb-14"><div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]"><Brain className="w-8 h-8 text-white" /></div><h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Games are a <span className="gradient-text">conversation.</span></h1><p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">GameMind AI turns the way you talk about games into the way you discover and create them. No menus to memorize. No endless scrolling. Just describe it, discover it, play it.</p></div><div className="grid md:grid-cols-2 gap-5 mb-12"><div className="glass-card p-7"><Sparkles className="w-6 h-6 text-neon-purple mb-4" /><h2 className="font-display text-xl font-bold text-white mb-3">AI-native discovery</h2><p className="text-sm text-slate-400 leading-relaxed">GameMind interprets natural language so you can search by mood, time, group size, difficulty, and the specific feeling you want from a game.</p></div><div className="glass-card p-7"><Brain className="w-6 h-6 text-neon-cyan mb-4" /><h2 className="font-display text-xl font-bold text-white mb-3">Explainable by design</h2><p className="text-sm text-slate-400 leading-relaxed">Recommendations are not black boxes. Every match includes a breakdown of genre, gameplay, mood, difficulty, and platform fit.</p></div></div><TechSection /></div>; }

function Footer() { return <footer className="border-t border-white/10 mt-12"><div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center"><Brain className="w-4 h-4 text-white" /></div><span className="font-display font-bold text-white">GameMind <span className="gradient-text-cyan">AI</span></span></div><p className="text-xs text-slate-500">A hackathon prototype. Powered by imagination.</p><div className="flex items-center gap-3 text-slate-500"><Github className="w-4 h-4 hover:text-white transition-colors" /><Twitter className="w-4 h-4 hover:text-white transition-colors" /><Instagram className="w-4 h-4 hover:text-white transition-colors" /><Linkedin className="w-4 h-4 hover:text-white transition-colors" /></div></div></footer>; }

function SignInModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) { return <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}><div className="glass-strong rounded-2xl p-6 w-full max-w-sm animate-scale-in" onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><div><h2 className="font-display text-xl font-bold text-white">Welcome back</h2><p className="text-xs text-slate-400 mt-1">Sign in to sync your taste profile.</p></div><button onClick={onClose} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button></div><div className="space-y-3"><input type="email" placeholder="Email address" className="w-full glass rounded-lg px-3 py-3 text-sm text-white placeholder-slate-500 outline-none" /><input type="password" placeholder="Password" className="w-full glass rounded-lg px-3 py-3 text-sm text-white placeholder-slate-500 outline-none" /><button onClick={onSubmit} className="btn-primary w-full py-3 mt-2"><Check className="w-4 h-4" /> Sign In</button></div><p className="text-center text-[11px] text-slate-600 mt-4">Demo sign-in — no account required</p></div></div>; }

export default App;

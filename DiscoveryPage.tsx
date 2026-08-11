import { useState, useEffect } from 'react';
import { Brain, Sparkles, Search, Filter, ChevronDown, X } from 'lucide-react';
import type { Game, ScoredGame, GameAnalysis } from '@/types';
import { analyzePrompt, scoreGames } from '@/lib/aiEngine';
import { GameCard } from './GameCard';
import { MatchScore } from './ui/MatchScore';
import { ProgressBar } from './ui/ProgressBar';

interface DiscoveryPageProps {
  initialPrompt: string;
  onNavigateGame: (game: Game) => void;
  onAddToLibrary: (game: Game) => void;
}

export function DiscoveryPage({ initialPrompt, onNavigateGame, onAddToLibrary }: DiscoveryPageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null);
  const [results, setResults] = useState<ScoredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<ScoredGame | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    runAnalysis(initialPrompt);
  }, [initialPrompt]);

  const runAnalysis = (p: string) => {
    setLoading(true);
    setPrompt(p);
    setTimeout(() => {
      setAnalysis(analyzePrompt(p));
      setResults(scoreGames(p));
      setLoading(false);
    }, 1400);
  };

  const analysisTags = analysis ? [
    { label: 'Genre', value: analysis.genre },
    { label: 'Mode', value: analysis.mode },
    { label: 'Setting', value: analysis.setting },
    { label: 'Combat', value: analysis.combat },
    { label: 'Visual Style', value: analysis.visualStyle },
    { label: 'Weapons', value: analysis.weapons },
    { label: 'Player Count', value: analysis.playerCount },
    { label: 'Mood', value: analysis.mood },
    { label: 'Pace', value: analysis.pace },
  ] : [];

  return (
    <div className="min-h-screen pb-20">
      {/* AI Understanding */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-neon-cyan mb-4">
            <Brain className="w-3.5 h-3.5" />
            AI Understanding
          </div>
          <h2 className="section-title mb-2">Analyzing your request</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            <span className="text-neon-purple font-medium">"{prompt}"</span>
          </p>
        </div>

        {loading ? (
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border-2 border-neon-purple border-t-transparent animate-spin" />
              <span className="text-slate-400 text-sm">AI is understanding your request…</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 skeleton rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto animate-scale-in">
            <div className="flex flex-wrap gap-2 justify-center">
              {analysisTags.map((tag, i) => (
                <div
                  key={tag.label}
                  className="glass rounded-lg px-3 py-2 animate-bounce-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block">{tag.label}</span>
                  <span className="text-sm font-semibold text-white">{tag.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Results count */}
      {!loading && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-slate-400 text-sm">
                I found <span className="text-white font-bold text-lg">{results.length}</span> games matching your description.
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost text-sm py-2"
            >
              <Filter className="w-4 h-4" /> Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="glass-card p-4 mb-6 animate-scale-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Genre', options: ['All', 'FPS', 'RPG', 'Puzzle', 'Strategy'] },
                  { label: 'Platform', options: ['All', 'PC', 'PlayStation', 'Xbox'] },
                  { label: 'Multiplayer', options: ['All', 'Single-player', 'Multiplayer', 'Co-op'] },
                  { label: 'Difficulty', options: ['All', 'Easy', 'Medium', 'Hard'] },
                ].map((filter) => (
                  <div key={filter.label}>
                    <label className="text-xs text-slate-500 uppercase tracking-wide block mb-1.5">{filter.label}</label>
                    <select className="w-full glass rounded-lg px-3 py-2 text-sm text-white outline-none border-white/10">
                      {filter.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-ink-800">{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((scored, i) => (
              <GameCard
                key={scored.game.id}
                scored={scored}
                index={i}
                onView={() => onNavigateGame(scored.game)}
                onAdd={() => onAddToLibrary(scored.game)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Score breakdown modal */}
      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedGame(null)}>
          <div className="glass-strong rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-white text-xl">{selectedGame.game.title}</h3>
                <p className="text-sm text-slate-400">AI Match Breakdown</p>
              </div>
              <button onClick={() => setSelectedGame(null)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <MatchScore value={selectedGame.match} size={140} />
            </div>
            <div className="space-y-3">
              <ProgressBar label="Genre" value={selectedGame.breakdown.genre} delay={0} />
              <ProgressBar label="Gameplay" value={selectedGame.breakdown.gameplay} delay={100} />
              <ProgressBar label="Mood" value={selectedGame.breakdown.mood} delay={200} />
              <ProgressBar label="Difficulty" value={selectedGame.breakdown.difficulty} delay={300} />
              <ProgressBar label="Platform" value={selectedGame.breakdown.platform} delay={400} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

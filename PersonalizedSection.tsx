import { Heart, TrendingUp, Compass, Activity } from 'lucide-react';
import type { Game, TasteProfile } from '@/types';
import { ProgressBar } from './ui/ProgressBar';

interface PersonalizedSectionProps {
  taste: TasteProfile;
  recommendations: Game[];
  onNavigateGame: (game: Game) => void;
}

export function PersonalizedSection({ taste, recommendations, onNavigateGame }: PersonalizedSectionProps) {
  const fastPaced = recommendations.filter((g) => g.mood.includes('Intense') || g.mood.includes('Thrilling')).slice(0, 4);
  const favoriteGenres = Object.entries(taste)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const genreColors: Record<string, string> = {
    Action: 'from-neon-purple to-neon-pink',
    RPG: 'from-neon-blue to-neon-cyan',
    Strategy: 'from-emerald-500 to-teal-400',
    Puzzle: 'from-amber-500 to-orange-400',
    Horror: 'from-rose-500 to-red-400',
    Racing: 'from-cyan-400 to-blue-400',
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-neon-purple mb-4">
          <Heart className="w-3.5 h-3.5" />
          Personalized For You
        </div>
        <h2 className="section-title mb-2">Made for <span className="gradient-text">You</span></h2>
        <p className="text-slate-400 text-sm">Your taste profile gets smarter with every interaction.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Taste Profile */}
        <div className="glass-card p-6 lg:col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-display font-bold text-white">Taste Profile</h3>
          </div>
          <div className="space-y-4">
            {favoriteGenres.map(([genre, value], i) => (
              <ProgressBar
                key={genre}
                label={genre}
                value={value}
                color={genreColors[genre] || 'from-neon-purple to-neon-cyan'}
                delay={i * 100}
              />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500">
              Profile updates as you discover and save games. The more you explore, the smarter recommendations become.
            </p>
          </div>
        </div>

        {/* Because you like fast-paced games */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-neon-purple" />
            <h3 className="font-display font-bold text-white">Because you like fast-paced games</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fastPaced.map((game, i) => (
              <button
                key={game.id}
                onClick={() => onNavigateGame(game)}
                className="glass-card glass-card-hover overflow-hidden text-left group animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={game.artwork} alt={game.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="aspect-[3/4] bg-gradient-to-t from-ink-950 to-transparent absolute" />
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-white truncate">{game.title}</p>
                  <p className="text-[10px] text-slate-400">{game.genres[0]}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Favorite genres */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-display font-bold text-white">Your favorite genres</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {favoriteGenres.map(([genre, value]) => (
                <div key={genre} className="glass-card px-4 py-3 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genreColors[genre] || 'from-neon-purple to-neon-cyan'} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{value}</span>
                  </div>
                  <span className="font-medium text-white">{genre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Continue exploring */}
      <div className="mt-12">
        <h3 className="font-display font-bold text-white text-xl mb-4">Continue exploring</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {recommendations.map((game, i) => (
            <button
              key={game.id}
              onClick={() => onNavigateGame(game)}
              className="glass-card glass-card-hover shrink-0 w-64 overflow-hidden text-left group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={game.artwork} alt={game.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-white truncate">{game.title}</p>
                <p className="text-xs text-slate-400">{game.genres.join(' · ')}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

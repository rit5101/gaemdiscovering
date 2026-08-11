import { useState } from 'react';
import { Star, Plus, Eye, Sparkles, Users, User } from 'lucide-react';
import type { ScoredGame } from '@/types';
import { MatchScore } from './ui/MatchScore';

interface GameCardProps {
  scored: ScoredGame;
  onView: () => void;
  onAdd: () => void;
  index?: number;
}

export function GameCard({ scored, onView, onAdd, index = 0 }: GameCardProps) {
  const { game, match } = scored;
  const [showReasons, setShowReasons] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd();
  };

  return (
    <div
      className="glass-card glass-card-hover group relative overflow-hidden animate-fade-up flex flex-col"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Artwork */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={game.artwork}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />

        {/* Match score badge */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <MatchScore value={match} size={56} strokeWidth={4} label="" />
          </div>
        </div>

        {/* Multiplayer indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md glass-strong text-[10px] font-medium text-white">
          {game.multiplayer === 'Single-player' ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
          {game.multiplayer}
        </div>

        {/* Hover overlay actions */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onView}
            className="btn-primary text-sm py-2 px-4"
          >
            <Eye className="w-4 h-4" /> View Game
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-white text-lg leading-tight group-hover:gradient-text transition-all">
            {game.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-amber-400 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-mono font-semibold">{game.rating}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-2">
          {game.genres.join(' · ')} · {game.releaseYear} · {game.platforms.slice(0, 2).join(', ')}
        </p>

        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{game.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
              {tag}
            </span>
          ))}
        </div>

        {/* AI explanation toggle */}
        <button
          onClick={() => setShowReasons(!showReasons)}
          className="flex items-center gap-1.5 text-xs text-neon-cyan hover:text-cyan-300 transition-colors mb-3"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Why AI recommends this
        </button>

        {showReasons && (
          <div className="glass rounded-lg p-3 mb-3 animate-scale-in">
            <ul className="space-y-1.5">
              {scored.reasons.map((reason, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-neon-purple mt-0.5">▸</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button onClick={onView} className="btn-ghost text-sm flex-1 py-2">
            <Eye className="w-4 h-4" /> View
          </button>
          <button
            onClick={handleAdd}
            disabled={added}
            className={`btn-ghost text-sm flex-1 py-2 ${added ? 'opacity-50 cursor-default' : ''}`}
          >
            {added ? (
              <>Added</>
            ) : (
              <><Plus className="w-4 h-4" /> Add to Library</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-[16/10] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-2/3 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-full skeleton rounded-lg" />
          <div className="h-8 w-full skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}

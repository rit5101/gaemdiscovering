import { ArrowLeft, Bookmark, Calendar, Check, Clock3, Gamepad2, Heart, Monitor, Play, Share2, Star, Users, X } from 'lucide-react';
import type { Game } from '@/types';
import { getSimilarGames } from '@/data/games';
import { MatchScore } from './ui/MatchScore';

interface GameDetailsPageProps {
  game: Game;
  onBack: () => void;
  onAdd: () => void;
  onSelectSimilar: (game: Game) => void;
  onToast: (message: string) => void;
}

export function GameDetailsPage({ game, onBack, onAdd, onSelectSimilar, onToast }: GameDetailsPageProps) {
  const similar = getSimilarGames(game).slice(0, 4);
  return (
    <div className="pb-20 animate-fade-in">
      <div className="relative h-[360px] md:h-[460px] overflow-hidden">
        <img src={game.artwork} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/10" />
        <button onClick={onBack} className="absolute top-6 left-4 md:left-8 btn-ghost text-sm py-2"><ArrowLeft className="w-4 h-4" /> Back</button>
        <div className="absolute bottom-8 left-4 md:left-8 right-4 max-w-7xl mx-auto"><div className="flex items-end gap-6"><div className="flex-1"><div className="flex flex-wrap gap-2 mb-3">{game.tags.slice(0, 4).map((tag) => <span key={tag} className="tag bg-neon-purple/20 text-neon-purple border border-neon-purple/30">{tag}</span>)}</div><h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-2">{game.title}</h1><p className="text-slate-300 text-sm md:text-base">{game.developer} · {game.releaseYear} · {game.rating} / 5 rating</p></div><MatchScore value={94} size={110} /></div></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-1">
        <div className="flex flex-wrap gap-3 py-6 border-b border-white/10"><button onClick={() => onToast('Launching demo view.')} className="btn-primary"><Play className="w-4 h-4 fill-white" /> Play / View Game</button><button onClick={onAdd} className="btn-ghost"><Bookmark className="w-4 h-4" /> Add to Library</button><button onClick={() => onToast('Marked as not interested.')} className="btn-ghost"><X className="w-4 h-4" /> Not Interested</button><button onClick={() => onToast('Share link copied to clipboard.')} className="btn-ghost"><Share2 className="w-4 h-4" /> Share</button></div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 pt-8">
          <div className="space-y-10"><section><h2 className="section-title text-xl mb-4">Why You’ll Like It</h2><div className="grid sm:grid-cols-2 gap-3">{game.whyYoullLike.map((reason) => <div key={reason} className="glass-card p-4 flex items-start gap-3"><Check className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" /><span className="text-sm text-slate-300">{reason}</span></div>)}</div></section><section><h2 className="section-title text-xl mb-3">AI Summary</h2><div className="glass-card p-5 border-neon-purple/20"><p className="text-slate-300 leading-relaxed">{game.aiSummary}</p></div></section><section><h2 className="section-title text-xl mb-3">Gameplay</h2><p className="text-slate-400 leading-relaxed">{game.gameplay}</p></section><section><h2 className="section-title text-xl mb-4">User Reviews</h2><div className="grid md:grid-cols-2 gap-3">{game.reviews.map((review) => <div key={review.author} className="glass-card p-4"><div className="flex justify-between mb-2"><span className="font-medium text-white text-sm">{review.author}</span><span className="flex items-center gap-1 text-amber-400 text-xs"><Star className="w-3 h-3 fill-amber-400" />{review.rating}</span></div><p className="text-sm text-slate-400">{review.text}</p></div>)}</div></section></div>
          <aside><div className="glass-card p-5 sticky top-24"><h3 className="font-display font-bold text-white mb-4">Game Info</h3><div className="space-y-4 text-sm"><InfoRow icon={Gamepad2} label="Genre" value={game.genres.join(' · ')} /><InfoRow icon={Monitor} label="Platforms" value={game.platforms.join(', ')} /><InfoRow icon={Users} label="Players" value={game.multiplayer} /><InfoRow icon={Calendar} label="Release date" value={`${game.releaseYear}`} /><InfoRow icon={Clock3} label="Playtime" value={game.playtime} /><InfoRow icon={Heart} label="Difficulty" value={game.difficulty} /></div><div className="mt-5 pt-4 border-t border-white/10"><p className="text-xs text-slate-500 mb-2">Available for</p><p className="text-xl font-bold text-white">{game.price}</p></div></div></aside>
        </div>
        {similar.length > 0 && <section className="mt-12"><h2 className="section-title text-xl mb-4">Similar Games</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{similar.map((item) => <button key={item.id} onClick={() => onSelectSimilar(item)} className="glass-card glass-card-hover overflow-hidden text-left group"><div className="aspect-video overflow-hidden"><img src={item.artwork} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div><div className="p-3"><p className="text-sm font-semibold text-white truncate">{item.title}</p><p className="text-xs text-slate-400">{item.genres.join(' · ')}</p></div></button>)}</div></section>}
      </div>
    </div>
  );
}
function InfoRow({ icon: Icon, label, value }: { icon: typeof Gamepad2; label: string; value: string }) { return <div className="flex items-start gap-3"><Icon className="w-4 h-4 text-neon-purple mt-0.5" /><div><p className="text-xs text-slate-500">{label}</p><p className="text-slate-200">{value}</p></div></div>; }

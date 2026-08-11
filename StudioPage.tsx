import { useState, useEffect } from 'react';
import { Sparkles, Wand2, Check, Play, Share2, Bookmark, ChevronDown, SlidersHorizontal, Gamepad2 } from 'lucide-react';
import { SpaceShooterGame } from './SpaceShooterGame';
import type { CreatedGame } from '@/types';

interface StudioPageProps {
  initialPrompt?: string;
  onSaveCreated: (game: CreatedGame) => void;
  onToast: (message: string) => void;
}

const steps = [
  'Understanding game concept',
  'Designing game mechanics',
  'Creating game world',
  'Generating assets',
  'Creating gameplay logic',
  'Balancing difficulty',
  'Preparing playable prototype',
];

export function StudioPage({ initialPrompt = '', onSaveCreated, onToast }: StudioPageProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [genre, setGenre] = useState('Survival');
  const [style, setStyle] = useState('Neon');
  const [difficulty, setDifficulty] = useState('Medium');
  const [players, setPlayers] = useState('Single Player');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!generating) return;
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 1, 100);
        if (next === 100) {
          window.clearInterval(timer);
          setTimeout(() => {
            setGenerating(false);
            setReady(true);
          }, 500);
        }
        return next;
      });
    }, 55);
    return () => window.clearInterval(timer);
  }, [generating]);

  const generate = () => {
    if (!prompt.trim()) {
      onToast('Describe your game idea first.');
      return;
    }
    setGenerating(true);
    setReady(false);
    setProgress(0);
  };

  const saveGame = () => {
    const created: CreatedGame = {
      id: `created-${Date.now()}`,
      title: 'Neon Survivor',
      description: 'Survive waves of enemies, collect energy, and upgrade your spaceship.',
      genre,
      style,
      difficulty,
      players,
      createdAt: Date.now(),
    };
    onSaveCreated(created);
    onToast('Neon Survivor saved to your library.');
  };

  if (playing) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-20 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-neon-cyan text-xs uppercase tracking-widest mb-2"><Gamepad2 className="w-4 h-4" /> Playing prototype</div>
            <h1 className="font-display text-3xl font-bold text-white">Neon Survivor</h1>
          </div>
          <button className="btn-ghost text-sm" onClick={() => setPlaying(false)}>Exit Game</button>
        </div>
        <SpaceShooterGame />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-neon-purple mb-4"><Wand2 className="w-3.5 h-3.5" /> AI GAME STUDIO</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Imagine a game. <span className="gradient-text">AI builds the prototype.</span></h1>
          <p className="text-slate-400 leading-relaxed">Describe a world, a mechanic, or a feeling. GameMind turns your idea into something you can actually play.</p>
        </div>

        {!generating && !ready && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 max-w-5xl mx-auto animate-fade-up">
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-neon-purple" /><h2 className="font-display text-xl font-bold text-white">Describe your game</h2></div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the game you want to create…"
                className="w-full min-h-48 resize-none rounded-xl glass bg-black/20 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-neon-purple/60 transition-colors leading-relaxed"
              />
              <p className="text-xs text-slate-500 mt-3">Example: Create a 2D space survival game where the player controls a spaceship, avoids asteroids, collects energy, and survives increasingly difficult waves of enemies.</p>
              <button onClick={generate} className="btn-primary w-full mt-6 py-3.5"><Sparkles className="w-4 h-4" /> Generate Game</button>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-5"><SlidersHorizontal className="w-4 h-4 text-neon-cyan" /><h3 className="font-display font-bold text-white">Customize</h3></div>
              <div className="space-y-5">
                <OptionSelect label="Genre" value={genre} onChange={setGenre} options={['Platformer', 'Shooter', 'Puzzle', 'RPG', 'Survival', 'Racing']} />
                <OptionSelect label="Style" value={style} onChange={setStyle} options={['Pixel Art', '2D', '3D', 'Neon', 'Cartoon', 'Minimal']} />
                <OptionSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={['Easy', 'Medium', 'Hard']} />
                <OptionSelect label="Players" value={players} onChange={setPlayers} options={['Single Player', 'Multiplayer']} />
              </div>
            </div>
          </div>
        )}

        {generating && (
          <div className="max-w-2xl mx-auto glass-card p-6 md:p-10 animate-scale-in">
            <div className="text-center mb-8"><div className="relative w-24 h-24 mx-auto mb-5"><div className="absolute inset-0 rounded-full border-2 border-neon-purple/20" /><div className="absolute inset-1 rounded-full border-2 border-transparent border-t-neon-purple border-r-neon-cyan animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-8 h-8 text-neon-purple animate-pulse" /></div></div><h2 className="font-display text-2xl font-bold text-white">Building your game</h2><p className="text-slate-400 text-sm mt-2">GameMind is bringing your idea to life…</p></div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-8"><div className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            <div className="space-y-3">{steps.map((step, i) => { const stepProgress = (i + 1) / steps.length * 100; const complete = progress >= stepProgress; const active = progress >= i / steps.length * 100 && !complete; return <div key={step} className={`flex items-center gap-3 text-sm transition-all duration-300 ${complete ? 'text-white' : active ? 'text-neon-cyan' : 'text-slate-600'}`}><div className={`w-6 h-6 rounded-full flex items-center justify-center border ${complete ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400' : active ? 'border-neon-cyan/50' : 'border-white/10'}`}>{complete ? <Check className="w-3.5 h-3.5" /> : active ? <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" /> : <span className="text-[10px]">{i + 1}</span>}</div>{step}<span className="ml-auto text-xs font-mono text-slate-500">{complete ? 'DONE' : active ? 'WORKING' : ''}</span></div>; })}</div>
          </div>
        )}

        {ready && (
          <div className="max-w-5xl mx-auto animate-scale-in">
            <div className="glass-card overflow-hidden neon-border">
              <div className="relative h-56 md:h-72 overflow-hidden"><img src="https://images.pexels.com/photos/28494632/pexels-photo-28494632.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Neon game world" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" /><div className="absolute bottom-6 left-6 md:left-8"><div className="flex items-center gap-2 text-neon-cyan text-xs uppercase tracking-widest mb-2"><Check className="w-4 h-4" /> Your game is ready</div><h2 className="font-display text-3xl md:text-4xl font-bold text-white">Neon Survivor</h2></div></div>
              <div className="p-6 md:p-8"><div className="grid md:grid-cols-[1fr_auto] gap-6 items-start"><div><p className="text-slate-300 mb-4">Survive waves of enemies, collect energy, and upgrade your spaceship.</p><div className="flex flex-wrap gap-2"><span className="tag bg-neon-purple/10 text-neon-purple border border-neon-purple/20">{genre}</span><span className="tag bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">{style}</span><span className="tag bg-white/5 text-slate-300 border border-white/10">{difficulty}</span><span className="tag bg-white/5 text-slate-300 border border-white/10">{players}</span></div></div><div className="flex flex-wrap gap-2"><button onClick={() => setPlaying(true)} className="btn-primary"><Play className="w-4 h-4 fill-white" /> Play Now</button><button onClick={() => onToast('Share link copied to clipboard.')} className="btn-ghost"><Share2 className="w-4 h-4" /> Share</button><button onClick={saveGame} className="btn-ghost"><Bookmark className="w-4 h-4" /> Save</button></div></div></div>
            </div>
            <button onClick={() => { setReady(false); setPrompt(''); }} className="block mx-auto mt-6 text-sm text-slate-500 hover:text-white transition-colors">Create another game <ChevronDown className="inline w-4 h-4 rotate-[-90deg]" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="block"><span className="text-xs uppercase tracking-wider text-slate-500 block mb-2">{label}</span><div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none glass rounded-lg px-3 py-2.5 text-sm text-white outline-none border-white/10"><option className="bg-ink-800">{options[0]}</option>{options.slice(1).map((option) => <option key={option} className="bg-ink-800">{option}</option>)}</select><ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" /></div></label>;
}

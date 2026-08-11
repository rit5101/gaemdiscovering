import { useState, useEffect, useRef } from 'react';
import { Sparkles, Gamepad2, Search, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onFindGame: (prompt: string) => void;
  onCreateGame: (prompt: string) => void;
  onDemoMode: () => void;
}

const exampleChips = [
  'Relaxing puzzle game',
  'Cyberpunk FPS',
  'Co-op survival',
  'Story-driven RPG',
  'Indie games under 10 hours',
];

export function Hero({ onFindGame, onCreateGame, onDemoMode }: HeroProps) {
  const [prompt, setPrompt] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated AI visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${0.4 + n.r * 0.2})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleFind = () => {
    if (prompt.trim()) onFindGame(prompt);
  };

  const handleCreate = () => {
    if (prompt.trim()) onCreateGame(prompt);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg" />

      {/* AI visualization canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong text-xs font-medium text-neon-cyan mb-8 animate-fade-down">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          AI-Powered Game Discovery & Creation
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up">
          Your next game starts with{' '}
          <span className="gradient-text neon-text">a sentence.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-delay-200">
          Tell our AI what you feel like playing. GameMind understands your preferences, discovers the best games for you, and can even turn your idea into a playable prototype.
        </p>

        {/* AI Search Input */}
        <div className="relative max-w-2xl mx-auto animate-fade-up animate-delay-300">
          <div className="relative glass-strong rounded-2xl p-1.5 neon-border">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3 pl-4">
                <Sparkles className="w-5 h-5 text-neon-purple shrink-0" />
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFind()}
                  placeholder="What do you want to play?"
                  className="w-full bg-transparent text-white placeholder-slate-500 py-3.5 outline-none text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 p-1.5">
              <button onClick={handleFind} className="btn-primary flex-1 py-3 text-sm">
                <Sparkles className="w-4 h-4" /> Find My Game
              </button>
              <button onClick={handleCreate} className="btn-cyan flex-1 py-3 text-sm">
                <Gamepad2 className="w-4 h-4" /> Create My Game
              </button>
            </div>
          </div>

          {/* Placeholder hint */}
          <p className="text-xs text-slate-500 mt-3 text-left pl-2">
            Try: A fast-paced cyberpunk multiplayer shooter with futuristic weapons…
          </p>
        </div>

        {/* Example chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-up animate-delay-500">
          {exampleChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(chip)}
              className="chip"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Demo mode button */}
        <div className="mt-10 animate-fade-up animate-delay-700">
          <button
            onClick={onDemoMode}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            <Zap className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
            <span className="underline decoration-dotted underline-offset-4">Try Demo Mode — see the full flow instantly</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

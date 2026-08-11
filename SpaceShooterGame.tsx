import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Heart, Zap, Trophy } from 'lucide-react';

interface GameProps {
  onScore?: (score: number) => void;
}

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface Bullet extends Entity {}
interface Enemy extends Entity {
  hp: number;
  type: number;
}

export function SpaceShooterGame({ onScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const stateRef = useRef({
    player: { x: 0, y: 0, r: 12 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    keys: {} as Record<string, boolean>,
    score: 0,
    health: 100,
    level: 1,
    enemyTimer: 0,
    enemyInterval: 60,
    paused: false,
    gameOver: false,
    started: false,
    width: 600,
    height: 400,
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.player = { x: s.width / 2, y: s.height - 40, r: 12 };
    s.bullets = [];
    s.enemies = [];
    s.particles = [];
    s.score = 0;
    s.health = 100;
    s.level = 1;
    s.enemyTimer = 0;
    s.enemyInterval = 60;
    s.paused = false;
    s.gameOver = false;
    s.started = true;
    setScore(0);
    setHealth(100);
    setLevel(1);
    setPaused(false);
    setGameOver(false);
    setStarted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      stateRef.current.width = rect.width;
      stateRef.current.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const onKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let raf: number;

    const spawnEnemy = () => {
      const s = stateRef.current;
      const type = Math.random() < 0.2 ? 1 : 0;
      s.enemies.push({
        x: Math.random() * (s.width - 40) + 20,
        y: -20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1 + s.level * 0.3 + Math.random(),
        r: type ? 16 : 12,
        hp: type ? 3 : 1,
        type,
      });
    };

    const createExplosion = (x: number, y: number, color: string) => {
      const s = stateRef.current;
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        s.particles.push({
          x, y,
          vx: Math.cos(angle) * (2 + Math.random() * 2),
          vy: Math.sin(angle) * (2 + Math.random() * 2),
          life: 30,
          color,
        });
      }
    };

    const update = () => {
      const s = stateRef.current;
      if (s.paused || s.gameOver || !s.started) return;

      // Player movement
      const speed = 4;
      if (s.keys['arrowleft'] || s.keys['a']) s.player.x -= speed;
      if (s.keys['arrowright'] || s.keys['d']) s.player.x += speed;
      if (s.keys['arrowup'] || s.keys['w']) s.player.y -= speed;
      if (s.keys['arrowdown'] || s.keys['s']) s.player.y += speed;
      s.player.x = Math.max(s.player.r, Math.min(s.width - s.player.r, s.player.x));
      s.player.y = Math.max(s.player.r, Math.min(s.height - s.player.r, s.player.y));

      // Shooting
      if (s.keys[' '] || s.keys['enter']) {
        if (s.bullets.length === 0 || s.bullets[s.bullets.length - 1].y < s.player.y - 30) {
          s.bullets.push({ x: s.player.x, y: s.player.y - 15, vx: 0, vy: -7, r: 3 });
        }
      }

      // Update bullets
      s.bullets = s.bullets.filter((b) => {
        b.y += b.vy;
        return b.y > -10;
      });

      // Spawn enemies
      s.enemyTimer++;
      if (s.enemyTimer >= s.enemyInterval) {
        s.enemyTimer = 0;
        spawnEnemy();
      }

      // Update enemies
      s.enemies = s.enemies.filter((e) => {
        e.x += e.vx;
        e.y += e.vy;
        if (e.x < e.r || e.x > s.width - e.r) e.vx *= -1;

        // Collision with player
        const dx = e.x - s.player.x;
        const dy = e.y - s.player.y;
        if (Math.sqrt(dx * dx + dy * dy) < e.r + s.player.r) {
          s.health -= e.type ? 20 : 10;
          createExplosion(e.x, e.y, '#ec4899');
          setHealth(Math.max(0, s.health));
          if (s.health <= 0) {
            s.gameOver = true;
            setGameOver(true);
            onScore?.(s.score);
          }
          return false;
        }

        return e.y < s.height + 20;
      });

      // Bullet-enemy collision
      s.bullets = s.bullets.filter((b) => {
        for (let i = 0; i < s.enemies.length; i++) {
          const e = s.enemies[i];
          const dx = b.x - e.x;
          const dy = b.y - e.y;
          if (Math.sqrt(dx * dx + dy * dy) < e.r + b.r) {
            e.hp--;
            if (e.hp <= 0) {
              createExplosion(e.x, e.y, e.type ? '#a855f7' : '#22d3ee');
              s.enemies.splice(i, 1);
              s.score += e.type ? 30 : 10;
              setScore(s.score);
              // Level up every 100 points
              const newLevel = Math.floor(s.score / 100) + 1;
              if (newLevel > s.level) {
                s.level = newLevel;
                s.enemyInterval = Math.max(20, 60 - newLevel * 5);
                setLevel(newLevel);
              }
            }
            return false;
          }
        }
        return true;
      });

      // Update particles
      s.particles = s.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life--;
        return p.life > 0;
      });
    };

    const draw = () => {
      const s = stateRef.current;
      ctx.fillStyle = '#06060a';
      ctx.fillRect(0, 0, s.width, s.height);

      // Starfield
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let i = 0; i < 30; i++) {
        const x = (i * 37 + Date.now() * 0.01) % s.width;
        const y = (i * 53) % s.height;
        ctx.fillRect(x, y, 1, 1);
      }

      if (!s.started) {
        ctx.fillStyle = 'rgba(168,85,247,0.8)';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press Play to Start', s.width / 2, s.height / 2);
        raf = requestAnimationFrame(loop);
        return;
      }

      // Particles
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Bullets
      s.bullets.forEach((b) => {
        ctx.fillStyle = '#22d3ee';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#22d3ee';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Enemies
      s.enemies.forEach((e) => {
        const color = e.type ? '#a855f7' : '#ec4899';
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        // Inner detail
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(e.x - e.r * 0.3, e.y - e.r * 0.3, e.r * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Player ship
      ctx.save();
      ctx.translate(s.player.x, s.player.y);
      ctx.fillStyle = '#22d3ee';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#22d3ee';
      ctx.beginPath();
      ctx.moveTo(0, -s.player.r);
      ctx.lineTo(s.player.r, s.player.r);
      ctx.lineTo(0, s.player.r * 0.5);
      ctx.lineTo(-s.player.r, s.player.r);
      ctx.closePath();
      ctx.fill();
      // Engine glow
      ctx.fillStyle = 'rgba(168,85,247,0.6)';
      ctx.beginPath();
      ctx.arc(0, s.player.r, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;

      if (s.paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, s.width, s.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', s.width / 2, s.height / 2);
      }

      if (s.gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, s.width, s.height);
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', s.width / 2, s.height / 2 - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Score: ${s.score}`, s.width / 2, s.height / 2 + 20);
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onScore]);

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-white">{score}</span>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-300" style={{ width: `${health}%` }} />
            </div>
          </div>
          <div className="glass-card px-3 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="font-mono font-bold text-white">Lvl {level}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {!started ? (
            <button onClick={resetGame} className="btn-primary text-sm py-2">
              <Play className="w-4 h-4" /> Play
            </button>
          ) : (
            <>
              <button
                onClick={() => { setPaused(!paused); stateRef.current.paused = !paused; }}
                className="btn-ghost text-sm py-2"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={resetGame} className="btn-ghost text-sm py-2">
                <RotateCcw className="w-4 h-4" /> Restart
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative glass-strong rounded-2xl overflow-hidden neon-border">
        <canvas ref={canvasRef} className="w-full h-[400px] block" />
      </div>

      {/* Instructions */}
      <div className="glass-card p-4">
        <h4 className="text-sm font-bold text-white mb-2">How to Play</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-400">
          <div><kbd className="px-1.5 py-0.5 rounded glass text-white text-[10px]">WASD</kbd> / <kbd className="px-1.5 py-0.5 rounded glass text-white text-[10px]">Arrows</kbd> — Move ship</div>
          <div><kbd className="px-1.5 py-0.5 rounded glass text-white text-[10px]">Space</kbd> — Shoot</div>
          <div>Destroy enemies for points</div>
          <div>Avoid collisions — protect your health</div>
        </div>
      </div>
    </div>
  );
}

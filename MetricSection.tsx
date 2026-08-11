import { useEffect, useState, useRef } from 'react';
import { Database, Target, Lightbulb, Clock } from 'lucide-react';

const metrics = [
  { icon: Database, value: 10000, suffix: '+', label: 'Games Analyzed', color: 'text-neon-purple' },
  { icon: Target, value: 95, suffix: '%', label: 'Recommendation Accuracy', color: 'text-neon-cyan' },
  { icon: Lightbulb, value: 1000, suffix: '+', label: 'AI Game Concepts', color: 'text-neon-blue' },
  { icon: Clock, value: 24, suffix: '/7', label: 'AI Discovery', color: 'text-neon-pink' },
];

function useCountUp(target: number, duration = 1500, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);
  return value;
}

function MetricCard({ icon: Icon, value, suffix, label, color, start }: { icon: typeof Database; value: number; suffix: string; label: string; color: string; start: boolean }) {
  const count = useCountUp(value, 1500, start);
  return (
    <div className="glass-card glass-card-hover p-6 text-center">
      <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export function MetricSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="section-title mb-2">Powered by AI. <span className="gradient-text-cyan">Built for gamers.</span></h2>
        <p className="text-slate-400 text-sm">Demo metrics showcasing platform capabilities.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} start={visible} />
        ))}
      </div>
    </section>
  );
}

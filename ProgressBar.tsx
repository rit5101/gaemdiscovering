import { useEffect, useState } from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
}

export function ProgressBar({ label, value, color = 'from-neon-purple to-neon-cyan', delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay + 100);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%`, boxShadow: `0 0 10px rgba(168,85,247,0.4)` }}
        />
      </div>
    </div>
  );
}

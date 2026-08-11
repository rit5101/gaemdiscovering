import { useEffect, useState } from 'react';

interface MatchScoreProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animate?: boolean;
}

export function MatchScore({ value, size = 120, strokeWidth = 8, label = 'AI Match', animate = true }: MatchScoreProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (!animate) { setDisplayValue(value); return; }
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, animate]);

  const color = value >= 90 ? '#22d3ee' : value >= 75 ? '#a855f7' : value >= 60 ? '#8b5cf6' : '#64748b';

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-white" style={{ fontSize: size * 0.22 }}>
          {displayValue}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-slate-400">{label}</span>
      </div>
    </div>
  );
}

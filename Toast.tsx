import { useEffect } from 'react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import type { Toast as ToastType } from '@/types';

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    info: <Info className="w-5 h-5 text-neon-cyan" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    info: 'border-neon-cyan/30',
    error: 'border-rose-500/30',
  };

  return (
    <div
      className={`glass-strong ${borders[toast.type]} rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-up shadow-xl`}
    >
      {icons[toast.type]}
      <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

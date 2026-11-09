import React from 'react';
import { usePhotographer } from '../context/PhotographerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePhotographer();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all animate-slide-up ${
              isSuccess
                ? 'bg-zinc-950/95 border-zinc-700 text-white shadow-black/40'
                : isError
                ? 'bg-zinc-950/95 border-rose-900/60 text-white shadow-black/40'
                : 'bg-zinc-950/95 border-zinc-800 text-zinc-200 shadow-black/40'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-white" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-zinc-400" />}
            </div>
            <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-stone-200 transition-colors p-1 -mr-1 -mt-1"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

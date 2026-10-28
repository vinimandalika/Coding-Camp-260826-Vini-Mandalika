import { useApp } from '../context/AppContext';
import { Heart } from 'lucide-react';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                 bg-white/90 backdrop-blur-sm text-petal-600 px-5 py-3 rounded-full
                 shadow-xl shadow-pink-200/50 border border-pink-100 toast-enter
                 font-body font-semibold text-sm"
    >
      <Heart size={14} className="fill-petal-400 text-petal-400 animate-heart-beat" />
      {toast}
    </div>
  );
}

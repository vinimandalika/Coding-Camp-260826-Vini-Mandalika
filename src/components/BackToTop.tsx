import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-20 right-6 z-50 w-11 h-11 rounded-full
                 bg-gradient-to-br from-petal-300 to-blush-400 text-white text-xl
                 shadow-lg shadow-pink-300/50 hover:scale-110 active:scale-95
                 transition-all duration-200 flex items-center justify-center"
    >
      ♡
    </button>
  );
}

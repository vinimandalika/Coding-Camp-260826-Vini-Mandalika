import { useState } from 'react';
import { useFloatingHearts } from '../hooks/useFloatingHearts';
import { useApp } from '../context/AppContext';

interface Props {
  onEnter: () => void;
}

export default function WelcomePage({ onEnter }: Props) {
  const { settings } = useApp();
  const { spawnBurst } = useFloatingHearts();
  const [opening, setOpening] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    if (opening) return;
    setOpening(true);
    spawnBurst(e.clientX, e.clientY, 12);

    // Spawn more bursts across the screen
    setTimeout(() => spawnBurst(window.innerWidth * 0.25, window.innerHeight * 0.5, 8), 200);
    setTimeout(() => spawnBurst(window.innerWidth * 0.75, window.innerHeight * 0.5, 8), 400);
    setTimeout(() => spawnBurst(window.innerWidth * 0.5, window.innerHeight * 0.3, 10), 300);

    setTimeout(onEnter, 1400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
                  animated-bg transition-opacity duration-700
                  ${opening ? 'opacity-0' : 'opacity-100'}
                  `}
      style={{
        background: 'linear-gradient(135deg, #fff0f3 0%, #fce8f1 30%, #ffe8f4 60%, #fff3d1 100%)',
      }}
    >
      {/* Decorative sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {['✦','✧','⋆','✦','✧','⋆','✦','✧','⋆'].map((s, i) => (
          <span
            key={i}
            className="absolute text-pink-200 animate-sparkle"
            style={{
              left: `${8 + i * 11}%`,
              top: `${15 + (i % 3) * 25}%`,
              fontSize: `${12 + (i % 4) * 6}px`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Floating bunnies / hearts around */}
      <div className="absolute top-1/4 left-1/4 text-3xl animate-float-slow opacity-40" aria-hidden="true">🐰</div>
      <div className="absolute top-1/3 right-1/4 text-2xl animate-float opacity-40" style={{ animationDelay: '1s' }} aria-hidden="true">💕</div>
      <div className="absolute bottom-1/3 left-1/5 text-2xl animate-float-fast opacity-30" style={{ animationDelay: '2s' }} aria-hidden="true">🌸</div>
      <div className="absolute bottom-1/4 right-1/5 text-3xl animate-float-slow opacity-40" style={{ animationDelay: '0.5s' }} aria-hidden="true">✨</div>

      {/* Main card */}
      <div className="flex flex-col items-center gap-6 px-8 text-center max-w-lg">

        {/* Envelope */}
        <div
          className={`relative transition-all duration-700 ${opening ? 'scale-0 rotate-12 opacity-0' : 'scale-100'}`}
          aria-hidden="true"
        >
          {/* Envelope body */}
          <div className="relative w-36 h-24 mx-auto">
            {/* Envelope back */}
            <div
              className="absolute inset-0 rounded-2xl shadow-xl shadow-pink-200/60"
              style={{ background: 'linear-gradient(135deg, #ffd6e7 0%, #ffb3c6 100%)' }}
            />

            {/* Envelope flap */}
            <div
              className="absolute inset-x-0 top-0 h-12 rounded-t-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffadc9 0%, #ff91aa 100%)',
                clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
              }}
            />

            {/* Heart seal */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-9 h-9 bg-gradient-to-br from-petal-400 to-blush-500
                          rounded-full flex items-center justify-center text-white text-base
                          shadow-md animate-heart-beat"
            >
              ♡
            </div>

            {/* Envelope bottom V */}
            <div
              className="absolute inset-x-0 bottom-0 h-12 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffc0d0 0%, #ffadc9 100%)',
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
              }}
            />
          </div>

          {/* Bunny ears peeking */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce-soft">🐰</div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1
            className="font-display text-4xl md:text-5xl text-petal-600 text-shadow-soft leading-tight"
            style={{ fontStyle: 'italic' }}
          >
            {settings.siteTitle}
          </h1>
          <p className="font-body text-petal-400 text-lg">
            A Little Place Made of Love ♡
          </p>
          <p className="font-dancing text-petal-300 text-base italic">
            {settings.welcomeMessage || 'a tiny world for the softest feelings.'}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleOpen}
          disabled={opening}
          className="btn-primary text-base px-8 py-3.5 font-dancing text-lg
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          open my little world ♡
        </button>

        <p className="text-xs text-petal-300 font-body italic">
          ✧ crafted with love ✧
        </p>
      </div>
    </div>
  );
}

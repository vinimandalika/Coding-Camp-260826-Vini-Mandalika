import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useFloatingHearts } from '../hooks/useFloatingHearts';
import type { GardenFlower } from '../types';

const FLOWER_TYPES = [
  { emoji: '🌸', name: 'cherry blossom' },
  { emoji: '🌷', name: 'tulip' },
  { emoji: '🌺', name: 'hibiscus' },
  { emoji: '🌼', name: 'daisy' },
  { emoji: '🌻', name: 'sunflower' },
  { emoji: '💐', name: 'bouquet' },
  { emoji: '🌹', name: 'rose' },
  { emoji: '🪷', name: 'lotus' },
];

const DECORATIONS = ['🦋', '🐝', '🌿', '🍃', '✨', '⋆'];

function GardenFlowerEl({ flower, onClick }: { flower: GardenFlower; onClick: (e: React.MouseEvent) => void }) {
  const [bloomed, setBloomed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setBloomed(true);
    onClick(e);
    setTimeout(() => setBloomed(false), 600);
  };

  return (
    <div
      className={`absolute garden-flower select-none transition-transform duration-300 cursor-pointer
                  ${bloomed ? 'scale-150' : ''}`}
      style={{
        left: `${flower.x}%`,
        top: `${flower.y}%`,
        fontSize: `${flower.scale * 24}px`,
        transform: `rotate(${flower.rotation}deg) scale(${bloomed ? 1.5 : 1})`,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick(e as unknown as React.MouseEvent)}
      aria-label={`${FLOWER_TYPES[flower.type % FLOWER_TYPES.length].name} flower`}
    >
      {FLOWER_TYPES[flower.type % FLOWER_TYPES.length].emoji}
    </div>
  );
}

export default function LoveGardenSection() {
  const { gardenFlowers, setGardenFlowers } = useApp();
  const { spawnBurst } = useFloatingHearts();
  const [floatingItems, setFloatingItems] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);

  const plantFlower = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    const newFlower: GardenFlower = {
      id: Date.now().toString(),
      x: Math.max(3, Math.min(95, xPct)),
      y: Math.max(3, Math.min(90, yPct)),
      type: Math.floor(Math.random() * FLOWER_TYPES.length),
      scale: 0.8 + Math.random() * 0.8,
      rotation: (Math.random() - 0.5) * 30,
    };

    setGardenFlowers([...gardenFlowers, newFlower]);
    spawnBurst(e.clientX, e.clientY, 5);
  }, [gardenFlowers, setGardenFlowers, spawnBurst]);

  const handleFlowerClick = useCallback((id: string, e: React.MouseEvent) => {
    spawnBurst(e.clientX, e.clientY, 4);
    const symbol = DECORATIONS[Math.floor(Math.random() * DECORATIONS.length)];
    const item = { id: Date.now(), x: e.clientX, y: e.clientY, symbol };
    setFloatingItems(prev => [...prev, item]);
    setTimeout(() => setFloatingItems(prev => prev.filter(i => i.id !== item.id)), 2000);
  }, [spawnBurst]);

  const clearGarden = () => {
    if (confirm('Clear the entire garden?')) setGardenFlowers([]);
  };

  return (
    <section id="garden" className="py-20 px-4" aria-label="Love Garden">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Love Garden 🌷</h2>
        <p className="section-subtitle">click to plant a little love ♡</p>

        {/* Garden canvas */}
        <div
          className="relative w-full h-80 sm:h-96 rounded-4xl overflow-hidden cursor-crosshair shadow-xl shadow-pink-200/40 mb-6"
          style={{
            background: 'linear-gradient(180deg, #fce8f1 0%, #d4edda 60%, #b8dcc4 100%)',
          }}
          onClick={plantFlower}
          role="region"
          aria-label="Garden canvas — click to plant flowers"
        >
          {/* Sky decorations */}
          <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" aria-hidden="true">
            {['☁️','☁️','☁️'].map((c, i) => (
              <span key={i} className="absolute text-2xl opacity-60 animate-float-slow"
                style={{ left: `${15 + i * 30}%`, top: `${8 + (i % 2) * 8}%`, animationDelay: `${i * 1.5}s` }}>
                {c}
              </span>
            ))}
            <span className="absolute right-8 top-3 text-xl animate-float opacity-50" aria-hidden="true">🌤</span>
          </div>

          {/* Ground */}
          <div className="absolute bottom-0 inset-x-0 h-16 rounded-b-4xl"
            style={{ background: 'linear-gradient(180deg, transparent 0%, #8fbc8f 100%)' }}
            aria-hidden="true" />

          {/* Bunny */}
          <div className="absolute bottom-12 left-6 text-3xl animate-bounce-soft select-none" aria-hidden="true">🐰</div>

          {/* Default garden elements */}
          <div className="absolute bottom-10 right-8 text-3xl animate-float select-none" aria-hidden="true">🦋</div>
          <div className="absolute bottom-8 left-1/2 text-2xl animate-float-slow select-none" style={{ animationDelay: '2s' }} aria-hidden="true">🌿</div>

          {/* Planted flowers */}
          {gardenFlowers.map(flower => (
            <GardenFlowerEl
              key={flower.id}
              flower={flower}
              onClick={(e) => { e.stopPropagation(); handleFlowerClick(flower.id, e); }}
            />
          ))}

          {/* Empty state hint */}
          {gardenFlowers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-dancing text-petal-400 text-xl opacity-60">click anywhere to plant ♡</p>
            </div>
          )}

          {/* Floating items on click */}
          {floatingItems.map(item => (
            <div key={item.id} className="floating-heart pointer-events-none fixed text-xl z-50"
              style={{ left: item.x, top: item.y }} aria-hidden="true">
              {item.symbol}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="cute-card px-4 py-2 text-sm font-body text-petal-500">
            🌸 {gardenFlowers.length} flowers planted
          </div>
          {gardenFlowers.length > 0 && (
            <button onClick={clearGarden} className="btn-secondary text-sm py-2">
              🌱 Start Fresh
            </button>
          )}
        </div>

        <p className="text-center text-xs text-petal-300 font-body italic mt-4">
          click the flowers to make them bloom ♡
        </p>
      </div>
    </section>
  );
}

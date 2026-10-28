import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  symbol: string;
}

const SYMBOLS = ['♡', '✿', '✦', '⋆', '❀', '🌸'];

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 6,
      size: 10 + Math.random() * 12,
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {petals.map(p => (
        <span
          key={p.id}
          className="absolute select-none opacity-30"
          style={{
            left: `${p.x}%`,
            top: '-20px',
            fontSize: `${p.size}px`,
            color: ['#ff91aa', '#ffc0d0', '#f7aece', '#c4b5fd', '#ffd770'][p.id % 5],
            animation: `petalFall ${p.duration}s ${p.delay}s linear infinite`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

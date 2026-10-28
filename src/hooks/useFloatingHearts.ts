import { useCallback } from 'react';

export function useFloatingHearts() {
  const spawnHeart = useCallback((x: number, y: number) => {
    const container = document.getElementById('floating-hearts-root');
    if (!container) return;

    const hearts = ['♡', '♥', '💕', '🌸', '✨', '💫'];
    const heart = document.createElement('span');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = 'floating-heart';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 16 + 12}px`;
    heart.style.color = ['#ff91aa', '#ffc0d0', '#f37db2', '#c4b5fd', '#ffd770'][
      Math.floor(Math.random() * 5)
    ];
    heart.setAttribute('aria-hidden', 'true');

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }, []);

  const spawnBurst = useCallback((x: number, y: number, count = 6) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        spawnHeart(x + offsetX, y + offsetY);
      }, i * 80);
    }
  }, [spawnHeart]);

  return { spawnHeart, spawnBurst };
}

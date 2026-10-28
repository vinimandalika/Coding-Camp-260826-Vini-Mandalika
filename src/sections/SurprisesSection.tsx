import { useState, useCallback, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useFloatingHearts } from '../hooks/useFloatingHearts';
import type { Wish } from '../types';

/* ─── Open When Envelopes ─── */
const OPEN_WHEN_ITEMS = [
  { id: 'miss',        label: 'you miss someone',               emoji: '🥺',
    message: 'Close your eyes and feel the warmth. Every mile between hearts is just a reminder of how deeply you are connected. The distance is real, but so is the love — and love always finds its way home. ♡' },
  { id: 'smile',       label: 'you need a smile',               emoji: '😊',
    message: 'Did you know? Every time you smile, you make the world just a little bit softer. Your smile is one of the loveliest things in existence. Keep shining, sweet soul. ✨' },
  { id: 'encourage',   label: 'you need a little encouragement', emoji: '🌟',
    message: 'You have already come so far. Every step, every stumble, every moment of doubt — you kept going. That is extraordinary. You are stronger than you know, and today is proof of that. 🌸' },
  { id: 'matter',      label: 'you need a reminder that you matter', emoji: '💖',
    message: 'You matter. Not because of what you do or how you perform, but simply because you exist. Your presence makes the world a warmer, kinder place. You are seen, you are loved, you are enough. ♡' },
];

function OpenWhenEnvelope({ item }: { item: typeof OPEN_WHEN_ITEMS[number] }) {
  const [open, setOpen] = useState(false);
  const { spawnBurst } = useFloatingHearts();

  const handleOpen = (e: React.MouseEvent) => {
    setOpen(true);
    spawnBurst(e.clientX, e.clientY, 6);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="group relative p-5 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200
                   rounded-3xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 text-left w-full"
        aria-label={`Open when ${item.label}`}
      >
        <div className="text-3xl mb-3">{item.emoji}</div>
        <p className="font-body text-petal-400 text-xs uppercase tracking-wider mb-1">open when…</p>
        <p className="font-display text-petal-600 text-sm italic leading-snug">{item.label}</p>
        <p className="text-xs text-petal-300 mt-2 font-body">click to open ♡</p>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
             onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200
                          rounded-4xl shadow-2xl p-8 animate-slide-up cursor-default"
               onClick={e => e.stopPropagation()} role="dialog" aria-label={`Message: open when ${item.label}`}>
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-petal-300 hover:text-petal-500" aria-label="Close">
              <X size={20} />
            </button>
            <div className="text-center mb-4">
              <span className="text-4xl">{item.emoji}</span>
            </div>
            <p className="font-body text-petal-400 text-xs text-center uppercase tracking-wider mb-1">open when…</p>
            <h3 className="font-display text-lg text-petal-600 italic text-center mb-5">{item.label}</h3>
            <p className="font-dancing text-petal-500 text-lg leading-relaxed text-center">{item.message}</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Reasons to Smile ─── */
const SMILE_MESSAGES = [
  'You have the most wonderful heart. 🌸',
  'The world is genuinely better because you are in it. ✨',
  'That thing you are proud of? You should be. ♡',
  'Someone out there thinks about you and smiles. 💕',
  'You handled something hard today, even if it was invisible. 🌟',
  'Your kindness ripples further than you will ever know. 🌊',
  'You deserve rest, joy, and all good things. 🍓',
  'Somewhere a flower just bloomed, just for you. 🌷',
  'You are loved in more ways than you realise. 💖',
  'Today is a good day to be you. ✦',
];

function ReasonsToSmile() {
  const [message, setMessage] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const { spawnBurst } = useFloatingHearts();

  const reveal = (e: React.MouseEvent) => {
    const next = (idx + 1) % SMILE_MESSAGES.length;
    setIdx(next);
    setMessage(SMILE_MESSAGES[next]);
    spawnBurst(e.clientX, e.clientY, 6);
  };

  return (
    <div className="cute-card p-6 text-center space-y-4">
      <div className="text-4xl">😊</div>
      <h3 className="font-display text-xl text-petal-600 italic">Reasons to Smile ♡</h3>
      {message && (
        <p className="font-dancing text-petal-500 text-lg leading-relaxed animate-fade-in min-h-12">
          {message}
        </p>
      )}
      <button onClick={reveal} className="btn-primary text-sm">
        {message ? 'one more ♡' : 'show me a reason ♡'}
      </button>
    </div>
  );
}

/* ─── Tiny Wish ─── */
function TinyWish() {
  const { wishes, setWishes, showToast } = useApp();
  const [text, setText] = useState('');

  const saveWish = () => {
    if (!text.trim()) return;
    const wish: Wish = { id: Date.now().toString(), text: text.trim(), date: new Date().toLocaleDateString() };
    setWishes([...wishes, wish]);
    setText('');
    showToast('Wish saved to the stars ✨');
  };

  const deleteWish = (id: string) => {
    setWishes(wishes.filter(w => w.id !== id));
  };

  return (
    <div className="cute-card p-6 space-y-4">
      <div className="text-center">
        <div className="text-4xl mb-2">🌠</div>
        <h3 className="font-display text-xl text-petal-600 italic">A Tiny Wish</h3>
        <p className="text-xs text-petal-300 font-body mt-1">write it down and let it float up to the stars</p>
      </div>
      <div className="flex gap-2">
        <input type="text" value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && saveWish()}
          placeholder="I wish for..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-pink-200 bg-white/70 text-petal-600 font-body text-sm focus:outline-none focus:border-petal-300" />
        <button onClick={saveWish} disabled={!text.trim()} className="btn-primary px-4 py-2.5 text-sm disabled:opacity-50">✦</button>
      </div>
      {wishes.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
          {wishes.map(w => (
            <div key={w.id} className="flex items-center justify-between bg-pink-50/60 rounded-2xl px-3 py-2 group">
              <div>
                <p className="font-dancing text-petal-500 text-sm">{w.text}</p>
                <p className="text-xs text-petal-300 font-body">{w.date}</p>
              </div>
              <button onClick={() => deleteWish(w.id)} aria-label="Delete wish"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-petal-300 hover:text-red-400 p-1 rounded-full">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Heart Catcher Game ─── */
interface FallingHeart { id: number; x: number; speed: number; size: number; }

function HeartCatcher() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [best, setBest] = useState(() => Number(localStorage.getItem('lw_best_score') || 0));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { spawnBurst } = useFloatingHearts();

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setHearts([]);
    setPlaying(true);
  };

  useEffect(() => {
    if (!playing) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setPlaying(false);
          clearInterval(intervalRef.current!);
          clearInterval(spawnRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => {
      const h: FallingHeart = { id: Date.now() + Math.random(), x: 5 + Math.random() * 85, speed: 2 + Math.random() * 3, size: 20 + Math.random() * 16 };
      setHearts(prev => [...prev.slice(-20), h]);
    }, 600);

    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(spawnRef.current!);
    };
  }, [playing]);

  const catchHeart = (id: number, e: React.MouseEvent) => {
    setHearts(prev => prev.filter(h => h.id !== id));
    setScore(s => {
      const next = s + 1;
      if (next > best) {
        setBest(next);
        localStorage.setItem('lw_best_score', String(next));
      }
      return next;
    });
    spawnBurst(e.clientX, e.clientY, 3);
  };

  return (
    <div className="cute-card p-6 space-y-4">
      <div className="text-center">
        <div className="text-4xl mb-2">💝</div>
        <h3 className="font-display text-xl text-petal-600 italic">Heart Catcher</h3>
        <p className="text-xs text-petal-300 font-body mt-1">catch the falling hearts ♡</p>
      </div>

      {!playing ? (
        <div className="text-center space-y-3">
          {score > 0 && <p className="font-dancing text-petal-500 text-lg">you caught {score} hearts! ♡</p>}
          {best > 0 && <p className="text-xs text-petal-300 font-body">best: {best} hearts</p>}
          <button onClick={startGame} className="btn-primary text-sm">
            {score > 0 ? 'play again ♡' : 'start catching ♡'}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between text-sm font-body mb-2">
            <span className="text-petal-500 font-semibold">♡ {score}</span>
            <span className={`font-semibold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-petal-400'}`}>⏱ {timeLeft}s</span>
          </div>
          <div
            className="relative w-full h-48 bg-gradient-to-b from-pink-50 to-rose-50 rounded-3xl overflow-hidden border border-pink-200 cursor-pointer"
            aria-label="Game area — click hearts to catch them"
          >
            {hearts.map(h => (
              <button
                key={h.id}
                className="absolute select-none hover:scale-125 transition-transform focus:outline-none"
                style={{ left: `${h.x}%`, fontSize: `${h.size}px`, animation: `petalFall ${h.speed}s linear forwards` }}
                onClick={e => catchHeart(h.id, e)}
                aria-label="Catch this heart"
              >
                ♡
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Section ─── */
export default function SurprisesSection() {
  return (
    <section id="surprises" className="py-20 px-4 bg-gradient-to-b from-transparent to-pink-50/20" aria-label="Little Surprises">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title">Little Surprises 🎁</h2>
        <p className="section-subtitle">tiny gifts for your heart</p>

        {/* Open When */}
        <h3 className="font-display text-xl text-petal-500 italic text-center mb-5">Open When… ✉️</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {OPEN_WHEN_ITEMS.map(item => (
            <OpenWhenEnvelope key={item.id} item={item} />
          ))}
        </div>

        {/* Other surprises */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReasonsToSmile />
          <TinyWish />
          <HeartCatcher />
        </div>
      </div>
    </section>
  );
}

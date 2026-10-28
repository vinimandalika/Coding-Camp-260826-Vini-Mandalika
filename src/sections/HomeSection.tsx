import { useApp } from '../context/AppContext';
import { useFloatingHearts } from '../hooks/useFloatingHearts';

export default function HomeSection() {
  const { settings } = useApp();
  const { spawnBurst } = useFloatingHearts();

  const today = new Date();
  const special = settings.specialDate ? new Date(settings.specialDate) : null;
  const daysTogether = special
    ? Math.max(0, Math.floor((today.getTime() - special.getTime()) / 86400000))
    : null;

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center relative px-4 pt-24 pb-16"
      aria-label="Home"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ffc0d0, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ffd770, transparent)' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Sparkle row */}
        <div className="flex justify-center gap-3 text-xl mb-6 opacity-60" aria-hidden="true">
          {['✦','🌸','✦','🌸','✦'].map((s,i) => (
            <span key={i} className="animate-sparkle" style={{ animationDelay: `${i*0.3}s` }}>{s}</span>
          ))}
        </div>

        {/* Greeting */}
        <p className="font-body text-petal-400 text-sm uppercase tracking-widest mb-3">
          welcome to
        </p>

        <h1
          className="font-display text-5xl md:text-7xl text-petal-600 mb-4 leading-tight"
          style={{ fontStyle: 'italic' }}
        >
          {settings.siteTitle}
        </h1>

        <p className="font-dancing text-petal-400 text-xl md:text-2xl mb-8">
          a soft little world where every click feels like opening a love letter ♡
        </p>

        {/* Stats card */}
        {daysTogether !== null && (
          <div
            className="cute-card inline-flex flex-col items-center gap-1 px-8 py-4 mb-8 cursor-pointer hover:scale-105 transition-transform"
            onClick={e => spawnBurst(e.clientX, e.clientY)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && spawnBurst(200, 200)}
            aria-label={`${daysTogether} days together, click to celebrate`}
          >
            <span className="text-4xl font-display font-bold text-petal-500 animate-pulse-soft">
              {daysTogether.toLocaleString()}
            </span>
            <span className="font-body text-petal-400 text-xs uppercase tracking-widest">
              days of love ♡
            </span>
          </div>
        )}

        {/* Name display */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="cute-card px-4 py-2 font-dancing text-petal-500 text-lg">
            {settings.yourName}
          </span>
          <span className="text-2xl animate-heart-beat">♡</span>
          <span className="cute-card px-4 py-2 font-dancing text-petal-500 text-lg">
            {settings.partnerName}
          </span>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs font-body text-petal-400 uppercase tracking-widest">scroll to explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-petal-300 to-transparent animate-pulse-soft" />
          <span className="text-petal-300 animate-bounce-soft">♡</span>
        </div>
      </div>

      {/* Bottom decorative row */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-around opacity-20" aria-hidden="true">
        {['🌸','✨','🐰','✨','🌸','✨','🐰','✨','🌸'].map((s,i) => (
          <span key={i} className="text-lg animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{s}</span>
        ))}
      </div>
    </section>
  );
}

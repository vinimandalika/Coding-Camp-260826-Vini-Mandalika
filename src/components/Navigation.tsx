import { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'home',       label: 'Home',             icon: '♡' },
  { id: 'story',      label: 'Our Story',         icon: '📖' },
  { id: 'notes',      label: 'Love Notes',        icon: '💌' },
  { id: 'memories',   label: 'Memories',          icon: '📸' },
  { id: 'garden',     label: 'Love Garden',       icon: '🌷' },
  { id: 'surprises',  label: 'Little Surprises',  icon: '🎁' },
];

interface Props {
  activeSection: string;
  musicOn: boolean;
  onToggleMusic: () => void;
}

export default function Navigation({ activeSection, musicOn, onToggleMusic }: Props) {
  const { settings } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md shadow-pink-100/60 py-2'
          : 'bg-transparent py-4'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className="font-display text-xl text-petal-500 hover:text-petal-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petal-300 rounded-lg px-1"
        >
          <span className="animate-heart-beat inline-block">♡</span>
          <span className="hidden sm:inline">{settings.siteTitle}</span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`relative px-3 py-1.5 rounded-full text-sm font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petal-300 ${
                  activeSection === item.id
                    ? 'bg-petal-100 text-petal-600'
                    : 'text-petal-400 hover:text-petal-600 hover:bg-petal-50'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-petal-400 rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMusic}
            aria-label={musicOn ? 'Turn off music' : 'Turn on music'}
            className="p-2 rounded-full text-petal-400 hover:text-petal-600 hover:bg-petal-50 transition-all"
          >
            {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-full text-petal-400 hover:text-petal-600 hover:bg-petal-50 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-lg py-3 px-4">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold font-body flex items-center gap-2 transition-all ${
                    activeSection === item.id
                      ? 'bg-petal-100 text-petal-600'
                      : 'text-petal-400 hover:bg-petal-50 hover:text-petal-600'
                  }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

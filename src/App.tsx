import { useState, useEffect, useRef } from 'react';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import FloatingPetals from './components/FloatingPetals';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import WelcomePage from './sections/WelcomePage';
import HomeSection from './sections/HomeSection';
import OurStorySection from './sections/OurStorySection';
import LoveNotesSection from './sections/LoveNotesSection';
import MemoriesSection from './sections/MemoriesSection';
import LoveGardenSection from './sections/LoveGardenSection';
import SurprisesSection from './sections/SurprisesSection';
import SettingsPanel from './sections/SettingsSection';
import { Settings } from 'lucide-react';

const SECTIONS = ['home', 'story', 'notes', 'memories', 'garden', 'surprises'];

function AppInner() {
  const [entered, setEntered] = useState(() => localStorage.getItem('lw_entered') === 'true');
  const [activeSection, setActiveSection] = useState('home');
  const [musicOn, setMusicOn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    setEntered(true);
    localStorage.setItem('lw_entered', 'true');
  };

  // Intersection observer for active section
  useEffect(() => {
    if (!entered) return;
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [entered]);

  // Music (gentle lo-fi via a public URL — user must explicitly enable)
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
      // Use a royalty-free gentle melody
      audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    }
    if (musicOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    return () => {};
  }, [musicOn]);

  return (
    <div className="relative min-h-screen" data-theme="blush">
      {/* Floating hearts root */}
      <div id="floating-hearts-root" className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" />

      {/* Ambient petals */}
      <FloatingPetals />

      {/* Welcome splash */}
      {!entered && <WelcomePage onEnter={handleEnter} />}

      {/* Main app */}
      {entered && (
        <>
          <Navigation
            activeSection={activeSection}
            musicOn={musicOn}
            onToggleMusic={() => setMusicOn(m => !m)}
          />

          <main>
            <HomeSection />
            <OurStorySection />
            <LoveNotesSection />
            <MemoriesSection />
            <LoveGardenSection />
            <SurprisesSection />
          </main>

          {/* Footer */}
          <footer className="py-10 text-center space-y-2">
            <p className="font-dancing text-petal-400 text-lg">made with love ♡</p>
            <div className="flex justify-center gap-2 text-petal-300 text-sm">
              {['🌸','✦','🐰','✦','🌸'].map((s,i) => (
                <span key={i} className="animate-sparkle" style={{ animationDelay: `${i*0.2}s` }}>{s}</span>
              ))}
            </div>
          </footer>

          {/* Settings FAB */}
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm
                       border border-pink-100 text-petal-400 hover:text-petal-600 shadow-md shadow-pink-100/60
                       hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
          >
            <Settings size={18} />
          </button>

          {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

          <BackToTop />
          <Toast />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

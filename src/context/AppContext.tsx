import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Settings, StoryMoment, LoveNote, Memory, Wish, GardenFlower } from '../types';

const DEFAULT_SETTINGS: Settings = {
  siteTitle: 'Love Web ♡',
  yourName: 'My Love',
  partnerName: 'My Darling',
  welcomeMessage: 'A tiny world made just for you.',
  specialDate: '2024-02-14',
  accentColor: '#ff91aa',
  theme: 'blush',
};

const SAMPLE_MOMENTS: StoryMoment[] = [
  {
    id: '1',
    date: '2023-03-15',
    title: 'The Day We First Met ♡',
    description: 'A moment I will always treasure — the very beginning of our little story.',
    icon: 'heart',
  },
  {
    id: '2',
    date: '2023-06-21',
    title: 'Our First Adventure',
    description: 'We went somewhere beautiful and made memories that still make me smile.',
    icon: 'flower',
  },
  {
    id: '3',
    date: '2024-02-14',
    title: 'A Day Full of Love',
    description: 'Every little thing felt extra special on this day.',
    icon: 'star',
  },
];

const SAMPLE_NOTES: LoveNote[] = [
  {
    id: '1',
    title: 'Just a little note ♡',
    content: 'I wanted you to know that thinking of you makes even the ordinary days feel bright and warm. You mean so much more than words can say.',
    recipient: 'My Darling',
    date: '2024-02-14',
    color: 'pink',
  },
  {
    id: '2',
    title: 'Good morning, sunshine ☀️',
    content: 'Every morning I wake up grateful for you. You are my favourite part of every single day. I hope today brings you everything you deserve.',
    date: '2024-03-01',
    color: 'peach',
  },
  {
    id: '3',
    title: 'A tiny reminder 🌸',
    content: 'You are loved. You are enough. You are absolutely wonderful, and I am so lucky to have you in my life.',
    date: '2024-04-10',
    color: 'lavender',
  },
];

const SAMPLE_MEMORIES: Memory[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    caption: 'A beautiful moment together ♡',
    date: '2023-06-21',
    isPlaceholder: true,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&q=80',
    caption: 'Soft days and sweet memories',
    date: '2023-08-15',
    isPlaceholder: true,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&q=80',
    caption: 'Every petal reminds me of you 🌸',
    date: '2024-02-14',
    isPlaceholder: true,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80',
    caption: 'Golden light, golden days',
    date: '2023-10-05',
    isPlaceholder: true,
  },
];

interface AppContextType {
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  moments: StoryMoment[];
  setMoments: (m: StoryMoment[]) => void;
  notes: LoveNote[];
  setNotes: (n: LoveNote[]) => void;
  memories: Memory[];
  setMemories: (m: Memory[]) => void;
  wishes: Wish[];
  setWishes: (w: Wish[]) => void;
  gardenFlowers: GardenFlower[];
  setGardenFlowers: (f: GardenFlower[]) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignore */ }
  return fallback;
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() =>
    load('lw_settings', DEFAULT_SETTINGS)
  );
  const [moments, setMomentsState] = useState<StoryMoment[]>(() =>
    load('lw_moments', SAMPLE_MOMENTS)
  );
  const [notes, setNotesState] = useState<LoveNote[]>(() =>
    load('lw_notes', SAMPLE_NOTES)
  );
  const [memories, setMemoriesState] = useState<Memory[]>(() =>
    load('lw_memories', SAMPLE_MEMORIES)
  );
  const [wishes, setWishesState] = useState<Wish[]>(() =>
    load('lw_wishes', [])
  );
  const [gardenFlowers, setGardenFlowersState] = useState<GardenFlower[]>(() =>
    load('lw_garden', [])
  );
  const [toast, setToast] = useState<string | null>(null);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      save('lw_settings', next);
      return next;
    });
  }, []);

  const setMoments = useCallback((m: StoryMoment[]) => {
    setMomentsState(m); save('lw_moments', m);
  }, []);

  const setNotes = useCallback((n: LoveNote[]) => {
    setNotesState(n); save('lw_notes', n);
  }, []);

  const setMemories = useCallback((m: Memory[]) => {
    setMemoriesState(m); save('lw_memories', m);
  }, []);

  const setWishes = useCallback((w: Wish[]) => {
    setWishesState(w); save('lw_wishes', w);
  }, []);

  const setGardenFlowers = useCallback((f: GardenFlower[]) => {
    setGardenFlowersState(f); save('lw_garden', f);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  return (
    <AppContext.Provider value={{
      settings, updateSettings,
      moments, setMoments,
      notes, setNotes,
      memories, setMemories,
      wishes, setWishes,
      gardenFlowers, setGardenFlowers,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

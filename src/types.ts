export type Theme = 'blush' | 'lavender';

export interface Settings {
  siteTitle: string;
  yourName: string;
  partnerName: string;
  welcomeMessage: string;
  specialDate: string;
  accentColor: string;
  theme: Theme;
}

export interface StoryMoment {
  id: string;
  date: string;
  title: string;
  description: string;
  photo?: string;
  icon: 'heart' | 'flower' | 'star' | 'sparkle';
}

export interface LoveNote {
  id: string;
  title: string;
  content: string;
  recipient?: string;
  date: string;
  color: string;
}

export interface Memory {
  id: string;
  url: string;
  caption: string;
  date?: string;
  isPlaceholder?: boolean;
}

export interface Wish {
  id: string;
  text: string;
  date: string;
}

export interface GardenFlower {
  id: string;
  x: number;
  y: number;
  type: number;
  scale: number;
  rotation: number;
}

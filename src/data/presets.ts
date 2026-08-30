import type { PresetSubscription } from '../types';

export const PRESET_CATEGORIES = [
  'Entertainment',
  'Music & Audio',
  'Productivity & Work',
  'AI & Tech',
  'Cloud & Storage',
  'Design & Creative',
  'Education & Learning',
  'Lifestyle & Social',
  'Gaming',
  'Fitness & Health',
  'Utilities',
  'Other',
];

export const PRESET_COLORS = [
  '#E50914', // Netflix Red
  '#1DB954', // Spotify Green
  '#00A8E1', // Prime Blue
  '#0F1014', // Hotstar Dark
  '#FF0000', // YouTube Red
  '#4285F4', // Google Blue
  '#FA243C', // Apple Pink/Red
  '#D83B01', // Microsoft Orange
  '#10A37F', // ChatGPT Teal/Green
  '#00C4CC', // Canva Cyan
  '#FE3C72', // Tinder Pink
  '#58CC02', // Duolingo Green
  '#00F0FF', // CapCut Cyan
  '#3699FF', // iCloud Blue
  '#6366F1', // Indigo Accent
  '#8B5CF6', // Purple Accent
  '#EC4899', // Fuchsia
  '#F59E0B', // Amber
];

export const PRESET_SUBSCRIPTIONS: PresetSubscription[] = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    typicalCost: 649,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#E50914',
    description: 'Movies, TV shows & 4K streaming (Standard/Premium Plan)',
    iconKeywords: ['stream', 'tv', 'movie', 'series'],
  },
  {
    name: 'Spotify',
    category: 'Music & Audio',
    typicalCost: 119,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#1DB954',
    description: 'Ad-free music & podcast streaming',
    iconKeywords: ['audio', 'music', 'songs', 'podcast'],
  },
  {
    name: 'Amazon Prime',
    category: 'Entertainment',
    typicalCost: 1499,
    currency: 'INR',
    billingCycle: 'yearly',
    color: '#00A8E1',
    description: 'Prime Video, Free Fast Delivery & Prime Music',
    iconKeywords: ['shopping', 'delivery', 'video', 'prime'],
  },
  {
    name: 'Disney+ Hotstar',
    category: 'Entertainment',
    typicalCost: 899,
    currency: 'INR',
    billingCycle: 'yearly',
    color: '#0F1014',
    description: 'Live Cricket, HBO, Disney & Marvel Originals (Super Plan)',
    iconKeywords: ['disney', 'hotstar', 'cricket', 'stream'],
  },
  {
    name: 'YouTube Premium',
    category: 'Entertainment',
    typicalCost: 149,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#FF0000',
    description: 'Ad-free videos, background playback & YouTube Music',
    iconKeywords: ['video', 'youtube', 'music', 'adfree'],
  },
  {
    name: 'Google One',
    category: 'Cloud & Storage',
    typicalCost: 130,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#4285F4',
    description: '100 GB Cloud Storage across Drive, Gmail & Photos',
    iconKeywords: ['storage', 'drive', 'google', 'backup'],
  },
  {
    name: 'Apple Music',
    category: 'Music & Audio',
    typicalCost: 99,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#FA243C',
    description: 'Spatial audio & lossless music catalogue',
    iconKeywords: ['apple', 'music', 'audio', 'lossless'],
  },
  {
    name: 'Microsoft 365',
    category: 'Productivity & Work',
    typicalCost: 489,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#D83B01',
    description: 'Word, Excel, PowerPoint + 1TB OneDrive cloud storage',
    iconKeywords: ['office', 'word', 'excel', 'work'],
  },
  {
    name: 'ChatGPT Plus',
    category: 'AI & Tech',
    typicalCost: 1999,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#10A37F',
    description: 'GPT-4o, Advanced Voice, reasoning models & high limits',
    iconKeywords: ['ai', 'chatgpt', 'openai', 'bot'],
  },
  {
    name: 'Canva Pro',
    category: 'Design & Creative',
    typicalCost: 499,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#00C4CC',
    description: 'Premium graphic design tools, brand kits & templates',
    iconKeywords: ['design', 'graphics', 'canva', 'edit'],
  },
  {
    name: 'Tinder',
    category: 'Lifestyle & Social',
    typicalCost: 800,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#FE3C72',
    description: 'Tinder Gold/Platinum — unlimited likes & passport',
    iconKeywords: ['dating', 'social', 'meet', 'match'],
  },
  {
    name: 'Duolingo Super',
    category: 'Education & Learning',
    typicalCost: 199,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#58CC02',
    description: 'Unlimited hearts, progress tracker & ad-free lessons',
    iconKeywords: ['learn', 'language', 'education', 'duo'],
  },
  {
    name: 'CapCut Pro',
    category: 'Design & Creative',
    typicalCost: 799,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#00F0FF',
    description: 'Pro video editing effects, transitions & cloud storage',
    iconKeywords: ['video', 'editor', 'effects', 'reel'],
  },
  {
    name: 'iCloud+',
    category: 'Cloud & Storage',
    typicalCost: 75,
    currency: 'INR',
    billingCycle: 'monthly',
    color: '#3699FF',
    description: '50 GB iCloud storage + Private Relay & Hide My Email',
    iconKeywords: ['apple', 'icloud', 'backup', 'storage'],
  },
];

export const SAMPLE_SEED_DATA = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    cost: 649,
    currency: 'INR',
    billingCycle: 'monthly' as const,
    renewalDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Renews in 2 days (URGENT)
    remindDaysBefore: 3,
    notes: 'Premium 4-screen family UHD account',
    isActive: true,
    color: '#E50914',
  },
  {
    name: 'Spotify',
    category: 'Music & Audio',
    cost: 119,
    currency: 'INR',
    billingCycle: 'monthly' as const,
    renewalDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Renews in 6 days
    remindDaysBefore: 3,
    notes: 'Student Individual Plan',
    isActive: true,
    color: '#1DB954',
  },
  {
    name: 'ChatGPT Plus',
    category: 'AI & Tech',
    cost: 1999,
    currency: 'INR',
    billingCycle: 'monthly' as const,
    renewalDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remindDaysBefore: 3,
    notes: 'Coding and research subscription',
    isActive: true,
    color: '#10A37F',
  },
  {
    name: 'Amazon Prime',
    category: 'Entertainment',
    cost: 1499,
    currency: 'INR',
    billingCycle: 'yearly' as const,
    renewalDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remindDaysBefore: 5,
    notes: 'Free shipping + Prime Video',
    isActive: true,
    color: '#00A8E1',
  },
  {
    name: 'Google One',
    category: 'Cloud & Storage',
    cost: 130,
    currency: 'INR',
    billingCycle: 'monthly' as const,
    renewalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Renews tomorrow (URGENT)
    remindDaysBefore: 3,
    notes: '100GB Google Drive/Photos backup',
    isActive: true,
    color: '#4285F4',
  },
  {
    name: 'Gym Membership',
    category: 'Fitness & Health',
    cost: 1200,
    currency: 'INR',
    billingCycle: 'monthly' as const,
    renewalDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    remindDaysBefore: 3,
    notes: 'Cult.fit access',
    isActive: false, // Paused
    color: '#F59E0B',
  }
];

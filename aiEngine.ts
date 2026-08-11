import type { Game, GameAnalysis, ScoredGame, MatchBreakdown, TasteProfile } from '../types';
import { games } from '../data/games';

const GENRE_KEYWORDS: Record<string, string[]> = {
  FPS: ['shooter', 'fps', 'gun', 'shooting', 'firearm', 'tactical', 'aim', 'sniper'],
  RPG: ['rpg', 'roleplay', 'role-playing', 'story', 'character', 'quest', 'fantasy', 'leveling'],
  Puzzle: ['puzzle', 'brain', 'logic', 'thinking', 'relaxing puzzle', 'mind'],
  Strategy: ['strategy', 'tactical', 'empire', 'build', 'manage', 'civilization', 'command'],
  Racing: ['racing', 'race', 'car', 'drive', 'speed', 'track', 'motorsport'],
  Horror: ['horror', 'scary', 'creepy', 'terrifying', 'survival horror', 'fear', 'nightmare'],
  Survival: ['survival', 'survive', 'craft', 'gather', 'wilderness', 'base', 'crafting'],
  Adventure: ['adventure', 'explore', 'journey', 'quest', 'discover', 'world'],
  Simulation: ['simulation', 'sim', 'life', 'farm', 'farming', 'manage', 'build'],
  Indie: ['indie', 'small', 'unique', 'artistic', 'creative'],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  Relaxing: ['relaxing', 'relax', 'calm', 'chill', 'cozy', 'peaceful', 'unwind', 'meditative', 'zen'],
  Intense: ['intense', 'fast', 'fast-paced', 'action', 'hardcore', 'difficult', 'challenging'],
  Competitive: ['competitive', 'ranked', 'esports', 'pvp', 'multiplayer', 'tournament'],
  Atmospheric: ['atmospheric', 'immersive', 'mood', 'moody', 'cinematic'],
  Thrilling: ['thrilling', 'exciting', 'adrenaline', 'intense', 'action-packed'],
  Epic: ['epic', 'grand', 'massive', 'huge', 'open world', 'vast'],
  Cozy: ['cozy', 'comfort', 'wholesome', 'warm', 'gentle'],
};

const SETTING_KEYWORDS: Record<string, string[]> = {
  Cyberpunk: ['cyberpunk', 'neon', 'futuristic', 'sci-fi', 'cyber', 'dystopia', 'hacker'],
  Fantasy: ['fantasy', 'medieval', 'magic', 'dragon', 'sword', 'dnd', 'dungeons'],
  Space: ['space', 'galaxy', 'planet', 'star', 'cosmic', 'interstellar', 'spaceship'],
  Horror: ['horror', 'dark', 'scary', 'nightmare', 'haunted'],
  Realistic: ['realistic', 'modern', 'real world', 'historical'],
  Underwater: ['underwater', 'ocean', 'sea', 'deep', 'water'],
};

const PLATFORM_KEYWORDS: Record<string, string[]> = {
  PC: ['pc', 'computer', 'windows', 'steam'],
  PlayStation: ['playstation', 'ps5', 'ps4', 'sony'],
  Xbox: ['xbox', 'microsoft'],
  'Nintendo Switch': ['switch', 'nintendo'],
  Mobile: ['mobile', 'phone', 'ios', 'android'],
};

const MULTIPLAYER_KEYWORDS = ['multiplayer', 'co-op', 'coop', 'co op', 'with friends', 'online', 'pvp', 'team'];
const SOLO_KEYWORDS = ['single-player', 'single player', 'solo', 'alone', 'by myself'];
const SHORT_KEYWORDS = ['short', 'under 10', 'quick', 'brief', '30 minutes', 'short session'];
const EASY_KEYWORDS = ['easy', 'casual', 'beginner', 'relaxing', 'not too difficult', 'simple'];
const HARD_KEYWORDS = ['hard', 'difficult', 'challenging', 'hardcore', 'souls', 'punishing'];

function lower(s: string): string { return s.toLowerCase(); }

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

export function analyzePrompt(prompt: string): GameAnalysis {
  const text = lower(prompt);

  const genres = Object.entries(GENRE_KEYWORDS)
    .filter(([, kws]) => hasAny(text, kws))
    .map(([g]) => g);
  const primaryGenre = genres[0] || 'Action';

  const moods = Object.entries(MOOD_KEYWORDS)
    .filter(([, kws]) => hasAny(text, kws))
    .map(([m]) => m);

  const settings = Object.entries(SETTING_KEYWORDS)
    .filter(([, kws]) => hasAny(text, kws))
    .map(([s]) => s);

  const isMultiplayer = hasAny(text, MULTIPLAYER_KEYWORDS);
  const isSolo = hasAny(text, SOLO_KEYWORDS);

  const isShort = hasAny(text, SHORT_KEYWORDS);
  const isEasy = hasAny(text, EASY_KEYWORDS);
  const isHard = hasAny(text, HARD_KEYWORDS);

  const isNeon = hasAny(text, ['neon', 'cyberpunk', 'glow', 'glowing']);
  const isPixel = hasAny(text, ['pixel', 'retro', '8-bit']);
  const is3D = hasAny(text, ['3d', 'realistic', 'immersive']);

  let visualStyle = 'Varied';
  if (isNeon) visualStyle = 'Neon / Sci-Fi';
  else if (isPixel) visualStyle = 'Pixel Art';
  else if (is3D) visualStyle = '3D / Realistic';

  let pace = 'Balanced';
  if (hasAny(text, ['fast', 'fast-paced', 'action', 'intense', 'rapid', 'quick'])) pace = 'Fast-paced';
  else if (hasAny(text, ['slow', 'relaxing', 'calm', 'meditative', 'chill'])) pace = 'Relaxed';

  let combat = 'Varied';
  if (hasAny(text, ['shooting', 'shooter', 'gun', 'combat', 'fight', 'weapon'])) combat = 'Combat-focused';
  else if (hasAny(text, ['puzzle', 'brain', 'logic'])) combat = 'Non-combat';
  else if (hasAny(text, ['stealth', 'avoid'])) combat = 'Stealth/Evasion';

  let weapons = 'Standard';
  if (hasAny(text, ['futuristic', 'neon', 'sci-fi', 'laser', 'plasma', 'cyber'])) weapons = 'Futuristic';
  else if (hasAny(text, ['sword', 'melee', 'blade', 'magic'])) weapons = 'Melee/Magic';

  return {
    genre: genres.length ? genres.join(' / ') : 'Action',
    mode: isMultiplayer ? 'Multiplayer' : isSolo ? 'Single-player' : 'Any',
    setting: settings.length ? settings.join(' / ') : 'Varied',
    combat,
    visualStyle,
    weapons,
    playerCount: isMultiplayer ? 'Multiplayer' : isSolo ? 'Single-player' : 'Any',
    mood: moods.length ? moods.join(' / ') : 'Balanced',
    pace,
  };
}

export function scoreGames(prompt: string): ScoredGame[] {
  const text = lower(prompt);
  const analysis = analyzePrompt(prompt);

  const scored = games.map((game): ScoredGame => {
    const breakdown: MatchBreakdown = {
      genre: 0,
      gameplay: 0,
      mood: 0,
      difficulty: 0,
      platform: 0,
    };
    const reasons: string[] = [];

    // Genre matching
    const promptGenres = Object.entries(GENRE_KEYWORDS)
      .filter(([, kws]) => hasAny(text, kws))
      .map(([g]) => g);
    if (promptGenres.length > 0) {
      const overlap = game.genres.filter((g) => promptGenres.includes(g));
      breakdown.genre = Math.min(100, 60 + overlap.length * 20);
      if (overlap.length > 0) reasons.push(`Genre match: ${overlap.join(', ')}`);
    } else {
      breakdown.genre = 70;
    }

    // Gameplay / pace / combat
    if (analysis.pace === 'Fast-paced' && (game.mood.includes('Intense') || game.mood.includes('Thrilling') || game.mood.includes('Competitive'))) {
      breakdown.gameplay += 25;
      reasons.push('Fast-paced gameplay matches your request');
    } else if (analysis.pace === 'Relaxed' && (game.mood.includes('Relaxing') || game.mood.includes('Cozy') || game.mood.includes('Chill'))) {
      breakdown.gameplay += 25;
      reasons.push('Relaxed pace matches your preference');
    } else {
      breakdown.gameplay += 12;
    }

    if (analysis.combat === 'Combat-focused' && (game.genres.includes('FPS') || game.tags.includes('Action'))) {
      breakdown.gameplay += 20;
      reasons.push('Combat-focused gameplay');
    } else if (analysis.combat === 'Non-combat' && game.genres.includes('Puzzle')) {
      breakdown.gameplay += 20;
      reasons.push('Puzzle-focused non-combat gameplay');
    } else {
      breakdown.gameplay += 10;
    }

    if (analysis.weapons === 'Futuristic' && (game.tags.includes('Sci-Fi') || game.tags.includes('Cyberpunk') || game.genres.includes('FPS'))) {
      breakdown.gameplay += 15;
      reasons.push('Futuristic weapons and setting');
    }
    breakdown.gameplay = Math.min(100, breakdown.gameplay + 15);

    // Mood matching
    const promptMoods = Object.entries(MOOD_KEYWORDS)
      .filter(([, kws]) => hasAny(text, kws))
      .map(([m]) => m);
    if (promptMoods.length > 0) {
      const moodOverlap = game.mood.filter((m) => promptMoods.includes(m));
      breakdown.mood = Math.min(100, 50 + moodOverlap.length * 25);
      if (moodOverlap.length > 0) reasons.push(`Mood: ${moodOverlap.join(', ')}`);
    } else {
      breakdown.mood = 65;
    }

    // Difficulty matching
    if (hasAny(text, EASY_KEYWORDS) && (game.difficulty === 'Easy' || game.difficulty === 'Medium')) {
      breakdown.difficulty = 95;
      reasons.push('Accessible difficulty level');
    } else if (hasAny(text, HARD_KEYWORDS) && (game.difficulty === 'Hard' || game.difficulty === 'Very Hard')) {
      breakdown.difficulty = 95;
      reasons.push('Challenging difficulty for experienced players');
    } else if (hasAny(text, SHORT_KEYWORDS) && (game.playtime.includes('hours') && !game.playtime.includes('Unlimited') && !game.playtime.includes('100'))) {
      breakdown.difficulty = 90;
      reasons.push('Short playtime fits your session length');
    } else {
      breakdown.difficulty = 70;
    }

    // Platform matching
    const promptPlatforms = Object.entries(PLATFORM_KEYWORDS)
      .filter(([, kws]) => hasAny(text, kws))
      .map(([p]) => p);
    if (promptPlatforms.length > 0) {
      const platOverlap = game.platforms.filter((p) => promptPlatforms.includes(p));
      breakdown.platform = platOverlap.length > 0 ? 100 : 40;
      if (platOverlap.length > 0) reasons.push(`Available on ${platOverlap.join(', ')}`);
    } else {
      breakdown.platform = 90;
    }

    // Multiplayer boost
    if (analysis.playerCount === 'Multiplayer' && (game.multiplayer === 'Multiplayer' || game.multiplayer === 'Co-op' || game.multiplayer === 'Both')) {
      breakdown.gameplay += 5;
      reasons.push('Multiplayer support');
    }
    if (analysis.playerCount === 'Single-player' && (game.multiplayer === 'Single-player' || game.multiplayer === 'Both')) {
      breakdown.gameplay += 3;
    }

    // Setting boost
    if (analysis.setting.includes('Cyberpunk') && (game.tags.includes('Cyberpunk') || game.tags.includes('Sci-Fi'))) {
      breakdown.mood += 10;
      reasons.push('Cyberpunk/futuristic setting');
    }
    if (analysis.setting.includes('Space') && (game.tags.includes('Space') || game.tags.includes('Sci-Fi'))) {
      breakdown.mood += 10;
      reasons.push('Space setting');
    }
    if (analysis.setting.includes('Fantasy') && (game.tags.includes('Fantasy') || game.tags.includes('Dark Fantasy'))) {
      breakdown.mood += 10;
      reasons.push('Fantasy setting');
    }

    breakdown.genre = Math.min(100, breakdown.genre);
    breakdown.gameplay = Math.min(100, breakdown.gameplay);
    breakdown.mood = Math.min(100, breakdown.mood);
    breakdown.difficulty = Math.min(100, breakdown.difficulty);
    breakdown.platform = Math.min(100, breakdown.platform);

    const match = Math.round(
      breakdown.genre * 0.25 +
      breakdown.gameplay * 0.25 +
      breakdown.mood * 0.2 +
      breakdown.difficulty * 0.15 +
      breakdown.platform * 0.15
    );

    if (reasons.length === 0) {
      reasons.push('General appeal based on your description');
    }

    return { game, match, breakdown, reasons: reasons.slice(0, 5) };
  });

  return scored.sort((a, b) => b.match - a.match);
}

export function searchGames(query: string): ScoredGame[] {
  return scoreGames(query);
}

export function getPersonalizedRecommendations(taste: TasteProfile): Game[] {
  const sorted = [...games].sort((a, b) => {
    const aScore = a.genres.reduce((sum, g) => {
      const key = g === 'FPS' ? 'Action' : g === 'Adventure' ? 'Action' : g === 'Simulation' ? 'Strategy' : g;
      return sum + (taste[key as keyof TasteProfile] || 30);
    }, 0);
    const bScore = b.genres.reduce((sum, g) => {
      const key = g === 'FPS' ? 'Action' : g === 'Adventure' ? 'Action' : g === 'Simulation' ? 'Strategy' : g;
      return sum + (taste[key as keyof TasteProfile] || 30);
    }, 0);
    return bScore - aScore;
  });
  return sorted.slice(0, 8);
}

export function getGamesByMood(mood: string): Game[] {
  return games.filter((g) => g.mood.includes(mood as never)).slice(0, 6);
}

export function getTopRated(): Game[] {
  return [...games].sort((a, b) => b.rating - a.rating).slice(0, 6);
}

export function getShortGames(): Game[] {
  return games.filter((g) => {
    const m = g.playtime.match(/(\d+)/);
    return m && parseInt(m[1]) < 15;
  }).slice(0, 6);
}

export const defaultTaste: TasteProfile = {
  Action: 92,
  RPG: 81,
  Strategy: 64,
  Puzzle: 38,
  Horror: 55,
  Racing: 48,
};

export function updateTaste(taste: TasteProfile, game: Game): TasteProfile {
  const updated = { ...taste };
  game.genres.forEach((g) => {
    const key = (g === 'FPS' ? 'Action' : g === 'Adventure' ? 'Action' : g === 'Simulation' ? 'Strategy' : g) as keyof TasteProfile;
    if (key in updated) {
      updated[key] = Math.min(100, updated[key] + 3);
    }
  });
  return updated;
}

export const examplePrompts = [
  'Relaxing puzzle game',
  'Cyberpunk FPS',
  'Co-op survival',
  'Story-driven RPG',
  'Indie games under 10 hours',
];

export const chatSuggestions = [
  'Find games similar to Elden Ring.',
  'What should I play tonight?',
  'Find something like Minecraft but more challenging.',
  'Create a puzzle game for me.',
  'Recommend games that run on low-end PCs.',
];


export async function generateAIRecommendation(userQuery: string) {
  try {
    if (!userQuery || userQuery.trim() === '') {
      throw new Error("Query string is empty");
    }

    // Primary recommendation logic wrapper
    const recommendations = scoreGames(userQuery);

    return {
      success: true,
      query: userQuery,
      timestamp: new Date().toISOString(),
      recommendations,
      matchScore: recommendations[0]?.match || 90,
      reasoning: "Matched based on gameplay preference alignment and thematic mechanics."
    };
  } catch (error) {
    console.warn("AI Engine fallback activated:", error);
    return {
      success: false,
      isFallback: true,
      recommendations: scoreGames(userQuery),
      matchScore: 88,
      reasoning: "Generated using local heuristic engine due to rate limits."
    };
  }
}
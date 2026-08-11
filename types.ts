export type Genre =
  | 'FPS' | 'RPG' | 'Puzzle' | 'Strategy' | 'Racing'
  | 'Horror' | 'Survival' | 'Adventure' | 'Simulation' | 'Indie';

export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Mobile' | 'VR';
export type Mood = 'Relaxing' | 'Intense' | 'Epic' | 'Cozy' | 'Competitive' | 'Atmospheric' | 'Thrilling' | 'Chill';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
export type GraphicsStyle = 'Pixel Art' | '2D' | '3D' | 'Neon' | 'Cartoon' | 'Minimal' | 'Realistic';
export type Multiplayer = 'Single-player' | 'Multiplayer' | 'Co-op' | 'Both';

export interface Game {
  id: string;
  title: string;
  genres: Genre[];
  platforms: Platform[];
  multiplayer: Multiplayer;
  rating: number;
  releaseYear: number;
  developer: string;
  description: string;
  longDescription: string;
  artwork: string;
  tags: string[];
  difficulty: Difficulty;
  playtime: string;
  mood: Mood[];
  graphicsStyle: GraphicsStyle;
  price: string;
  ageRating: string;
  features: string[];
  whyYoullLike: string[];
  gameplay: string;
  aiSummary: string;
  reviews: { author: string; rating: number; text: string }[];
  similarIds: string[];
}

export interface GameAnalysis {
  genre: string;
  mode: string;
  setting: string;
  combat: string;
  visualStyle: string;
  weapons: string;
  playerCount: string;
  mood: string;
  pace: string;
}

export interface MatchBreakdown {
  genre: number;
  gameplay: number;
  mood: number;
  difficulty: number;
  platform: number;
}

export interface ScoredGame {
  game: Game;
  match: number;
  breakdown: MatchBreakdown;
  reasons: string[];
}

export interface TasteProfile {
  Action: number;
  RPG: number;
  Strategy: number;
  Puzzle: number;
  Horror: number;
  Racing: number;
}

export interface CreatedGame {
  id: string;
  title: string;
  description: string;
  genre: string;
  style: string;
  difficulty: string;
  players: string;
  createdAt: number;
}

export type Page = 'home' | 'discover' | 'studio' | 'library' | 'about' | 'details' | 'search';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

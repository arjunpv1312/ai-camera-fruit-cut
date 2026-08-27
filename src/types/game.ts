export interface Point {
  x: number;
  y: number;
}

export type FruitType =
  | 'watermelon'
  | 'banana'
  | 'strawberry'
  | 'pineapple'
  | 'orange'
  | 'apple'
  | 'dragonfruit'
  | 'kiwi'
  | 'coconut'
  | 'bomb'
  | 'junkfood';

export type WeaponType = 'katana' | 'hammer' | 'laser' | 'frost' | 'vortex';

export type HandSkin = 'cyber' | 'holo' | 'ghost' | 'rainbow' | 'gold';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ja';

export type ColorblindMode = 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'high_contrast';

export interface WeaponInfo {
  id: WeaponType;
  name: string;
  emoji: string;
  description: string;
  color: string;
  soundFx: string;
}

export interface HandData {
  handIndex: number;
  label: 'Left' | 'Right';
  indexTip: Point;
  palmCenter: Point;
  wrist: Point;
  landmarks: Point[];
  isFist: boolean;
  isOpenPalm: boolean;
  velocity: Point;
}

export interface FruitItem {
  id: string;
  type: FruitType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  isSliced: boolean;
  isFrozen?: boolean;
  freezeTimer?: number;
  sliceAngle?: number;
  sliceProgress?: number;
  leftHalfVx?: number;
  leftHalfVy?: number;
  rightHalfVx?: number;
  rightHalfVy?: number;
  label?: string | number;
  isTarget?: boolean;
}

export interface BossItem {
  id: string;
  name: string;
  type: 'megamelon' | 'dragon_lord' | 'cyborg_bomb';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  phase: number;
  color: string;
  isDefeated: boolean;
  hitFlashTimer?: number;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  damage: number;
  life: number;
  color: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  type: 'juice' | 'spark' | 'smoke' | 'ice' | 'lightning' | 'vortex';
}

export interface JuiceSplatter {
  x: number;
  y: number;
  color: string;
  radius: number;
  opacity: number;
  points: { angle: number; r: number }[];
}

export interface ShockwaveEffect {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  type: 'hammer' | 'laser' | 'freeze' | 'vortex';
  opacity: number;
}

export interface BladePoint {
  x: number;
  y: number;
  time: number;
  handIndex: number;
}

export type BladeStyle = 'fire' | 'electric' | 'emerald' | 'rainbow' | 'ice' | 'shadow';

export type GameMode = 'arcade' | 'math' | 'nutrition' | 'boss' | 'teacher_quiz';

export type MathDifficulty = 'easy' | 'medium' | 'hard' | 'adaptive';

export interface MathQuestion {
  equation: string;
  answer: number;
  options: number[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
}

export interface QuizPack {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
}

export interface FruitFact {
  type: FruitType;
  name: string;
  emoji: string;
  color: string;
  vitamins: string[];
  funFact: string;
  healthBenefit: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  fruitsCut: number;
  bombsHit: number;
  maxCombo: number;
  mathSolved: number;
  mathAttempted: number;
  accuracy: number;
  timePlayedSeconds: number;
  weaponUsed: WeaponType;
  bossDefeated?: string;
  xpEarned: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  nextLevelXp: number;
  highScore: number;
  totalFruitsCut: number;
  unlockedSkins: HandSkin[];
  activeSkin: HandSkin;
  completedQuests: string[];
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardXp: number;
  completed: boolean;
}

// Window declaration for MediaPipe CDN scripts
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

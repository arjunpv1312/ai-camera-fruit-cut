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

export type GameMode = 'arcade' | 'math' | 'nutrition';

export type MathDifficulty = 'easy' | 'medium' | 'hard';

export interface MathQuestion {
  equation: string;
  answer: number;
  options: number[];
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
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

// Window declaration for MediaPipe CDN scripts
declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

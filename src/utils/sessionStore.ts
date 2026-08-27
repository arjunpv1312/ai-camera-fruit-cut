import type { BladeStyle, ColorblindMode, GameMode, Language, MathDifficulty, WeaponType } from '../types/game';

const SESSION_STORAGE_KEY = 'fruit_ninja_ai_session_v3';

export interface GameSessionState {
  gameMode: GameMode;
  currentWeapon: WeaponType;
  mathDifficulty: MathDifficulty;
  bladeStyle: BladeStyle;
  currentLang: Language;
  colorblindMode: ColorblindMode;
  showFps: boolean;
  isCameraActive: boolean;
  isMuted: boolean;
}

export const DEFAULT_SESSION: GameSessionState = {
  gameMode: 'arcade',
  currentWeapon: 'katana',
  mathDifficulty: 'easy',
  bladeStyle: 'electric',
  currentLang: 'en',
  colorblindMode: 'none',
  showFps: false,
  isCameraActive: true,
  isMuted: false,
};

export function loadSessionState(): GameSessionState {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SESSION, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load session state', e);
  }
  return DEFAULT_SESSION;
}

export function saveSessionState(state: Partial<GameSessionState>) {
  try {
    const current = loadSessionState();
    const merged = { ...current, ...state };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn('Failed to save session state', e);
  }
}

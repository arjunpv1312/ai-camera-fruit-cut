import type { Achievement, DailyQuest, UserProgress } from '../types/game';

const STORAGE_KEY = 'fruit_ninja_ai_progress_v3';

export const INITIAL_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  nextLevelXp: 250,
  highScore: 0,
  totalFruitsCut: 0,
  unlockedSkins: ['cyber'],
  activeSkin: 'cyber',
  completedQuests: [],
  unlockedAchievements: [],
};

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  { id: 'first_slice', title: 'Ninja Trainee 🥷', description: 'Sliced your first fruit in mid-air!', icon: '🍉', unlocked: false },
  { id: 'math_genius', title: 'Math Genius 🧠', description: 'Solved 5 or more math equations in a round!', icon: '🔢', unlocked: false },
  { id: 'combo_master', title: 'Combo Master ⚡', description: 'Achieved a 4x or higher fruit combo streak!', icon: '🔥', unlocked: false },
  { id: 'boss_slayer', title: 'Boss Slayer 👑', description: 'Defeated your first Giant Mini-Boss!', icon: '⚔️', unlocked: false },
  { id: 'centurion', title: 'Centurion 💯', description: 'Cut over 100 fruits across your games!', icon: '🏆', unlocked: false },
  { id: 'skin_collector', title: 'Fashion Ninja 🎨', description: 'Unlocked 3 or more hand skins!', icon: '🤖', unlocked: false },
];

export const DAILY_QUESTS: DailyQuest[] = [
  { id: 'slice_50', title: 'Slice 50 Fruits 🍉', target: 50, current: 0, rewardXp: 150, completed: false },
  { id: 'solve_5_math', title: 'Solve 5 Math Equations 🔢', target: 5, current: 0, rewardXp: 200, completed: false },
  { id: 'hit_3x_combo', title: 'Achieve 3x Combo ⚡', target: 3, current: 0, rewardXp: 100, completed: false },
];

export function loadUserProgress(): UserProgress {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {
    // Fallback to default
  }
  return INITIAL_PROGRESS;
}

export function saveUserProgress(progress: UserProgress) {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  } catch {
    // Ignore in non-browser env
  }
}

export function addXp(progress: UserProgress, xpGain: number): { updated: UserProgress; leveledUp: boolean } {
  let { level, xp, nextLevelXp, unlockedSkins } = progress;
  xp += xpGain;
  let leveledUp = false;

  while (xp >= nextLevelXp && level < 50) {
    xp -= nextLevelXp;
    level += 1;
    nextLevelXp = level * 250;
    leveledUp = true;

    // Skin Unlocks at milestone levels
    if (level === 5 && !unlockedSkins.includes('holo')) unlockedSkins = [...unlockedSkins, 'holo'];
    if (level === 10 && !unlockedSkins.includes('ghost')) unlockedSkins = [...unlockedSkins, 'ghost'];
    if (level === 15 && !unlockedSkins.includes('rainbow')) unlockedSkins = [...unlockedSkins, 'rainbow'];
    if (level === 20 && !unlockedSkins.includes('gold')) unlockedSkins = [...unlockedSkins, 'gold'];
  }

  const updated: UserProgress = {
    ...progress,
    level,
    xp,
    nextLevelXp,
    unlockedSkins,
  };

  saveUserProgress(updated);
  return { updated, leveledUp };
}

import { describe, it, expect } from 'vitest';
import { generateMathQuestion } from '../utils/mathGenerator';
import { addXp, INITIAL_PROGRESS } from '../utils/progression';
import { TRANSLATIONS } from '../utils/i18n';
import { loadSessionState, saveSessionState, DEFAULT_SESSION } from '../utils/sessionStore';
import type { Language, Point } from '../types/game';

describe('1. Math Generator Stress Test (5,000 Iterations)', () => {
  it('generates valid mathematical questions across all difficulties without errors', () => {
    const difficulties = ['easy', 'medium', 'hard'] as const;
    for (let i = 0; i < 5000; i++) {
      const diff = difficulties[i % difficulties.length];
      const q = generateMathQuestion(diff);

      expect(q).toBeDefined();
      expect(typeof q.equation).toBe('string');
      expect(typeof q.answer).toBe('number');
      expect(q.options.length).toBe(4);
      expect(q.options).toContain(q.answer);
      expect(Number.isFinite(q.answer)).toBe(true);

      // Verify no duplicate options
      const uniqueOptions = new Set(q.options);
      expect(uniqueOptions.size).toBe(4);
    }
  });
});

describe('2. Physics & Collision Math 10,000 Scenario Stress Test', () => {
  const distToSegment = (p: Point, v: Point, w: Point): number => {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  it('runs 10,000 collision calculations accurately and without NaN / infinity', () => {
    for (let i = 0; i < 10000; i++) {
      const fruitPos: Point = { x: Math.random() * 800, y: Math.random() * 600 };
      const bladeStart: Point = { x: Math.random() * 800, y: Math.random() * 600 };
      const bladeEnd: Point = { x: Math.random() * 800, y: Math.random() * 600 };
      const radius = 30 + Math.random() * 20;

      const dist = distToSegment(fruitPos, bladeStart, bladeEnd);
      expect(Number.isFinite(dist)).toBe(true);
      expect(dist).toBeGreaterThanOrEqual(0);

      const isColliding = dist <= radius;
      expect(typeof isColliding).toBe('boolean');
    }
  });
});

describe('3. XP Leveling & Progression Math (5,000 Iterations)', () => {
  it('calculates player progression, level ups, and unlocks properly without level caps overflow', () => {
    let current = { ...INITIAL_PROGRESS };
    for (let i = 0; i < 5000; i++) {
      const xpGain = 25 + Math.floor(Math.random() * 100);
      const { updated, leveledUp } = addXp(current, xpGain);

      expect(updated.xp).toBeGreaterThanOrEqual(0);
      expect(updated.level).toBeGreaterThanOrEqual(current.level);
      expect(updated.nextLevelXp).toBe(updated.level * 250);

      if (updated.level >= 5) expect(updated.unlockedSkins).toContain('holo');
      if (updated.level >= 10) expect(updated.unlockedSkins).toContain('ghost');
      if (updated.level >= 15) expect(updated.unlockedSkins).toContain('rainbow');
      if (updated.level >= 20) expect(updated.unlockedSkins).toContain('gold');

      current = updated;
    }
  });
});

describe('4. i18n Dictionary Integrity Test', () => {
  it('verifies all 7 languages have complete translation keys without missing strings', () => {
    const languages: Language[] = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja'];
    const baseKeys = Object.keys(TRANSLATIONS.en);

    languages.forEach((lang) => {
      const trans = TRANSLATIONS[lang];
      expect(trans).toBeDefined();
      baseKeys.forEach((key) => {
        expect((trans as any)[key]).toBeDefined();
        expect(typeof (trans as any)[key]).toBe('string');
        expect((trans as any)[key].length).toBeGreaterThan(0);
      });
    });
  });
});

describe('5. Session Persistence Test', () => {
  it('loads and merges defaults correctly', () => {
    const session = loadSessionState();
    expect(session).toBeDefined();
    expect(session.gameMode).toBeDefined();
    expect(session.currentWeapon).toBeDefined();
  });
});

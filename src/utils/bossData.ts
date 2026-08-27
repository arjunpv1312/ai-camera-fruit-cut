import type { BossItem } from '../types/game';

export interface BossInfo {
  type: 'megamelon' | 'dragon_lord' | 'cyborg_bomb';
  name: string;
  maxHp: number;
  color: string;
  radius: number;
  description: string;
}

export const BOSS_CONFIGS: Record<string, BossInfo> = {
  megamelon: {
    type: 'megamelon',
    name: 'MEGAMELON KING 🍉👑',
    maxHp: 1000,
    color: '#2e7d32',
    radius: 90,
    description: 'The giant watermelon monarch! Slicing deals multi-hit damage.',
  },
  dragon_lord: {
    type: 'dragon_lord',
    name: 'DRAGONFRUIT OVERLORD 🐉🔥',
    maxHp: 1500,
    color: '#e91e63',
    radius: 95,
    description: 'High-speed pink flame dragonfruit that shoots seed fireballs!',
  },
  cyborg_bomb: {
    type: 'cyborg_bomb',
    name: 'CYBORG BOMB TITAN 🤖💣',
    maxHp: 2000,
    color: '#374151',
    radius: 100,
    description: 'Heavy armored cyborg bomb. Best destroyed with Thunder Hammer & Laser Cannon!',
  },
};

export function spawnBossWave(type: 'megamelon' | 'dragon_lord' | 'cyborg_bomb', screenWidth: number): BossItem {
  const config = BOSS_CONFIGS[type];
  return {
    id: `boss_${type}_${Date.now()}`,
    name: config.name,
    type,
    x: screenWidth / 2,
    y: -120,
    vx: (Math.random() - 0.5) * 4,
    vy: 2.5,
    radius: config.radius,
    hp: config.maxHp,
    maxHp: config.maxHp,
    phase: 1,
    color: config.color,
    isDefeated: false,
    hitFlashTimer: 0,
  };
}

export function drawBoss(ctx: CanvasRenderingContext2D, boss: BossItem) {
  ctx.save();
  ctx.translate(boss.x, boss.y);

  // Flash white on hit
  if (boss.hitFlashTimer && boss.hitFlashTimer > 0) {
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 30;
  } else {
    ctx.shadowColor = boss.color;
    ctx.shadowBlur = 20;
  }

  // Draw Giant Boss Body
  ctx.beginPath();
  ctx.arc(0, 0, boss.radius, 0, Math.PI * 2);

  if (boss.type === 'megamelon') {
    ctx.fillStyle = '#1b5e20';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#4caf50';
    ctx.stroke();

    // Inner red pulp ring
    ctx.beginPath();
    ctx.arc(0, 0, boss.radius - 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ff1744';
    ctx.fill();

    // Crown icon on top
    ctx.font = '40px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', 0, -boss.radius * 0.4);
  } else if (boss.type === 'dragon_lord') {
    ctx.fillStyle = '#c2185b';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f48fb1';
    ctx.stroke();

    // Inner pulp
    ctx.beginPath();
    ctx.arc(0, 0, boss.radius - 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Dragon icon
    ctx.font = '44px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐉', 0, 0);
  } else {
    // Cyborg Bomb
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Robot eyes
    ctx.font = '44px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🤖', 0, 0);
  }

  ctx.restore();
}

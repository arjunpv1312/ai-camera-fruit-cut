import React, { useEffect, useRef } from 'react';
import type {
  Achievement,
  BladePoint,
  BladeStyle,
  BossItem,
  ColorblindMode,
  DamageNumber,
  FruitItem,
  FruitType,
  GameMode,
  GameStats,
  HandData,
  HandSkin,
  JuiceSplatter,
  MathDifficulty,
  MathQuestion,
  Particle,
  Point,
  QuizPack,
  ShockwaveEffect,
  WeaponType,
} from '../types/game';
import { audioEngine } from '../utils/audioEngine';
import { drawFruit, FRUIT_CONFIGS } from '../utils/fruitData';
import { generateMathQuestion } from '../utils/mathGenerator';
import { FRUIT_TRIVIA } from '../utils/triviaData';
import { drawBoss, spawnBossWave } from '../utils/bossData';
import { WEAPON_CATALOG } from './WeaponSelector';

interface GameCanvasProps {
  handsData: HandData[];
  gameMode: GameMode;
  currentWeapon: WeaponType;
  activeSkin: HandSkin;
  colorblindMode: ColorblindMode;
  showFps: boolean;
  activeQuizPack?: QuizPack | null;
  isPlaying: boolean;
  isPaused: boolean;
  bladeStyle: BladeStyle;
  mathDifficulty: MathDifficulty;
  onGameOver: (stats: GameStats, newAchievements: Achievement[]) => void;
  onQuestionChange?: (question: MathQuestion | null) => void;
  onComboUpdate?: (combo: number) => void;
  onScoreUpdate?: (score: number) => void;
  onLivesUpdate?: (lives: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  handsData,
  gameMode,
  currentWeapon,
  activeSkin,
  colorblindMode,
  showFps,
  activeQuizPack: _activeQuizPack,
  isPlaying,
  isPaused,
  bladeStyle,
  mathDifficulty,
  onGameOver,
  onQuestionChange,
  onComboUpdate,
  onScoreUpdate,
  onLivesUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable refs for high performance 60 FPS animation loop
  const fruitsRef = useRef<FruitItem[]>([]);
  const bossRef = useRef<BossItem | null>(null);
  const damageNumbersRef = useRef<DamageNumber[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const splattersRef = useRef<JuiceSplatter[]>([]);
  const shockwavesRef = useRef<ShockwaveEffect[]>([]);
  const bladePointsRef = useRef<BladePoint[]>([]);

  // Smoothed hand position storage for EMA interpolation (zero lag)
  const smoothedHandsRef = useRef<Record<number, Point>>({});

  const isMouseDownRef = useRef<boolean>(false);
  const lastSliceTimeRef = useRef<number>(0);
  const comboCountRef = useRef<number>(0);
  const comboResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FPS Counter stats
  const fpsRef = useRef<number>(60);
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(Date.now());

  // Score & stats tracking refs
  const scoreRef = useRef<number>(0);
  const fruitsCutRef = useRef<number>(0);
  const mathSolvedRef = useRef<number>(0);
  const mathAttemptedRef = useRef<number>(0);
  const bombsHitRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);
  const totalSwipesRef = useRef<number>(0);

  // Game state refs
  const livesRef = useRef<number>(3);
  const currentMathRef = useRef<MathQuestion | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear state when new game starts
  useEffect(() => {
    if (isPlaying) {
      scoreRef.current = 0;
      fruitsCutRef.current = 0;
      mathSolvedRef.current = 0;
      mathAttemptedRef.current = 0;
      bombsHitRef.current = 0;
      maxComboRef.current = 0;
      totalSwipesRef.current = 0;
      livesRef.current = 3;
      fruitsRef.current = [];
      bossRef.current = null;
      damageNumbersRef.current = [];
      particlesRef.current = [];
      splattersRef.current = [];
      shockwavesRef.current = [];
      bladePointsRef.current = [];

      if (onScoreUpdate) onScoreUpdate(0);
      if (onLivesUpdate) onLivesUpdate(3);

      if (bgCanvasRef.current) {
        const bgCtx = bgCanvasRef.current.getContext('2d');
        bgCtx?.clearRect(0, 0, bgCanvasRef.current.width, bgCanvasRef.current.height);
      }

      if (gameMode === 'math') {
        spawnMathWave();
      } else if (gameMode === 'boss' && canvasRef.current) {
        bossRef.current = spawnBossWave('megamelon', canvasRef.current.width);
      } else {
        startFruitSpawning();
      }
    }

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, gameMode, mathDifficulty]);

  // Process Dual Air Hands Data with Smooth EMA Interpolation
  useEffect(() => {
    if (!canvasRef.current || !isPlaying || isPaused || handsData.length === 0) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    handsData.forEach((hand) => {
      const rawX = hand.indexTip.x * width;
      const rawY = hand.indexTip.y * height;

      const prev = smoothedHandsRef.current[hand.handIndex] || { x: rawX, y: rawY };
      const smoothX = prev.x + (rawX - prev.x) * 0.65;
      const smoothY = prev.y + (rawY - prev.y) * 0.65;
      smoothedHandsRef.current[hand.handIndex] = { x: smoothX, y: smoothY };

      addBladePoint(smoothX, smoothY, hand.handIndex);

      if (currentWeapon === 'hammer' && (hand.isFist || hand.isOpenPalm)) {
        triggerHammerShockwave(smoothX, smoothY);
      } else if (currentWeapon === 'laser' && hand.isOpenPalm) {
        triggerPlasmaLaser(smoothX, smoothY);
      } else if (currentWeapon === 'vortex' && hand.isFist) {
        triggerGravityVortex(smoothX, smoothY);
      } else if (currentWeapon === 'frost') {
        triggerFrostAura(smoothX, smoothY);
      }
    });
  }, [handsData, isPlaying, isPaused, currentWeapon]);

  // Weapon Action 1: Thunder Hammer Shockwave
  const triggerHammerShockwave = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastSliceTimeRef.current < 250) return;
    lastSliceTimeRef.current = now;

    audioEngine.playHammerShockwave();
    shockwavesRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: 240,
      color: '#38bdf8',
      type: 'hammer',
      opacity: 1,
    });

    // Damage Boss if active
    if (bossRef.current && !bossRef.current.isDefeated) {
      const dist = Math.hypot(bossRef.current.x - x, bossRef.current.y - y);
      if (dist <= 240 + bossRef.current.radius) {
        damageBoss(80, x, y);
      }
    }

    fruitsRef.current.forEach((fruit) => {
      if (fruit.isSliced) return;
      const dist = Math.hypot(fruit.x - x, fruit.y - y);
      if (dist <= 240) {
        sliceFruit(fruit, Math.random() * Math.PI * 2);
      }
    });
  };

  // Weapon Action 2: Plasma Laser Ray
  const triggerPlasmaLaser = (x: number, y: number) => {
    audioEngine.playLaserBeam();
    shockwavesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: 160,
      color: '#34d399',
      type: 'laser',
      opacity: 1,
    });

    if (bossRef.current && !bossRef.current.isDefeated) {
      if (Math.abs(bossRef.current.x - x) < 80) {
        damageBoss(50, x, y);
      }
    }

    fruitsRef.current.forEach((fruit) => {
      if (fruit.isSliced) return;
      if (Math.abs(fruit.x - x) < 60 && fruit.y > y) {
        sliceFruit(fruit, Math.PI / 2);
      }
    });
  };

  // Weapon Action 3: Gravity Vortex Black Hole Pull
  const triggerGravityVortex = (x: number, y: number) => {
    audioEngine.playVortexPull();
    shockwavesRef.current.push({
      x,
      y,
      radius: 15,
      maxRadius: 180,
      color: '#c084fc',
      type: 'vortex',
      opacity: 0.9,
    });

    if (bossRef.current && !bossRef.current.isDefeated) {
      damageBoss(40, x, y);
    }

    fruitsRef.current.forEach((fruit) => {
      if (fruit.isSliced) return;
      const dx = x - fruit.x;
      const dy = y - fruit.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 320) {
        fruit.vx += (dx / dist) * 2.5;
        fruit.vy += (dy / dist) * 2.5;

        if (dist < 45) {
          sliceFruit(fruit, Math.random() * Math.PI * 2);
        }
      }
    });
  };

  // Weapon Action 4: Frost Freeze Aura
  const triggerFrostAura = (x: number, y: number) => {
    fruitsRef.current.forEach((fruit) => {
      if (fruit.isSliced) return;
      const dist = Math.hypot(fruit.x - x, fruit.y - y);
      if (dist < 120 && !fruit.isFrozen) {
        fruit.isFrozen = true;
        fruit.vx *= 0.1;
        fruit.vy *= 0.1;
        audioEngine.playFrostFreeze();
      }
    });
  };

  // Damage Boss Function
  const damageBoss = (amount: number, hitX: number, hitY: number) => {
    if (!bossRef.current || bossRef.current.isDefeated) return;
    bossRef.current.hp -= amount;
    bossRef.current.hitFlashTimer = 5;

    damageNumbersRef.current.push({
      id: `dmg_${Date.now()}_${Math.random()}`,
      x: hitX + (Math.random() - 0.5) * 40,
      y: hitY,
      damage: amount,
      life: 0,
      color: '#ffea00',
    });

    if (bossRef.current.hp <= 0) {
      bossRef.current.isDefeated = true;
      scoreRef.current += 1000;
      if (onScoreUpdate) onScoreUpdate(scoreRef.current);

      // Defeat Explosion
      createExplosionParticles(bossRef.current.x, bossRef.current.y);
      audioEngine.playMathSuccess();

      setTimeout(() => {
        endGame();
      }, 1500);
    }
  };

  // Spawn Math equation wave
  const spawnMathWave = () => {
    const q = generateMathQuestion(mathDifficulty === 'adaptive' ? 'medium' : mathDifficulty);
    currentMathRef.current = q;
    if (onQuestionChange) onQuestionChange(q);

    if (!canvasRef.current) return;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    const fruitKeys: FruitType[] = ['watermelon', 'orange', 'apple', 'pineapple'];
    const newFruits: FruitItem[] = [];

    q.options.forEach((numOption, idx) => {
      const startX = width * 0.2 + idx * (width * 0.2);
      const isTarget = numOption === q.answer;
      const type = fruitKeys[idx % fruitKeys.length];

      newFruits.push({
        id: `math_${Date.now()}_${idx}`,
        type,
        x: startX,
        y: height + 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -(12 + Math.random() * 3),
        radius: FRUIT_CONFIGS[type].radius,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        isSliced: false,
        label: numOption,
        isTarget,
      });
    });

    fruitsRef.current = newFruits;
  };

  // Start continuous Arcade / Nutrition spawning
  const startFruitSpawning = () => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    spawnTimerRef.current = setInterval(() => {
      if (!isPlaying || isPaused || !canvasRef.current) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      const waveCount = Math.floor(Math.random() * 3) + 2;
      const fruitTypes: FruitType[] = [
        'watermelon',
        'banana',
        'strawberry',
        'pineapple',
        'orange',
        'apple',
        'dragonfruit',
        'kiwi',
        'coconut',
      ];

      for (let i = 0; i < waveCount; i++) {
        let type: FruitType;
        const bombChance = gameMode === 'nutrition' ? 0.3 : 0.2;
        if (Math.random() < bombChance) {
          type = gameMode === 'nutrition' ? 'junkfood' : 'bomb';
        } else {
          type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        }

        const startX = width * 0.15 + Math.random() * (width * 0.7);
        const vx = (width / 2 - startX) * 0.008 + (Math.random() - 0.5) * 4;
        const vy = -(13 + Math.random() * 5);

        let label: string | undefined = undefined;
        if (gameMode === 'nutrition' && type !== 'junkfood' && type !== 'bomb') {
          const trivia = FRUIT_TRIVIA[type];
          if (trivia && trivia.vitamins.length > 0) {
            label = trivia.vitamins[0];
          }
        }

        fruitsRef.current.push({
          id: `fruit_${Date.now()}_${i}_${Math.random()}`,
          type,
          x: startX,
          y: height + 60,
          vx,
          vy,
          radius: FRUIT_CONFIGS[type].radius,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          isSliced: false,
          label,
        });
      }
    }, 2400);
  };

  // Add Blade trajectory point
  const addBladePoint = (x: number, y: number, handIndex: number = 0) => {
    const now = Date.now();
    bladePointsRef.current.push({ x, y, time: now, handIndex });
    totalSwipesRef.current += 1;

    bladePointsRef.current = bladePointsRef.current.filter((p) => now - p.time < 200);

    if (bladePointsRef.current.length >= 3) {
      const pPrev = bladePointsRef.current[bladePointsRef.current.length - 3];
      const dist = Math.hypot(x - pPrev.x, y - pPrev.y);
      if (dist > 40 && now - lastSliceTimeRef.current > 160) {
        if (currentWeapon === 'katana') audioEngine.playKatanaSlice();
        else audioEngine.playSwish();
        lastSliceTimeRef.current = now;
      }
    }

    checkSliceCollisions();
  };

  // Slice collision detection against blade line segments
  const checkSliceCollisions = () => {
    const points = bladePointsRef.current;
    if (points.length < 2) return;

    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Check Boss collision
    if (bossRef.current && !bossRef.current.isDefeated) {
      const dist = distToSegment({ x: bossRef.current.x, y: bossRef.current.y }, p1, p2);
      if (dist <= bossRef.current.radius) {
        damageBoss(35, p2.x, p2.y);
      }
    }

    fruitsRef.current.forEach((fruit) => {
      if (fruit.isSliced) return;

      const dist = distToSegment({ x: fruit.x, y: fruit.y }, p1, p2);
      if (dist <= fruit.radius) {
        sliceFruit(fruit, sliceAngle);
      }
    });
  };

  const distToSegment = (p: Point, v: Point, w: Point) => {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  // Slice fruit action & scoring
  const sliceFruit = (fruit: FruitItem, sliceAngle: number) => {
    fruit.isSliced = true;
    fruit.sliceAngle = sliceAngle;
    fruit.sliceProgress = 0;

    const normalAngle = sliceAngle + Math.PI / 2;
    const splitSpeed = 5 + Math.random() * 3;

    fruit.leftHalfVx = fruit.vx + Math.cos(normalAngle) * splitSpeed;
    fruit.leftHalfVy = fruit.vy + Math.sin(normalAngle) * splitSpeed;
    fruit.rightHalfVx = fruit.vx - Math.cos(normalAngle) * splitSpeed;
    fruit.rightHalfVy = fruit.vy - Math.sin(normalAngle) * splitSpeed;

    // Bomb hit
    if (fruit.type === 'bomb' || fruit.type === 'junkfood') {
      audioEngine.playBomb();
      bombsHitRef.current += 1;
      livesRef.current -= 1;
      if (onLivesUpdate) onLivesUpdate(livesRef.current);
      createExplosionParticles(fruit.x, fruit.y);

      if (livesRef.current <= 0) {
        endGame();
      }
      return;
    }

    // Math Mode
    if (gameMode === 'math') {
      mathAttemptedRef.current += 1;
      if (fruit.isTarget) {
        audioEngine.playMathSuccess();
        mathSolvedRef.current += 1;
        scoreRef.current += 50;
        if (onScoreUpdate) onScoreUpdate(scoreRef.current);
        createJuiceParticles(fruit.x, fruit.y, FRUIT_CONFIGS[fruit.type].juiceColors);

        setTimeout(() => {
          if (isPlaying && !isPaused) spawnMathWave();
        }, 800);
      } else {
        audioEngine.playSplat();
        livesRef.current -= 1;
        if (onLivesUpdate) onLivesUpdate(livesRef.current);
        if (livesRef.current <= 0) {
          endGame();
        }
      }
      return;
    }

    // Arcade & Nutrition scoring
    audioEngine.playSplat();
    fruitsCutRef.current += 1;
    scoreRef.current += FRUIT_CONFIGS[fruit.type].points;
    if (onScoreUpdate) onScoreUpdate(scoreRef.current);

    comboCountRef.current += 1;
    if (comboCountRef.current > maxComboRef.current) {
      maxComboRef.current = comboCountRef.current;
    }
    if (onComboUpdate) onComboUpdate(comboCountRef.current);

    if (comboCountRef.current >= 3) {
      audioEngine.playCombo(comboCountRef.current);
    }

    if (comboResetTimerRef.current) clearTimeout(comboResetTimerRef.current);
    comboResetTimerRef.current = setTimeout(() => {
      comboCountRef.current = 0;
      if (onComboUpdate) onComboUpdate(0);
    }, 450);

    createJuiceParticles(fruit.x, fruit.y, FRUIT_CONFIGS[fruit.type].juiceColors);
    createJuiceSplatter(fruit.x, fruit.y, FRUIT_CONFIGS[fruit.type].juiceColors[0]);
  };

  // Particles & Splatters
  const createJuiceParticles = (x: number, y: number, colors: string[]) => {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
        life: 1,
        maxLife: 30 + Math.random() * 20,
        type: 'juice',
      });
    }
  };

  const createExplosionParticles = (x: number, y: number) => {
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 12;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.5 ? '#ff3d00' : '#ffab00',
        size: 4 + Math.random() * 6,
        life: 1,
        maxLife: 40,
        type: 'smoke',
      });
    }
  };

  const createJuiceSplatter = (x: number, y: number, color: string) => {
    if (!bgCanvasRef.current) return;
    const bgCtx = bgCanvasRef.current.getContext('2d');
    if (!bgCtx) return;

    const points = [];
    const radius = 25 + Math.random() * 25;
    for (let i = 0; i < 8; i++) {
      points.push({
        angle: (i * Math.PI) / 4,
        r: radius * (0.6 + Math.random() * 0.7),
      });
    }

    bgCtx.save();
    bgCtx.fillStyle = color;
    bgCtx.globalAlpha = 0.45;
    bgCtx.beginPath();
    bgCtx.moveTo(x + Math.cos(points[0].angle) * points[0].r, y + Math.sin(points[0].angle) * points[0].r);
    for (let i = 1; i < points.length; i++) {
      bgCtx.lineTo(x + Math.cos(points[i].angle) * points[i].r, y + Math.sin(points[i].angle) * points[i].r);
    }
    bgCtx.closePath();
    bgCtx.fill();
    bgCtx.restore();
  };

  const endGame = () => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);

    const accuracy =
      totalSwipesRef.current > 0
        ? Math.min(100, Math.round((fruitsCutRef.current / (totalSwipesRef.current * 0.3)) * 100))
        : 85;

    const stats: GameStats = {
      score: scoreRef.current,
      highScore: scoreRef.current,
      fruitsCut: fruitsCutRef.current,
      bombsHit: bombsHitRef.current,
      maxCombo: maxComboRef.current,
      mathSolved: mathSolvedRef.current,
      mathAttempted: mathAttemptedRef.current,
      accuracy,
      timePlayedSeconds: 60,
      weaponUsed: currentWeapon,
      xpEarned: Math.floor(scoreRef.current * 0.2) + fruitsCutRef.current * 5,
    };

    const achievements: Achievement[] = [
      {
        id: 'first_slice',
        title: 'Ninja Trainee 🥷',
        description: 'Sliced your first fruit!',
        icon: '🍉',
        unlocked: fruitsCutRef.current > 0,
      },
      {
        id: 'math_genius',
        title: 'Math Genius 🧠',
        description: 'Solved 5 or more math equations correctly!',
        icon: '🔢',
        unlocked: mathSolvedRef.current >= 5,
      },
      {
        id: 'combo_master',
        title: 'Combo Master ⚡',
        description: 'Achieved a 4x or higher fruit combo!',
        icon: '🔥',
        unlocked: maxComboRef.current >= 4,
      },
    ];

    onGameOver(stats, achievements);
  };

  // Main 60 FPS Canvas Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const gravity = 0.38;

      // Calculate FPS
      frameCountRef.current += 1;
      const now = Date.now();
      if (now - lastFpsTimeRef.current >= 1000) {
        fpsRef.current = frameCountRef.current;
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      ctx.clearRect(0, 0, width, height);

      // Colorblind High Contrast Filter
      if (colorblindMode === 'high_contrast') {
        ctx.filter = 'contrast(1.5) saturate(1.8)';
      } else if (colorblindMode !== 'none') {
        ctx.filter = 'saturate(1.4)';
      } else {
        ctx.filter = 'none';
      }

      if (isPlaying && !isPaused) {
        // Update & Draw Boss if active
        if (bossRef.current && !bossRef.current.isDefeated) {
          const boss = bossRef.current;
          boss.x += boss.vx;
          boss.y += boss.vy;

          if (boss.x < boss.radius || boss.x > width - boss.radius) boss.vx *= -1;
          if (boss.y > height * 0.5 || boss.y < 80) boss.vy *= -1;
          if (boss.hitFlashTimer && boss.hitFlashTimer > 0) boss.hitFlashTimer -= 1;

          drawBoss(ctx, boss);

          // Draw Boss HP Bar
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.fillRect(width / 2 - 150, 20, 300, 24);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#f43f5e';
          ctx.strokeRect(width / 2 - 150, 20, 300, 24);

          const hpRatio = Math.max(0, boss.hp / boss.maxHp);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(width / 2 - 148, 22, 296 * hpRatio, 20);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${boss.name} (${Math.max(0, boss.hp)} / ${boss.maxHp} HP)`, width / 2, 36);
          ctx.restore();
        }

        // Update & Draw Floating Damage Numbers
        damageNumbersRef.current.forEach((dmg) => {
          dmg.y -= 1.5;
          dmg.life += 1;
          ctx.save();
          ctx.fillStyle = dmg.color;
          ctx.font = 'bold 22px Outfit, sans-serif';
          ctx.globalAlpha = Math.max(0, 1 - dmg.life / 35);
          ctx.fillText(`-${dmg.damage}`, dmg.x, dmg.y);
          ctx.restore();
        });
        damageNumbersRef.current = damageNumbersRef.current.filter((d) => d.life < 35);

        // Update & Draw Fruits
        fruitsRef.current.forEach((fruit) => {
          if (!fruit.isSliced) {
            fruit.x += fruit.vx;
            fruit.y += fruit.vy;
            if (!fruit.isFrozen) {
              fruit.vy += gravity;
            }
            fruit.rotation += fruit.rotationSpeed;

            drawFruit(ctx, fruit.type, fruit.x, fruit.y, fruit.radius, fruit.rotation, fruit.label);

            if (fruit.isFrozen) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(fruit.x, fruit.y, fruit.radius + 6, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(125, 211, 252, 0.4)';
              ctx.fill();
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2.5;
              ctx.stroke();
              ctx.restore();
            }

            if (fruit.y > height + 80 && fruit.vy > 0 && gameMode === 'arcade' && fruit.type !== 'bomb') {
              livesRef.current -= 1;
              if (onLivesUpdate) onLivesUpdate(livesRef.current);
              if (livesRef.current <= 0) endGame();
            }
          } else {
            // Sliced Half Fruits Physics
            fruit.sliceProgress = (fruit.sliceProgress || 0) + 0.05;

            const lx = fruit.x + (fruit.leftHalfVx || 0) * (fruit.sliceProgress * 3);
            const ly = fruit.y + (fruit.leftHalfVy || 0) * (fruit.sliceProgress * 3) + 0.5 * gravity * fruit.sliceProgress ** 2;
            drawFruit(ctx, fruit.type, lx, ly, fruit.radius, fruit.rotation, undefined, true, 'left', fruit.sliceAngle || 0);

            const rx = fruit.x + (fruit.rightHalfVx || 0) * (fruit.sliceProgress * 3);
            const ry = fruit.y + (fruit.rightHalfVy || 0) * (fruit.sliceProgress * 3) + 0.5 * gravity * fruit.sliceProgress ** 2;
            drawFruit(ctx, fruit.type, rx, ry, fruit.radius, fruit.rotation, undefined, true, 'right', fruit.sliceAngle || 0);
          }
        });

        fruitsRef.current = fruitsRef.current.filter((f) => f.y < height + 150);

        // Shockwaves
        shockwavesRef.current.forEach((s) => {
          s.radius += 12;
          s.opacity = 1 - s.radius / s.maxRadius;

          ctx.save();
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.opacity);
          ctx.lineWidth = 5;
          ctx.stroke();
          ctx.restore();
        });
        shockwavesRef.current = shockwavesRef.current.filter((s) => s.radius < s.maxRadius);

        // Particles
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.life += 1;

          const alpha = 1 - p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

        // Draw Hands & Blade Trail
        drawHandsAndWeapons(ctx);
        drawBladeTrail(ctx);

        // FPS & Performance HUD Overlay
        if (showFps) {
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(width - 110, 10, 100, 36);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.strokeRect(width - 110, 10, 100, 36);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px Outfit, sans-serif';
          ctx.fillText(`FPS: ${fpsRef.current}`, width - 100, 26);
          ctx.fillText(`OBJ: ${fruitsRef.current.length + particlesRef.current.length}`, width - 100, 40);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isPaused, bladeStyle, gameMode, currentWeapon, activeSkin, colorblindMode, showFps]);

  // Render Dual Hand Skeleton & Weapon Effects on Canvas
  const drawHandsAndWeapons = (ctx: CanvasRenderingContext2D) => {
    handsData.forEach((hand) => {
      const w = canvasRef.current?.width || 800;
      const h = canvasRef.current?.height || 600;

      const px = hand.indexTip.x * w;
      const py = hand.indexTip.y * h;

      ctx.save();
      const weaponInfo = WEAPON_CATALOG[currentWeapon];
      ctx.font = '28px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(weaponInfo.emoji, px, py);

      const palmX = hand.palmCenter.x * w;
      const palmY = hand.palmCenter.y * h;
      ctx.beginPath();
      ctx.arc(palmX, palmY, 20, 0, Math.PI * 2);

      // Hand Skin Colors
      const skinColors: Record<HandSkin, string> = {
        cyber: hand.handIndex === 0 ? '#38bdf8' : '#f43f5e',
        holo: '#2dd4bf',
        ghost: '#c084fc',
        rainbow: '#f43f5e',
        gold: '#fbbf24',
      };

      ctx.strokeStyle = skinColors[activeSkin] || '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.restore();
    });
  };

  // Render Blade Trail according to style
  const drawBladeTrail = (ctx: CanvasRenderingContext2D) => {
    const points = bladePointsRef.current;
    if (points.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const styleColors: Record<BladeStyle, { glow: string; core: string }> = {
      fire: { glow: '#ff3d00', core: '#ffea00' },
      electric: { glow: '#00e5ff', core: '#ffffff' },
      emerald: { glow: '#00e676', core: '#b9f6ca' },
      rainbow: { glow: '#d500f9', core: '#00e5ff' },
      ice: { glow: '#80d8ff', core: '#ffffff' },
      shadow: { glow: '#aa00ff', core: '#e040fb' },
    };

    const colors = styleColors[bladeStyle] || styleColors.electric;

    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = colors.glow;

    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const widthRatio = i / points.length;

      ctx.lineWidth = widthRatio * 14;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    ctx.strokeStyle = colors.core;
    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const widthRatio = i / points.length;

      ctx.lineWidth = widthRatio * 5;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Mouse / Touch Slicing Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      addBladePoint(e.clientX - rect.left, e.clientY - rect.top, 0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDownRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      addBladePoint(e.clientX - rect.left, e.clientY - rect.top, 0);
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isMouseDownRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      addBladePoint(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, 0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isMouseDownRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      addBladePoint(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, 0);
    }
  };

  // Auto-resize canvas resolution to fill parent container
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && bgCanvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
          bgCanvasRef.current.width = parent.clientWidth;
          bgCanvasRef.current.height = parent.clientHeight;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none cursor-crosshair">
      {/* Background Splatters Canvas */}
      <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Main Interactive Game Physics Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="relative z-10 w-full h-full block"
      />
    </div>
  );
};

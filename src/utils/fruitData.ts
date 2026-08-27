import type { FruitType } from '../types/game';

export interface FruitVisualInfo {
  type: FruitType;
  name: string;
  radius: number;
  primaryColor: string;
  secondaryColor: string;
  juiceColors: string[];
  points: number;
}

export const FRUIT_CONFIGS: Record<FruitType, FruitVisualInfo> = {
  watermelon: {
    type: 'watermelon',
    name: 'Watermelon',
    radius: 46,
    primaryColor: '#2e7d32',
    secondaryColor: '#ff1744',
    juiceColors: ['#ff1744', '#d50000', '#ff5252', '#2e7d32'],
    points: 10,
  },
  banana: {
    type: 'banana',
    name: 'Banana',
    radius: 38,
    primaryColor: '#ffd600',
    secondaryColor: '#fff59d',
    juiceColors: ['#ffd600', '#ffea00', '#fff176'],
    points: 15,
  },
  strawberry: {
    type: 'strawberry',
    name: 'Strawberry',
    radius: 34,
    primaryColor: '#d50000',
    secondaryColor: '#388e3c',
    juiceColors: ['#ff1744', '#d50000', '#ff5252'],
    points: 20,
  },
  pineapple: {
    type: 'pineapple',
    name: 'Pineapple',
    radius: 44,
    primaryColor: '#ff9100',
    secondaryColor: '#2e7d32',
    juiceColors: ['#ff9100', '#ffab40', '#ffd54f'],
    points: 25,
  },
  orange: {
    type: 'orange',
    name: 'Orange',
    radius: 40,
    primaryColor: '#ff6d00',
    secondaryColor: '#ffe0b2',
    juiceColors: ['#ff6d00', '#ff9100', '#ffab40'],
    points: 15,
  },
  apple: {
    type: 'apple',
    name: 'Red Apple',
    radius: 40,
    primaryColor: '#c62828',
    secondaryColor: '#fff9c4',
    juiceColors: ['#d32f2f', '#ef5350', '#ff8a80'],
    points: 10,
  },
  dragonfruit: {
    type: 'dragonfruit',
    name: 'Dragonfruit',
    radius: 42,
    primaryColor: '#c2185b',
    secondaryColor: '#f5f5f5',
    juiceColors: ['#e91e63', '#f48fb1', '#ffffff'],
    points: 30,
  },
  kiwi: {
    type: 'kiwi',
    name: 'Kiwi',
    radius: 36,
    primaryColor: '#5d4037',
    secondaryColor: '#76ff03',
    juiceColors: ['#76ff03', '#64dd17', '#aeea00'],
    points: 20,
  },
  coconut: {
    type: 'coconut',
    name: 'Coconut',
    radius: 44,
    primaryColor: '#3e2723',
    secondaryColor: '#ffffff',
    juiceColors: ['#ffffff', '#e0e0e0', '#8d6e63'],
    points: 25,
  },
  bomb: {
    type: 'bomb',
    name: 'Explosive Bomb',
    radius: 38,
    primaryColor: '#212121',
    secondaryColor: '#ff3d00',
    juiceColors: ['#ff3d00', '#ff6d00', '#ffab00', '#424242'],
    points: -50,
  },
  junkfood: {
    type: 'junkfood',
    name: 'Unhealthy Junk',
    radius: 40,
    primaryColor: '#d84315',
    secondaryColor: '#ffab00',
    juiceColors: ['#dd2c00', '#ff6d00', '#795548'],
    points: -30,
  },
};

// Canvas 2D Vector Drawer for Fruit Items
export function drawFruit(
  ctx: CanvasRenderingContext2D,
  type: FruitType,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  label?: string | number,
  isHalf: boolean = false,
  halfSide: 'left' | 'right' = 'left',
  sliceAngle: number = 0
) {
  ctx.save();
  ctx.translate(x, y);

  if (isHalf) {
    // Rotate to slice angle first, then apply fruit rotation
    ctx.rotate(sliceAngle);
    // Clip half plane
    ctx.beginPath();
    if (halfSide === 'left') {
      ctx.rect(-radius * 2, -radius * 2, radius * 2, radius * 4);
    } else {
      ctx.rect(0, -radius * 2, radius * 2, radius * 4);
    }
    ctx.clip();
  }

  ctx.rotate(rotation);

  switch (type) {
    case 'watermelon': {
      // Outer Rind
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1b5e20';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#2e7d32';
      ctx.stroke();

      // Inner Red Pulp
      ctx.beginPath();
      ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1744';
      ctx.fill();

      // Seeds
      const seeds = [
        { x: -12, y: -10 },
        { x: 10, y: -14 },
        { x: -14, y: 12 },
        { x: 8, y: 10 },
        { x: 0, y: 0 },
      ];
      ctx.fillStyle = '#111';
      seeds.forEach((s) => {
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, 2.5, 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'orange': {
      // Rind
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#ff6d00';
      ctx.fill();

      // Pulp center
      ctx.beginPath();
      ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff9100';
      ctx.fill();

      // Segments
      ctx.strokeStyle = '#ffe0b2';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * (radius - 6), Math.sin(ang) * (radius - 6));
        ctx.stroke();
      }
      break;
    }

    case 'apple': {
      // Red Body
      ctx.beginPath();
      ctx.arc(-8, -4, radius * 0.7, 0, Math.PI * 2);
      ctx.arc(8, -4, radius * 0.7, 0, Math.PI * 2);
      ctx.arc(0, 8, radius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = '#d32f2f';
      ctx.fill();

      // Core glow
      ctx.beginPath();
      ctx.arc(0, 2, radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 249, 196, 0.4)';
      ctx.fill();

      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -radius * 0.7);
      ctx.quadraticCurveTo(4, -radius * 1.1, 8, -radius * 1.2);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#5d4037';
      ctx.stroke();

      // Leaf
      ctx.beginPath();
      ctx.ellipse(6, -radius * 0.9, 6, 3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4caf50';
      ctx.fill();
      break;
    }

    case 'banana': {
      // Yellow Arc
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, -Math.PI / 3, Math.PI * 0.8);
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#ffd600';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Tips
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, -Math.PI / 3 - 0.1, -Math.PI / 3);
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#4e342e';
      ctx.stroke();
      break;
    }

    case 'strawberry': {
      // Strawberry heart shape
      ctx.beginPath();
      ctx.moveTo(0, radius);
      ctx.bezierCurveTo(-radius * 1.2, radius * 0.2, -radius * 0.9, -radius * 0.8, 0, -radius * 0.5);
      ctx.bezierCurveTo(radius * 0.9, -radius * 0.8, radius * 1.2, radius * 0.2, 0, radius);
      ctx.fillStyle = '#e53935';
      ctx.fill();

      // Seeds dots
      ctx.fillStyle = '#ffeb3b';
      const dots = [
        { x: -8, y: -4 },
        { x: 8, y: -4 },
        { x: 0, y: 8 },
        { x: -10, y: 10 },
        { x: 10, y: 10 },
        { x: 0, y: 22 },
      ];
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Leaf cap
      ctx.fillStyle = '#388e3c';
      ctx.beginPath();
      ctx.ellipse(0, -radius * 0.5, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'pineapple': {
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 4, radius * 0.75, radius * 0.95, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ff8f00';
      ctx.fill();

      // Grid lines
      ctx.strokeStyle = '#ffc107';
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(-radius * 0.6, i * 12);
        ctx.lineTo(radius * 0.6, i * 12 + 10);
        ctx.stroke();
      }

      // Green Leaves
      ctx.fillStyle = '#2e7d32';
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.ellipse(i * 6, -radius * 0.9, 5, 16, (i * Math.PI) / 12, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'kiwi': {
      // Brown skin
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#6d4c41';
      ctx.fill();

      // Green interior
      ctx.beginPath();
      ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
      ctx.fillStyle = '#76ff03';
      ctx.fill();

      // Pale center
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#f0f4c3';
      ctx.fill();

      // Seed ring
      ctx.fillStyle = '#212121';
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * (radius * 0.55), Math.sin(a) * (radius * 0.55), 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'dragonfruit': {
      // Pink skin with green tips
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#e91e63';
      ctx.fill();

      // White pulp
      ctx.beginPath();
      ctx.arc(0, 0, radius - 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fafafa';
      ctx.fill();

      // Black dots
      ctx.fillStyle = '#111';
      for (let i = 0; i < 16; i++) {
        const rx = (Math.random() - 0.5) * (radius * 1.3);
        const ry = (Math.random() - 0.5) * (radius * 1.3);
        if (rx * rx + ry * ry < (radius - 8) * (radius - 8)) {
          ctx.beginPath();
          ctx.arc(rx, ry, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }

    case 'coconut': {
      // Brown Shell
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#4e342e';
      ctx.fill();

      // White pulp
      ctx.beginPath();
      ctx.arc(0, 0, radius - 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Hollow center
      ctx.beginPath();
      ctx.arc(0, 0, radius - 15, 0, Math.PI * 2);
      ctx.fillStyle = '#efebe9';
      ctx.fill();
      break;
    }

    case 'bomb': {
      // Black metallic bomb
      const grad = ctx.createRadialGradient(-8, -8, 2, 0, 0, radius);
      grad.addColorStop(0, '#616161');
      grad.addColorStop(0.5, '#212121');
      grad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Fuse cap
      ctx.fillStyle = '#757575';
      ctx.fillRect(-5, -radius - 4, 10, 6);

      // Curved Fuse
      ctx.beginPath();
      ctx.moveTo(0, -radius - 4);
      ctx.quadraticCurveTo(12, -radius - 16, 18, -radius - 10);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#d7ccc8';
      ctx.stroke();

      // Animated Spark on fuse tip
      const sparkTime = Date.now() * 0.01;
      ctx.fillStyle = '#ff3d00';
      ctx.beginPath();
      ctx.arc(18 + Math.cos(sparkTime) * 3, -radius - 10 + Math.sin(sparkTime) * 3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(18, -radius - 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Skull or Warning Icon
      ctx.fillStyle = '#ff3d00';
      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💣', 0, 2);
      break;
    }

    case 'junkfood': {
      // Unhealthy Soda/Burger Bomb
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#bf360c';
      ctx.fill();

      ctx.font = 'bold 24px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🍔', 0, -2);
      break;
    }
  }

  // Draw Label Badge if present (Math numbers or Nutrition Vitamin tags)
  if (label !== undefined && label !== null && !isHalf) {
    ctx.save();
    ctx.rotate(-rotation); // Keep text upright
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(label), 0, 1);
    ctx.restore();
  }

  ctx.restore();
}

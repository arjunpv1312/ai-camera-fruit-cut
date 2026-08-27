import type { MathDifficulty, MathQuestion } from '../types/game';

export function generateMathQuestion(difficulty: MathDifficulty = 'easy'): MathQuestion {
  let equation = '';
  let answer = 0;

  if (difficulty === 'easy') {
    const isAddition = Math.random() > 0.3;
    if (isAddition) {
      const a = Math.floor(Math.random() * 12) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      equation = `${a} + ${b}`;
      answer = a + b;
    } else {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * a) + 1;
      equation = `${a} - ${b}`;
      answer = a - b;
    }
  } else if (difficulty === 'medium') {
    const op = Math.floor(Math.random() * 3);
    if (op === 0) {
      // Multiplication
      const a = Math.floor(Math.random() * 10) + 2;
      const b = Math.floor(Math.random() * 9) + 2;
      equation = `${a} × ${b}`;
      answer = a * b;
    } else if (op === 1) {
      // Division
      const b = Math.floor(Math.random() * 8) + 2;
      const ans = Math.floor(Math.random() * 9) + 2;
      const a = b * ans;
      equation = `${a} ÷ ${b}`;
      answer = ans;
    } else {
      // Mixed Addition/Subtraction
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 25) + 5;
      equation = `${a} + ${b}`;
      answer = a + b;
    }
  } else {
    // Hard
    const op = Math.floor(Math.random() * 3);
    if (op === 0) {
      const a = Math.floor(Math.random() * 12) + 3;
      const b = Math.floor(Math.random() * 12) + 3;
      equation = `${a} × ${b}`;
      answer = a * b;
    } else if (op === 1) {
      const b = Math.floor(Math.random() * 12) + 3;
      const ans = Math.floor(Math.random() * 12) + 2;
      const a = b * ans;
      equation = `${a} ÷ ${b}`;
      answer = ans;
    } else {
      const a = Math.floor(Math.random() * 60) + 20;
      const b = Math.floor(Math.random() * 40) + 10;
      equation = `${a} - ${b}`;
      answer = a - b;
    }
  }

  // Generate 3 unique distractor options
  const optionsSet = new Set<number>();
  optionsSet.add(answer);

  let attempts = 0;
  while (optionsSet.size < 4 && attempts < 15) {
    attempts++;
    const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const distractor = answer + offset;
    if (distractor > 0 && distractor !== answer) {
      optionsSet.add(distractor);
    }
  }

  let fallback = 1;
  while (optionsSet.size < 4) {
    if (answer + fallback > 0 && !optionsSet.has(answer + fallback)) {
      optionsSet.add(answer + fallback);
    } else if (answer - fallback > 0 && !optionsSet.has(answer - fallback)) {
      optionsSet.add(answer - fallback);
    }
    fallback++;
  }

  // Shuffle options
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return {
    equation,
    answer,
    options,
  };
}

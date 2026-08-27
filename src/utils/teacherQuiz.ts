import type { QuizPack } from '../types/game';

const QUIZ_STORAGE_KEY = 'fruit_ninja_teacher_quizzes_v3';

export const DEFAULT_QUIZ_PACKS: QuizPack[] = [
  {
    id: 'science_basics',
    title: 'Science & Solar System 🪐',
    subject: 'Science',
    questions: [
      {
        id: 'q1',
        question: 'Which planet is known as the Red Planet?',
        correctAnswer: 'Mars',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      },
      {
        id: 'q2',
        question: 'What gas do humans breathe to survive?',
        correctAnswer: 'Oxygen',
        options: ['Oxygen', 'Carbon', 'Nitrogen', 'Helium'],
      },
      {
        id: 'q3',
        question: 'What is the largest organ in the human body?',
        correctAnswer: 'Skin',
        options: ['Skin', 'Heart', 'Liver', 'Brain'],
      },
    ],
  },
  {
    id: 'geography_capitals',
    title: 'World Geography Capitals 🌍',
    subject: 'Geography',
    questions: [
      {
        id: 'q1',
        question: 'What is the capital city of France?',
        correctAnswer: 'Paris',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
      },
      {
        id: 'q2',
        question: 'What is the capital city of Japan?',
        correctAnswer: 'Tokyo',
        options: ['Tokyo', 'Kyoto', 'Seoul', 'Beijing'],
      },
    ],
  },
];

export function loadQuizPacks(): QuizPack[] {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load quiz packs', e);
  }
  return DEFAULT_QUIZ_PACKS;
}

export function saveQuizPacks(packs: QuizPack[]) {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(packs));
  } catch (e) {
    console.error('Failed to save quiz packs', e);
  }
}

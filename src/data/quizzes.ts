export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-based)
  explanation?: string;
}

export interface MonthlyQuiz {
  month: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage needed to pass
}

import { loadQuizzesFromExcel } from '../utils/quizExcelReader';

// Excel-based quiz data loading with fallback
export let monthlyQuizzes: MonthlyQuiz[] = [];

// Load quizzes from Excel file
const loadQuizzes = async () => {
  try {
    monthlyQuizzes = await loadQuizzesFromExcel();
    console.log(`Loaded ${monthlyQuizzes.length} quizzes from Excel file`);
  } catch (error) {
    console.error('Failed to load quizzes from Excel, using fallback data:', error);
    // Fallback to minimal data if Excel file fails
    monthlyQuizzes = [
      {
        month: 1,
        title: "Children's Rights Foundation",
        description: "Test your knowledge about basic children's rights and protection",
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: "What does Article 6 of the UN Convention on the Rights of the Child guarantee?",
            options: [
              "Right to education",
              "Right to life and survival",
              "Right to play",
              "Right to privacy"
            ],
            correctAnswer: 1,
            explanation: "Article 6 guarantees every child's fundamental right to life, survival and development."
          }
        ]
      }
    ];
  }
};

// Initialize quiz data loading
loadQuizzes();

// Export function to reload quizzes (useful for development)
export const reloadQuizzes = () => loadQuizzes();

// Helper function to get quiz for a specific month
export const getQuizForMonth = (month: number): MonthlyQuiz | undefined => {
  return monthlyQuizzes.find(quiz => quiz.month === month);
};

// Helper function to check if a month has a quiz available
export const hasQuizForMonth = (month: number): boolean => {
  return monthlyQuizzes.some(quiz => quiz.month === month);
};

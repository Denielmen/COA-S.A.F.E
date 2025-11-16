import * as XLSX from 'xlsx';
import { MonthlyQuiz, QuizQuestion } from '../data/quizzes';

interface QuizExcelRow {
  Month: number;
  QuizTitle: string;
  QuizDescription: string;
  PassingScore: number;
  QuestionId: number;
  Question: string;
  Option1: string;
  Option2: string;
  Option3: string;
  Option4: string;
  CorrectAnswer: number;
  Explanation?: string;
}

// Cache for loaded quiz data
let cachedQuizzes: MonthlyQuiz[] | null = null;
let lastModified: number | null = null;

export const loadQuizzesFromExcel = async (filePath: string = '/quizzes.xlsx'): Promise<MonthlyQuiz[]> => {
  try {
    // Return cached data if available
    if (cachedQuizzes) {
      return cachedQuizzes;
    }

    // Try to fetch the Excel file from public directory
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Quiz Excel file not found: ${filePath}. Make sure the file is in the public directory.`);
    }

    const fileBuffer = await response.arrayBuffer();

    // Read Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData: QuizExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    // Group data by month and transform to MonthlyQuiz format
    const quizMap = new Map<number, MonthlyQuiz>();

    rawData.forEach(row => {
      const month = row.Month;
      
      // Get or create quiz for this month
      if (!quizMap.has(month)) {
        quizMap.set(month, {
          month: month,
          title: row.QuizTitle,
          description: row.QuizDescription,
          passingScore: row.PassingScore,
          questions: []
        });
      }

      const quiz = quizMap.get(month)!;
      
      // Create question object
      const question: QuizQuestion = {
        id: row.QuestionId,
        question: row.Question,
        options: [row.Option1, row.Option2, row.Option3, row.Option4],
        correctAnswer: row.CorrectAnswer,
        explanation: row.Explanation
      };

      quiz.questions.push(question);
    });

    // Convert map to array and sort by month
    const quizzes = Array.from(quizMap.values()).sort((a, b) => a.month - b.month);

    // Sort questions within each quiz by id
    quizzes.forEach(quiz => {
      quiz.questions.sort((a, b) => a.id - b.id);
    });

    // Cache the results
    cachedQuizzes = quizzes;
    lastModified = Date.now();

    return quizzes;
  } catch (error) {
    console.error('Error loading quizzes from Excel:', error);
    throw error;
  }
};

// Clear cache (useful for development or when you know the file has changed)
export const clearQuizzesCache = () => {
  cachedQuizzes = null;
  lastModified = null;
};

// Helper function to get quiz for a specific month (Excel version)
export const getQuizForMonthFromExcel = async (month: number, filePath?: string): Promise<MonthlyQuiz | undefined> => {
  const quizzes = await loadQuizzesFromExcel(filePath);
  return quizzes.find(quiz => quiz.month === month);
};

// Helper function to check if a month has a quiz available (Excel version)
export const hasQuizForMonthFromExcel = async (month: number, filePath?: string): Promise<boolean> => {
  const quizzes = await loadQuizzesFromExcel(filePath);
  return quizzes.some(quiz => quiz.month === month);
};

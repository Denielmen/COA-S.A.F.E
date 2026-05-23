export type ChallengeType = 'individual' | 'family' | 'social-media';

export interface DailyArticle {
  day: number;
  month: number;
  title: string;
  title_tl?: string;
  title_bis?: string;
  description: string;
  description_tl?: string;
  description_bis?: string;
  fullContent?: string;
  fullContent_tl?: string;
  fullContent_bis?: string;
  additionalContent?: string;
  additionalContent_tl?: string;
  additionalContent_bis?: string;
  externalLink?: string;
  imagePath?: string;
  challengeType: ChallengeType;
  isRewardDay?: boolean;
  reward?: {
    title: string;
    title_tl?: string;
    title_bis?: string;
    message: string;
    message_tl?: string;
    message_bis?: string;
  };
}

import { loadArticlesFromExcel } from '../utils/excelReader';

// Excel-based data loading with fallback
export let dailyArticles: DailyArticle[] = [];

// Load articles from Excel file
const loadArticles = async () => {
  try {
    dailyArticles = await loadArticlesFromExcel();
  } catch (error) {
    console.error('Failed to load articles from Excel, using fallback data:', error);
    dailyArticles = [];
  }
};

// Initialize data loading
loadArticles();

// Export function to reload articles (useful for development)
export const reloadArticles = () => loadArticles();

// Helper function to get article for a specific date
export const getArticleForDate = (date: Date): DailyArticle | undefined => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  return dailyArticles.find(article => article.day === day && article.month === month);
};

// Helper to check if a date is a reward day (30th of any month)
export const isRewardDay = (date: Date): boolean => {
  return date.getDate() === 30;
};

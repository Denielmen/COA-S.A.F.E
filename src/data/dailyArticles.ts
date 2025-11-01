export type ChallengeType = 'individual' | 'family' | 'social-media';

export interface DailyArticle {
  day: number;
  month: number;
  title: string;
  description: string;
  fullContent?: string;
  externalLink?: string;
  challengeType: ChallengeType;
  isRewardDay?: boolean;
  reward?: {
    title: string;
    message: string;
  };
}

import { loadArticlesFromExcel } from '../utils/excelReader';

// Excel-based data loading with fallback
export let dailyArticles: DailyArticle[] = [];

// Load articles from Excel file
const loadArticles = async () => {
  try {
    dailyArticles = await loadArticlesFromExcel();
    console.log(`Loaded ${dailyArticles.length} articles from Excel file`);
  } catch (error) {
    console.error('Failed to load articles from Excel, using fallback data:', error);
    // Fallback to minimal data if Excel file fails
    dailyArticles = [
      {
        day: 1,
        month: 1,
        title: "Our Right to Survival",
        description: "Learn about Article 6 (Right to life) - every child's fundamental right to survive and develop.",
        externalLink: "https://www.unicef.org/child-rights-convention/convention-text-childrens-version",
        challengeType: 'individual'
      },
      {
        day: 30,
        month: 1,
        title: "REWARD DAY - Gauntlets of Safety",
        description: "Congratulations! You learned your rights for 30 days!",
        fullContent: "🎉 Amazing achievement! You've completed 30 days of learning about your rights!",
        challengeType: 'individual',
        isRewardDay: true,
        reward: {
          title: "Armor part earned: Gauntlets of Safety",
          message: "These gloves give you the power to protect yourself, because you know what is right and fair for you."
        }
      }
    ];
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

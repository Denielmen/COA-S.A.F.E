import * as XLSX from 'xlsx';
import { DailyArticle, ChallengeType } from '../data/dailyArticles';

interface ExcelRow {
  Day: number;
  Month: number;
  Title: string;
  Description: string;
  FullContent?: string;
  ExternalLink?: string;
  ChallengeType: string;
  IsRewardDay: string;
  RewardTitle?: string;
  RewardMessage?: string;
}

// Cache for loaded data to avoid repeated file reads
let cachedArticles: DailyArticle[] | null = null;
let lastModified: number | null = null;

export const loadArticlesFromExcel = async (filePath: string = '/dailyArticles.xlsx'): Promise<DailyArticle[]> => {
  try {
    // Return cached data if available
    if (cachedArticles) {
      return cachedArticles;
    }

    // Try to fetch the Excel file from public directory
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Excel file not found: ${filePath}. Make sure the file is in the public directory.`);
    }

    const fileBuffer = await response.arrayBuffer();

    // Read Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    // Transform to DailyArticle format
    const articles: DailyArticle[] = rawData.map(row => {
      const article: DailyArticle = {
        day: row.Day,
        month: row.Month,
        title: row.Title,
        description: row.Description,
        challengeType: row.ChallengeType as ChallengeType
      };

      // Add optional fields if they exist
      if (row.FullContent && row.FullContent.trim()) {
        article.fullContent = row.FullContent;
      }

      if (row.ExternalLink && row.ExternalLink.trim()) {
        article.externalLink = row.ExternalLink;
      }

      if (row.IsRewardDay === 'TRUE') {
        article.isRewardDay = true;
        
        if (row.RewardTitle || row.RewardMessage) {
          article.reward = {
            title: row.RewardTitle || '',
            message: row.RewardMessage || ''
          };
        }
      }

      return article;
    });

    // Cache the results
    cachedArticles = articles;
    lastModified = Date.now();

    return articles;
  } catch (error) {
    console.error('Error loading articles from Excel:', error);
    // Fallback to empty array or throw error based on your needs
    throw error;
  }
};

// Clear cache (useful for development or when you know the file has changed)
export const clearArticlesCache = () => {
  cachedArticles = null;
  lastModified = null;
};

// Helper function to get article for a specific date (Excel version)
export const getArticleForDateFromExcel = async (date: Date, filePath?: string): Promise<DailyArticle | undefined> => {
  const articles = await loadArticlesFromExcel(filePath);
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  return articles.find(article => article.day === day && article.month === month);
};

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getArticleForDate } from '@/data/dailyArticles';

interface UserProgress {
  completedLessons: string[]; // Array of completed lesson dates (YYYY-MM-DD format)
  lastActiveDate: string | null; // Last date user was active
  currentStreak: number;
  currentLevel: number;
  earnedRewards: string[]; // Array of earned reward dates
}

interface UserStats {
  completed: number;
  streak: number;
  level: number;
}

const STORAGE_KEY = 'userProgress';

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: [],
    lastActiveDate: null,
    currentStreak: 0,
    currentLevel: 1,
    earnedRewards: []
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed);
    }
    
    // Update streak based on current date
    updateStreakOnAppOpen();
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateStreakOnAppOpen = () => {
    const today = dayjs().format('YYYY-MM-DD');
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      const lastActive = parsed.lastActiveDate;
      
      if (lastActive) {
        const daysDiff = dayjs(today).diff(dayjs(lastActive), 'day');
        
        if (daysDiff === 1) {
          // Consecutive day - increment streak
          setProgress(prev => ({
            ...prev,
            currentStreak: prev.currentStreak + 1,
            lastActiveDate: today
          }));
        } else if (daysDiff > 1) {
          // Streak broken - reset to 1
          setProgress(prev => ({
            ...prev,
            currentStreak: 1,
            lastActiveDate: today
          }));
        }
        // If daysDiff === 0, same day - no change needed
      } else {
        // First time opening app
        setProgress(prev => ({
          ...prev,
          currentStreak: 1,
          lastActiveDate: today
        }));
      }
    } else {
      // No saved progress - first time
      setProgress(prev => ({
        ...prev,
        currentStreak: 1,
        lastActiveDate: today
      }));
    }
  };

  const markLessonCompleted = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const article = getArticleForDate(date);
    
    setProgress(prev => {
      const newCompletedLessons = [...prev.completedLessons];
      if (!newCompletedLessons.includes(dateStr)) {
        newCompletedLessons.push(dateStr);
      }

      const newEarnedRewards = [...prev.earnedRewards];
      let newLevel = prev.currentLevel;

      // Check if this is a reward day and add to earned rewards
      if (article?.isRewardDay && !newEarnedRewards.includes(dateStr)) {
        newEarnedRewards.push(dateStr);
      }

      // Calculate level based on completed months with rewards
      const completedMonths = getCompletedMonths(newCompletedLessons, newEarnedRewards);
      newLevel = Math.max(1, completedMonths + 1);

      return {
        ...prev,
        completedLessons: newCompletedLessons,
        earnedRewards: newEarnedRewards,
        currentLevel: newLevel
      };
    });
  };

  const getCompletedMonths = (completedLessons: string[], earnedRewards: string[]): number => {
    // Group completed lessons by month
    const monthsWithLessons = new Set<string>();
    const monthsWithRewards = new Set<string>();

    completedLessons.forEach(dateStr => {
      const monthKey = dayjs(dateStr).format('YYYY-MM');
      monthsWithLessons.add(monthKey);
    });

    earnedRewards.forEach(dateStr => {
      const monthKey = dayjs(dateStr).format('YYYY-MM');
      monthsWithRewards.add(monthKey);
    });

    // Count months that have both lessons completed and at least one reward earned
    let completedMonths = 0;
    monthsWithLessons.forEach(month => {
      if (monthsWithRewards.has(month)) {
        completedMonths++;
      }
    });

    return completedMonths;
  };

  const isLessonCompleted = (date: Date): boolean => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    return progress.completedLessons.includes(dateStr);
  };

  const getStats = (): UserStats => {
    return {
      completed: progress.completedLessons.length,
      streak: progress.currentStreak,
      level: progress.currentLevel
    };
  };

  const resetProgress = () => {
    setProgress({
      completedLessons: [],
      lastActiveDate: null,
      currentStreak: 0,
      currentLevel: 1,
      earnedRewards: []
    });
  };

  const isMonthCompleted = (month: number, year?: number): boolean => {
    const currentYear = year || new Date().getFullYear();
    const daysInMonth = new Date(currentYear, month, 0).getDate();
    
    let completedDaysInMonth = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month - 1, day);
      if (isLessonCompleted(date)) {
        completedDaysInMonth++;
      }
    }
    
    // Consider month completed if at least 80% of days are completed
    return (completedDaysInMonth / daysInMonth) >= 0.8;
  };

  return {
    progress,
    markLessonCompleted,
    isLessonCompleted,
    isMonthCompleted,
    getStats,
    resetProgress,
    updateStreakOnAppOpen
  };
};

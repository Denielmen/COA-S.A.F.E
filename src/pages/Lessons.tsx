import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Book, Users, Share2 } from "lucide-react";
import { Button, Badge, Spin } from "antd";
import { dailyArticles, type DailyArticle, type ChallengeType } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import BottomNavigation from "@/components/BottomNavigation";

const Lessons = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const { isLessonCompleted, getStats } = useUserProgress();
  const stats = getStats();

  // Wait for articles to load
  useEffect(() => {
    // Check if articles are loaded
    if (dailyArticles.length > 0) {
      setIsLoading(false);
    } else {
      // Poll for articles to load (they load asynchronously)
      const checkInterval = setInterval(() => {
        if (dailyArticles.length > 0) {
          setIsLoading(false);
          clearInterval(checkInterval);
        }
      }, 100);
      
      // Timeout after 5 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        setIsLoading(false);
      }, 5000);
      
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, []);

  // Group articles by month
  const articlesByMonth = dailyArticles.reduce((acc, article) => {
    if (!acc[article.month]) {
      acc[article.month] = [];
    }
    acc[article.month].push(article);
    return acc;
  }, {} as Record<number, DailyArticle[]>);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getChallengeIcon = (type: ChallengeType) => {
    switch (type) {
      case 'individual':
        return <Book className="w-4 h-4" />;
      case 'family':
        return <Users className="w-4 h-4" />;
      case 'social-media':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const getChallengeColor = (type: ChallengeType) => {
    switch (type) {
      case 'individual':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'family':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'social-media':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleLessonClick = (article: DailyArticle) => {
    const currentYear = new Date().getFullYear();
    // Create date string manually to avoid timezone issues
    const month = article.month.toString().padStart(2, '0');
    const day = article.day.toString().padStart(2, '0');
    const dateString = `${currentYear}-${month}-${day}`;
    navigate(`/lesson/${dateString}`);
  };

  const currentMonthArticles = articlesByMonth[selectedMonth] || [];
  const completedInMonth = currentMonthArticles.filter(article => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, article.month - 1, article.day);
    return isLessonCompleted(date);
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-20 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">All Lessons</h1>
          </div>
          <div className="text-sm text-gray-600">
            {stats.completed} / {dailyArticles.length} completed
          </div>
        </div>
      </div>

      {/* Month Selector */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {months.map((month, index) => {
            const monthNumber = index + 1;
            const hasArticles = articlesByMonth[monthNumber]?.length > 0;
            
            if (!hasArticles) return null;
            
            return (
              <button
                key={monthNumber}
                onClick={() => setSelectedMonth(monthNumber)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedMonth === monthNumber
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Stats */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {months[selectedMonth - 1]}
            </h2>
            <p className="text-sm text-gray-600">
              {currentMonthArticles.length} lessons available
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {completedInMonth}/{currentMonthArticles.length}
            </div>
            <p className="text-xs text-gray-600">completed</p>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          {currentMonthArticles.map((article) => {
            const currentYear = new Date().getFullYear();
            const date = new Date(currentYear, article.month - 1, article.day);
            const isCompleted = isLessonCompleted(date);
            
            return (
              <div
                key={`${article.month}-${article.day}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Day Number */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isCompleted 
                      ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                      : article.isRewardDay
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200'
                  }`}>
                    {article.isRewardDay ? '🏆' : article.day}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight">
                        {article.title}
                      </h3>
                      {isCompleted && (
                        <Badge 
                          count="✓" 
                          style={{ backgroundColor: '#00A99D', color: 'white' }}
                        />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Challenge Type Badge */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChallengeColor(article.challengeType)}`}>
                        {getChallengeIcon(article.challengeType)}
                        {article.challengeType === 'social-media' ? 'Social Media' : 
                         article.challengeType ? article.challengeType.charAt(0).toUpperCase() + article.challengeType.slice(1) : 'Challenge'}
                      </div>

                      {/* Action Button */}
                      <Button
                        type={isCompleted ? "default" : "primary"}
                        size="small"
                        onClick={() => handleLessonClick(article)}
                        className="rounded-lg"
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Button>
                    </div>

                    {/* Reward Info */}
                    {article.isRewardDay && article.reward && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-800">
                          {article.reward.title}
                        </div>
                        <div className="text-xs text-yellow-700 mt-1">
                          {article.reward.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {currentMonthArticles.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No lessons available
            </h3>
            <p className="text-gray-600">
              Lessons for {months[selectedMonth - 1]} are coming soon!
            </p>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="lessons" />
    </div>
  );
};

export default Lessons;

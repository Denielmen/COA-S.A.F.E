import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Share2, HelpCircle } from "lucide-react";
import { Button, Progress } from "antd";
import { getArticleForDate, type DailyArticle } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const Lesson = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<DailyArticle | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const { markLessonCompleted, isLessonCompleted, getStats } = useUserProgress();
  const stats = getStats();

  useEffect(() => {
    // Read selected character from localStorage
    const savedCharacter = localStorage.getItem("selectedCharacter") as "boy" | "girl" | null;
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }

    // Get article for the selected date
    if (date) {
      // Parse date string manually to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const articleData = getArticleForDate(selectedDate);
      setArticle(articleData);
    }
  }, [date]);

  const handleMarkComplete = () => {
    if (date) {
      // Parse date string manually to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      markLessonCompleted(selectedDate);
    }
  };

  const handleShareWithFamily = () => {
    // Implement share functionality
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    }
  };

  const handleQuiz = () => {
    // Navigate to quiz page (to be implemented)
    console.log("Navigate to quiz");
  };

  if (!article || !date) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">Lesson not found</h2>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="mt-4"
            type="primary"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = date ? (() => {
    const [year, month, day] = date.split('-').map(Number);
    return isLessonCompleted(new Date(year, month - 1, day));
  })() : false;
  const progressPercentage = Math.round((stats.completed / 31) * 100);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">Daily Lesson</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
              alt={`${selectedCharacter} character`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Day and Title */}
        <div className="mb-6">
          <div className="text-sm text-primary font-medium mb-2">
            Day {new Date(date).getDate()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h2>
        </div>

        {/* Reading Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Reading Progress:</span>
            <span className="text-sm font-medium text-primary">{progressPercentage}%</span>
          </div>
          <Progress 
            percent={progressPercentage} 
            strokeColor="#00A99D"
            trailColor="#f0f0f0"
            strokeWidth={8}
            showInfo={false}
          />
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          {/* Show full content if available, otherwise show description */}
          {article.fullContent && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">Content:</h4>
              <p className="text-gray-800 leading-relaxed">
                {article.fullContent}
              </p>
            </div>
          )}
          
          {!article.fullContent && (
            <p className="text-gray-800 leading-relaxed mb-4">
              {article.description}
            </p>
          )}

          {/* Show external link if available */}
          {article.externalLink && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Learn More:</h4>
                  <a 
                    href={article.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-800 underline break-all"
                  >
                    {article.externalLink}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image placeholder - you can add actual images here */}
        <div className="bg-gray-50 rounded-2xl h-48 mb-6 flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
            <p className="text-sm">Lesson illustration</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Mark as Complete Button */}
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-primary/10 rounded-xl border border-primary/20">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Lesson Completed!</span>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              onClick={handleMarkComplete}
              className="h-12 rounded-xl font-medium shadow-sm"
              icon={<CheckCircle className="w-5 h-5" />}
            >
              Mark as Complete
            </Button>
          )}

          {/* Quiz Button */}
          <Button
            size="large"
            block
            onClick={handleQuiz}
            className="h-12 rounded-xl font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white"
            icon={<HelpCircle className="w-5 h-5" />}
          >
            Quiz
          </Button>

          {/* Share Button */}
          <Button
            size="large"
            block
            onClick={handleShareWithFamily}
            className="h-12 rounded-xl font-medium bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            icon={<Share2 className="w-5 h-5" />}
          >
            Share with Family
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lesson;

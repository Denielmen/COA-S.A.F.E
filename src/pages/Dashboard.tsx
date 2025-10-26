import { Card, Badge, Calendar, Modal } from "antd";
import { CheckCircle, Flame, Star, Award, Book } from "lucide-react";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState, useEffect } from "react";
import { getArticleForDate, type DailyArticle } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import boyCharacterImg from "/images/boy-character.svg";
import girlCharacterImg from "/images/girl-character.svg";
import BottomNavigation from "@/components/BottomNavigation";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<DailyArticle | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().month(0)); // Start from January
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const { markLessonCompleted, isLessonCompleted, getStats } = useUserProgress();
  const stats = getStats();

  useEffect(() => {
    // Read selected character from localStorage
    const savedCharacter = localStorage.getItem("selectedCharacter") as "boy" | "girl" | null;
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }
  }, []);

  const onPanelChange = (value: Dayjs, mode: any) => {
    setCurrentMonth(value);
  };

  const onDateSelect = (date: Dayjs) => {
    const article = getArticleForDate(date.toDate());
    if (article) {
      setSelectedDate(date);
      setSelectedArticle(article);
      setIsModalOpen(true);
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'individual': return '#FFD700'; // Yellow
      case 'family': return '#00BCD4'; // Blue/Cyan
      case 'social-media': return '#FF9800'; // Orange
      default: return '#E0E0E0';
    }
  };

  const dateCellRender = (date: Dayjs) => {
    const article = getArticleForDate(date.toDate());
    if (!article) return null;

    const bgColor = getChallengeColor(article.challengeType);
    const isCompleted = isLessonCompleted(date.toDate());
    
    return (
      <div 
        className={`h-full p-1 cursor-pointer hover:opacity-80 transition-opacity relative ${
          isCompleted ? 'ring-2 ring-primary ring-offset-1' : ''
        }`}
        style={{ backgroundColor: bgColor, borderRadius: '8px' }}
        onClick={() => onDateSelect(date)}
      >
        <div className="text-[10px] font-semibold text-foreground line-clamp-2">
          {article.title}
        </div>
        <div className="text-[8px] text-foreground/70 line-clamp-2 mt-1">
          {article.description}
        </div>
        {isCompleted && (
          <CheckCircle className="w-3 h-3 text-primary bg-white rounded-full absolute top-1 right-1" />
        )}
        {article.isRewardDay && !isCompleted && (
          <Award className="w-4 h-4 text-accent absolute bottom-1 right-1" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome to</h1>
            <h1 className="text-2xl font-bold">SAFE !</h1>
            <p className="text-sm text-primary-foreground/90">Learn Philippine Children's Law</p>
          </div>
          <Card className="rounded-2xl shadow-[var(--shadow-card)] border-2 border-accent/20 p-3">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center">
                <img 
                  src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
                  alt={`${selectedCharacter} character`}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="text-xs font-semibold text-foreground">Level {stats.level}</div>
              <div className="text-[10px] text-muted-foreground">{stats.completed}/31 Lessons</div>
            </div>
          </Card>
        </div>
      </div>

      <div className="px-4 mt-6">
        {/* Calendar Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-secondary">{currentMonth.format('MMMM YYYY')}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentMonth(dayjs())}
                className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium"
              >
                Today
              </button>
            </div>
          </div>
          
          {/* Challenge Type Legend */}
          <Card className="rounded-2xl shadow-[var(--shadow-card)] mb-3 p-3">
            <div className="text-xs font-semibold mb-2">Type of Challenge</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FFD700' }}></div>
                <span className="text-xs">Individual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#00BCD4' }}></div>
                <span className="text-xs">Family</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#FF9800' }}></div>
                <span className="text-xs">Social Media</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-[var(--shadow-card)]">
            <Calendar 
              fullscreen={false}
              value={currentMonth}
              onPanelChange={onPanelChange}
              cellRender={dateCellRender}
              className="custom-calendar"
            />
          </Card>
        </div>

        {/* Article Modal */}
        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          title={selectedArticle?.title}
          centered
        >
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  color={getChallengeColor(selectedArticle.challengeType)} 
                  text={selectedArticle.challengeType.replace('-', ' ').toUpperCase()} 
                />
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {selectedArticle.description}
              </p>
              
              {selectedArticle.externalLink ? (
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm mb-3">Click the link below to read the full article:</p>
                  <a 
                    href={selectedArticle.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Book className="w-4 h-4" />
                    Read Full Article
                  </a>
                </div>
              ) : selectedArticle.fullContent ? (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{selectedArticle.fullContent}</p>
                </div>
              ) : null}

              {selectedArticle.isRewardDay && selectedArticle.reward && (
                <div className="bg-gradient-to-r from-accent/20 to-secondary/20 p-4 rounded-lg border-2 border-accent">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6 text-accent" />
                    <h3 className="font-bold text-accent">{selectedArticle.reward.title}</h3>
                  </div>
                  <p className="text-sm">{selectedArticle.reward.message}</p>
                </div>
              )}

              {/* Mark as Complete Button */}
              <div className="flex justify-center mt-4">
                {selectedDate && isLessonCompleted(selectedDate.toDate()) ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Lesson Completed!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (selectedDate) {
                        markLessonCompleted(selectedDate.toDate());
                      }
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="rounded-2xl shadow-[var(--shadow-card)] border-2 border-primary/20">
            <div className="text-center space-y-2 p-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-[var(--shadow-card)] border-2 border-secondary/20">
            <div className="text-center space-y-2 p-2">
              <div className="w-10 h-10 rounded-full bg-secondary/10 mx-auto flex items-center justify-center">
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-[var(--shadow-card)] border-2 border-accent/20">
            <div className="text-center space-y-2 p-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 mx-auto flex items-center justify-center">
                <Star className="w-6 h-6 text-accent fill-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{stats.level}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendar" />
    </div>
  );
};

export default Dashboard;

import { Card, Calendar } from "antd";
import { CheckCircle, Flame, Star, Award } from "lucide-react";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getArticleForDate } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import boyCharacterImg from "/images/boy-character.svg";
import girlCharacterImg from "/images/girl-character.svg";
import BottomNavigation from "@/components/BottomNavigation";
import mainLoopSfx from "@/soundEffects/main.mp3";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().month(0)); // Start from January
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const { isLessonCompleted, getStats } = useUserProgress();
  const stats = getStats();
  const navigate = useNavigate();
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const resumeHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Read selected character from localStorage
    const savedCharacter = localStorage.getItem("selectedCharacter") as "boy" | "girl" | null;
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }
  }, []);

  // Background looped audio while user is idle on dashboard
  useEffect(() => {
    mainAudioRef.current = new Audio(mainLoopSfx);
    mainAudioRef.current.loop = true;
    mainAudioRef.current.volume = 0.25; // 25% volume
    mainAudioRef.current.preload = "auto";

    // Try autoplay; if blocked, wait for first user interaction
    const tryPlay = async () => {
      try {
        await mainAudioRef.current?.play();
      } catch {
        const resumeOnInteraction = () => {
          void mainAudioRef.current?.play();
          if (resumeHandlerRef.current) {
            document.removeEventListener("click", resumeHandlerRef.current);
            resumeHandlerRef.current = null;
          }
        };
        resumeHandlerRef.current = resumeOnInteraction;
        document.addEventListener("click", resumeOnInteraction, { once: true });
      }
    };
    void tryPlay();

    return () => {
      mainAudioRef.current?.pause();
      mainAudioRef.current = null;
      if (resumeHandlerRef.current) {
        document.removeEventListener("click", resumeHandlerRef.current);
        resumeHandlerRef.current = null;
      }
    };
  }, []);

  const onPanelChange = (value: Dayjs, mode: string) => {
    setCurrentMonth(value);
  };

  const onDateSelect = (date: Dayjs) => {
    const article = getArticleForDate(date.toDate());
    if (article) {
      // Stop idle loop when starting a lesson
      mainAudioRef.current?.pause();
      // Navigate to lesson page with the date as parameter
      navigate(`/lesson/${date.format('YYYY-MM-DD')}`);
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
        className={`h-full cursor-pointer hover:opacity-80 transition-opacity relative flex items-center justify-center ${
          isCompleted ? 'ring-2 ring-primary ring-offset-1' : ''
        }`}
        style={{ backgroundColor: bgColor, borderRadius: '8px' }}
        onClick={() => onDateSelect(date)}
      >
        {/* Date Number with Challenge Color */}
        <div className="text-lg font-bold text-white drop-shadow-md">
          {date.date()}
        </div>
        
        {isCompleted && (
          <CheckCircle className="w-4 h-4 text-primary bg-white rounded-full absolute top-1 right-1" />
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

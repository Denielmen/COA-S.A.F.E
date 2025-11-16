import { Card, Calendar } from "antd";
import { CheckCircle, Flame, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getArticleForDate } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import boyCharacterImg from "/images/boy.png";
import girlCharacterImg from "/images/girl.png";
import calendarBg1st from "/images/Project SAFE Calendar/Project SAFE Calendar Elements/1st Quarter Calendar Background.png";
import calendarBg2nd from "/images/Project SAFE Calendar/Project SAFE Calendar Elements/2nd Quarter Calendar Background.png";
import calendarBg3rd from "/images/Project SAFE Calendar/Project SAFE Calendar Elements/3rd Quarter Calendar Background.png";
import BottomNavigation from "@/components/BottomNavigation";
import mainLoopSfx from "@/soundEffects/main.mp3";

// const boyCharacterImg = "/images/boy.png";
// const girlCharacterImg = "/images/girl.png";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().month(0)); // Start from January
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const { isLessonCompleted, getStats, progress } = useUserProgress();
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

  const getCalendarBackground = (month: Dayjs) => {
    const monthNum = month.month(); // 0-11
    if (monthNum >= 0 && monthNum <= 2) {
      return calendarBg1st; // Jan, Feb, Mar (1st Quarter)
    } else if (monthNum >= 3 && monthNum <= 5) {
      return calendarBg2nd; // Apr, May, Jun (2nd Quarter)
    } else if (monthNum >= 6 && monthNum <= 8) {
      return calendarBg3rd; // Jul, Aug, Sep (3rd Quarter)
    } else {
      return calendarBg1st; // Oct, Nov, Dec (fallback to 1st for now)
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'individual': return '#FFD700'; // Yellow
      case 'family': return '#00A99D'; // Teal
      case 'social-media': return '#F7941D'; // Orange
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
        style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: bgColor,
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        {isCompleted && (
          <CheckCircle className="w-4 h-4 text-primary bg-white rounded-full absolute top-0 right-0" />
        )}
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Welcome to</h1>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-[hsl(175,100%,33%)]">S</span>
              <span className="text-[hsl(33,93%,54%)]">A</span>
              <span className="text-[hsl(175,100%,33%)]">F</span>
              <span className="text-[hsl(45,100%,51%)]">E</span>
              <span className="text-[hsl(175,100%,33%)]"> !</span>
            </h1>
            <p className="text-sm text-secondary mt-1">Learn Philippine Children's Law</p>
          </div>
          <Card 
            className="rounded-2xl shadow-md border border-gray-200 p-3 bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/profile")}
          >
            <div className="text-center space-y-1 relative">
              <div className="relative inline-block">
                <div className="w-12 h-12 rounded-full bg-white mx-auto flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  <img 
                    src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
                    alt={`${selectedCharacter} character`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded flex items-center justify-center border-2 border-white">
                  <span className="text-[10px] font-bold text-white">L{stats.level}</span>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600">{stats.completed}/31</div>
              <div className="text-[10px] text-secondary">Lessons</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Horizontal Teal Line Separator */}
      <div className="h-1 bg-primary mx-4"></div>

      <div className="px-4 mt-4">
        {/* Calendar Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-secondary">{currentMonth.format('MMMM YYYY')}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentMonth(dayjs())}
                className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors"
              >
                Today
              </button>
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Challenge Type Legend */}
          <Card className="rounded-2xl shadow-[var(--shadow-card)] mb-3 p-4 bg-white/95 backdrop-blur-sm border border-gray-200">
            <div className="text-sm font-bold mb-3 text-center text-gray-800">Type of Challenge</div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: '#FFD700' }}></div>
                <span className="text-sm font-medium text-gray-800">Individual</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: '#00BCD4' }}></div>
                <span className="text-sm font-medium text-gray-800">Family</span>
              </div>          
              <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: '#FF9800' }}></div>
                <span className="text-sm font-medium text-gray-800">Social Media</span>
              </div>
            </div>
          </Card>

          <div 
            className="rounded-2xl shadow-[var(--shadow-card)] relative overflow-hidden"
            style={{
              backgroundImage: `url(${getCalendarBackground(currentMonth)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right',
              backgroundRepeat: 'no-repeat',
              minHeight: '300px'
            }}
          >
          <Card className="rounded-2xl shadow-sm border border-gray-200 bg-transparent">
            <Calendar 
              key={progress.completedLessons.length}
              fullscreen={false}
              value={currentMonth}
              onPanelChange={onPanelChange}
              onSelect={onDateSelect}
              cellRender={dateCellRender}
              className="custom-calendar bg-transparent"
              headerRender={({ value, type, onChange, onTypeChange }) => null}
            />
          </Card>
          </div>
        


        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white p-0 overflow-hidden h-full">
            <div className="text-center py-4 px-1 sm:px-2 flex flex-col justify-between h-full min-h-[120px]">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xl sm:text-2xl font-bold text-primary leading-tight">{stats.completed}</p>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white p-0 overflow-hidden h-full">
            <div className="text-center py-4 px-1 sm:px-2 flex flex-col justify-between h-full min-h-[120px]">
              <div className="flex justify-center mb-2">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xl sm:text-2xl font-bold text-secondary leading-tight">
                  {stats.streak}
                </p>
                <p className="text-xs sm:text-sm font-bold text-secondary leading-tight">
                  {stats.streak === 1 ? 'day' : 'days'}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Streak</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white p-0 overflow-hidden h-full">
            <div className="text-center py-4 px-1 sm:px-2 flex flex-col justify-between h-full min-h-[120px]">
              <div className="flex justify-center mb-2">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xl sm:text-2xl font-bold text-yellow-500 leading-tight">{stats.level}</p>
                <p className="text-[10px] sm:text-xs text-gray-600 mt-1">Level</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendar" />
    </div>
  );
};

export default Dashboard;

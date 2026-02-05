import { Card, Calendar } from "antd";
import { CheckCircle, Flame, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getArticleForDate } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import boyCharacterImg from "/images/Icon2.png";
import girlCharacterImg from "/images/Icon.png";
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
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
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
    const savedName = localStorage.getItem('username');
    if (savedName) setUsername(savedName);
  }, []);

  useEffect(() => {
    const onProfileUpdated = (e: Event) => {
      const ev = e as CustomEvent;
      const name = ev?.detail?.name || localStorage.getItem('username') || '';
      setUsername(name);
    };
    window.addEventListener('profileUpdated', onProfileUpdated as EventListener);
    return () => window.removeEventListener('profileUpdated', onProfileUpdated as EventListener);
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
    <div className="min-h-screen bg-white pb-20 mt-4">
      {/* Header */}
      <div className="dashboard-header bg-white p-4 pb-2 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight logo-inline">
                <span className="text-[hsl(187,100%,42%)]">S</span>
                <span className="text-[hsl(33,93%,54%)]">A</span>
                <span className="text-[hsl(175,100%,33%)]">F</span>
                <span className="text-[hsl(45,100%,51%)]">E</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Learn Philippine Children's Law</p>
          </div>

          <div className="profile-rect cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95" onClick={() => navigate('/profile')} role="button" tabIndex={0}>
            <div className="flex items-center gap-3 rounded-3xl px-3 py-2 bg-transparent">
              <div className="relative">
                <div className="avatar-frame w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 p-2 overflow-hidden shadow-md border-2 border-white">
                  <img src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg} alt="avatar" className="w-full h-full object-cover rounded-full" />
                </div>

                <div className="notification-badge absolute -top-1 -right-1 bg-red-500 w-7 h-7 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">1</div>

                <div className="level-badge absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-md border-2 border-white">L{stats.level}</div>
              </div>

              <div className="flex flex-col items-end justify-center space-y-0 text-right leading-tight">
                <div className="text-gray-900 font-extrabold text-lg sm:text-xl truncate">{username || 'Guest'}</div>
                <div className="text-gray-700 text-[11px] font-medium">{stats.completed}/31</div>
                <div className="text-gray-500 text-[11px] font-medium">Lessons</div>
              </div>
            </div>
          </div>
        </div>

        {/* separator line */}
        <div className="mt-2 border-t border-teal-100"></div>
      </div>

      

      <div className="px-4 mt-2">
        {/* Calendar Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 calendar-controls">
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">{currentMonth.format('MMMM YYYY')}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentMonth(dayjs())}
                className="today-btn px-3 py-1 rounded-md text-sm font-medium shadow-sm focus:outline-none"
                aria-label="Today"
              >
                Today
              </button>

              <button 
                onClick={handlePrevMonth}
                className="nav-btn p-2 border rounded-md focus:outline-none"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-teal-700" />
              </button>
              <button onClick={handleNextMonth} className="nav-btn p-2 border rounded-md focus:outline-none" aria-label="Next month">
                <ChevronRight className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>

          <div 
            className="rounded-2xl shadow-lg relative overflow-hidden border border-gray-200 bg-white"
            style={{
              minHeight: '300px'
            }}
          >
          <Card className="mt-5 rounded-2xl shadow-sm border border-gray-200 bg-transparent">
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

          {/* Challenge Type Legend */}
          <Card className="rounded-2xl shadow-[var(--shadow-card)] mt-5 mb-3 p-4 bg-white/95 backdrop-blur-sm border border-gray-200">
            <div className="text-sm font-bold mb-3 text-center text-gray-800">Types of Challenges</div>
            {/* <div className="flex flex-wrap items-center justify-center gap-4"> */}
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
            {/* </div> */}
          </Card>
        


        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="stat-card bg-sky-500 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.completed}</p>
            <p className="text-sm opacity-90">Completed</p>
          </div>

          <div className="stat-card bg-orange-500 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.streak}</p>
            <p className="text-sm opacity-90">{stats.streak === 1 ? 'day' : 'days'} Streak</p>
          </div>

          <div className="stat-card bg-amber-400 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <Star className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.level}</p>
            <p className="text-sm opacity-90">Level</p>
          </div>
        </div>
      </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="calendar" />
    </div>
  );
};

export default Dashboard;

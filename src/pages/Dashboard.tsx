import { Card, Calendar } from "antd";
import { CheckCircle, Flame, Star, Award, ChevronLeft, ChevronRight } from "lucide-react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
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
import { App } from '@capacitor/app';
import { getCurrentLanguage, translate } from "@/lib/utils";

// const boyCharacterImg = "/images/boy.png";
// const girlCharacterImg = "/images/girl.png";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs().startOf('year'));
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');
  const { isLessonCompleted, getStats, progress } = useUserProgress();
  const stats = getStats();
  const navigate = useNavigate();
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const resumeHandlerRef = useRef<(() => void) | null>(null);
  const language = getCurrentLanguage();

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

  useEffect(() => {
    const dashboardMusicEnabled = false;
    if (!dashboardMusicEnabled) {
      return;
    }
    mainAudioRef.current = new Audio(mainLoopSfx);
    mainAudioRef.current.loop = true;
    // Read saved settings to set initial music volume
    try {
      const saved = localStorage.getItem("settings");
      let vol = 0.25; // default 25%
      let enabled = true;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.musicVolume === "number") {
          vol = Math.max(0, Math.min(1, parsed.musicVolume / 100));
        } else if (typeof parsed.soundVolume === "number") {
          vol = Math.max(0, Math.min(1, parsed.soundVolume / 100));
        }
        if (typeof parsed.soundEffects === "boolean") {
          enabled = parsed.soundEffects;
        } else if (typeof parsed.soundVolume === "number") {
          enabled = parsed.soundVolume > 0;
        }
      }
      mainAudioRef.current.volume = enabled ? vol : 0;
    } catch {
      mainAudioRef.current.volume = 0.25;
    }
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

    const onVisibility = () => {
      const a = mainAudioRef.current;
      if (!a) return;
      if (document.hidden) {
        a.pause();
      } else {
        a.volume = a.volume; // keep same
        void a.play();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let removeAppState: (() => void) | null = null;
    import("@capacitor/app")
    App.addListener('appStateChange', ({ isActive }) => {
      const a = mainAudioRef.current;
      if (!a) return;
      if (!isActive) {
        a.pause();
      } else {
        void a.play();
      }
    }).then(handle => {
      removeAppState = () => handle.remove();
    }).catch(console.error);

    return () => {
      mainAudioRef.current?.pause();
      mainAudioRef.current = null;
      if (resumeHandlerRef.current) {
        document.removeEventListener("click", resumeHandlerRef.current);
        resumeHandlerRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVisibility);
      if (removeAppState) removeAppState();
    };
  }, []);

  // React to settings being saved to adjust music volume live
  useEffect(() => {
    const onSettingsSaved = (e: Event) => {
      try {
        const detail = (e as CustomEvent<any>).detail;
        if (!mainAudioRef.current) return;
        let vol = 0.25;
        let enabled = true;
        if (detail && typeof detail === "object") {
          if (typeof detail.musicVolume === "number") {
            vol = Math.max(0, Math.min(1, detail.musicVolume / 100));
          } else if (typeof detail.soundVolume === "number") {
            vol = Math.max(0, Math.min(1, detail.soundVolume / 100));
          }
          if (typeof detail.soundEffects === "boolean") {
            enabled = detail.soundEffects;
          } else if (typeof detail.soundVolume === "number") {
            enabled = detail.soundVolume > 0;
          }
        }
        mainAudioRef.current.volume = enabled ? vol : 0;
      } catch { }
    };
    window.addEventListener("settings-saved", onSettingsSaved as EventListener);
    return () => {
      window.removeEventListener("settings-saved", onSettingsSaved as EventListener);
    };
  }, []);

  const onPanelChange = (value: Dayjs, mode: string) => {
    setCurrentMonth(value);
  };

  const onDateSelect = (date: Dayjs) => {
    const article = getArticleForDate(date.toDate());
    if (article) {
      mainAudioRef.current?.pause();
      navigate(`/lesson/${date.format("YYYY-MM-DD")}`);
    }
  };

  const getCalendarBackground = (month: Dayjs) => {
    const monthNum = month.month();
    if (monthNum >= 0 && monthNum <= 2) {
      return calendarBg1st;
    } else if (monthNum >= 3 && monthNum <= 5) {
      return calendarBg2nd;
    } else if (monthNum >= 6 && monthNum <= 8) {
      return calendarBg3rd;
    } else {
      return calendarBg1st;
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
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  return (
    <div className="min-h-screen bg-white pb-20 mt-4">
      <div className="dashboard-header bg-white p-4 pb-2 sticky top-0 z-10">
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl sm:text-7xl md:text-8xl leading-none font-extrabold tracking-tight flex items-end space-x-3 select-none">
                <span className="bounce-letter" style={{ color: "#2F92F3", textShadow: "0 6px 10px rgba(0,0,0,0.12)", "--delay": '0ms' } as React.CSSProperties}>S</span>
                <span className="bounce-letter" style={{ color: "#FF6A00", textShadow: "0 6px 10px rgba(0,0,0,0.12)", "--delay": '120ms' } as React.CSSProperties}>A</span>
                <span className="bounce-letter" style={{ color: "#00A695", textShadow: "0 6px 10px rgba(0,0,0,0.12)", "--delay": '240ms' } as React.CSSProperties}>F</span>
                <span className="bounce-letter" style={{ color: "#FFC048", textShadow: "0 6px 10px rgba(0,0,0,0.12)", "--delay": '360ms' } as React.CSSProperties}>E</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {translate(language, {
                  en: "Learn Philippine Children's Law",
                  tl: "Alamin ang Batas para sa mga Bata sa Pilipinas",
                  bis: "Pagtuon sa Balaod sa mga Bata sa Pilipinas",
                })}
              </p>
            </div>

            <div
              className="profile-rect cursor-pointer hover:scale-105 transition-transform duration-300 active:scale-95"
              onClick={() => navigate("/profile")}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3 rounded-3xl px-3 py-2 bg-transparent">
                <div className="relative">
                  <div className="avatar-frame w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 p-2 overflow-hidden shadow-md border-2 border-white">
                    <img
                      src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
                      alt="avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="notification-badge absolute -top-1 -right-1 bg-red-500 w-7 h-7 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg border-2 border-white animate-pulse">
                    1
                  </div>
                  <div className="level-badge absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[11px] font-bold px-2 py-1 rounded-full shadow-md border-2 border-white">
                    L{stats.level}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center space-y-0 text-right leading-tight">
                  <div className="text-gray-900 font-extrabold text-lg sm:text-xl truncate">
                    {username || "Guest"}
                  </div>
                  <div className="text-gray-700 text-[11px] font-medium">
                    {stats.completed}/31
                  </div>
                  <div className="text-gray-500 text-[11px] font-medium">Lessons</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 border-t border-teal-200" />
        </div>
      </div>

      <div className="px-4 mt-2 space-y-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 calendar-controls">
            <h2 className="text-2xl sm:text-3xl ml-3 font-bold text-orange-500">
              Month {currentMonth.format("M YYYY")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMonth(dayjs())}
                className="today-btn px-3 py-1 rounded-md text-sm font-medium shadow-sm focus:outline-none"
                aria-label="Today"
                data-onboarding="calendar-today"
              >
                {translate(language, {
                  en: "Today",
                  tl: "Ngayon",
                  bis: "Karon",
                })}
              </button>
              <button
                onClick={handlePrevMonth}
                className="nav-btn p-2 border rounded-md focus:outline-none"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 text-teal-700" />
              </button>
              <button
                onClick={handleNextMonth}
                className="nav-btn p-2 border rounded-md focus:outline-none"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 text-teal-700" />
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl shadow-lg relative overflow-hidden border border-gray-200 bg-white"
            style={{ minHeight: "300px" }}
            data-onboarding="calendar-main"
          >
            <Card>
              <Calendar
                key={progress.completedLessons.length}
                fullscreen={false}
                value={currentMonth}
                onPanelChange={onPanelChange}
                onSelect={onDateSelect}
                cellRender={dateCellRender}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const daysOfWeek = [
                    { day: 'Sun', color: '#2F92F3' },  // Blue
                    { day: 'Mon', color: '#FF6A00' },  // Orange
                    { day: 'Tue', color: '#00A695' },  // Teal
                    { day: 'Wed', color: '#FFC048' },  // Yellow
                    { day: 'Thu', color: '#2F92F3' },  // Blue
                    { day: 'Fri', color: '#FF6A00' },  // Orange
                    { day: 'Sat', color: '#00A695' }   // Teal
                  ];
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                      {daysOfWeek.map(({ day, color }) => (
                        <div key={day} style={{ fontWeight: 'bold', color }}>{day}</div>
                      ))}
                    </div>
                  );
                }}
                className="custom-calendar"
              />
            </Card>
          </div>
        </div>

        <Card className="rounded-2xl shadow-[var(--shadow-card)] p-4 bg-white/95 backdrop-blur-sm border border-gray-200">
          <div className="text-sm font-bold mb-3 text-center text-gray-800">
            {translate(language, {
              en: "Types of Challenges",
              tl: "Mga Uri ng Hamon",
              bis: "Mga Klase sa Hagit",
            })}
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm w-full">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: "#FFD700" }} />
              <span className="text-sm font-medium text-gray-800">
                {translate(language, {
                  en: "Individual",
                  tl: "Indibidwal",
                  bis: "Individual",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm w-full">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: "#00BCD4" }} />
              <span className="text-sm font-medium text-gray-800">
                {translate(language, {
                  en: "Family",
                  tl: "Pamilya",
                  bis: "Pamilya",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg shadow-sm w-full ">
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: "#FF9800" }} />
              <span className="text-sm font-medium text-gray-800">
                {translate(language, {
                  en: "Social Media",
                  tl: "Social Media",
                  bis: "Social Media",
                })}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="stat-card bg-sky-500 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.completed}</p>
            <p className="text-sm opacity-90">Completed</p>
          </div>
          <div className="stat-card bg-orange-500 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <Flame className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.streak}</p>
            <p className="text-sm opacity-90">
              {stats.streak === 1 ? "day" : "days"} Streak
            </p>
          </div>
          <div className="stat-card bg-amber-400 text-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center">
            <Star className="w-6 h-6 text-white mb-2" />
            <p className="text-2xl font-extrabold">{stats.level}</p>
            <p className="text-sm opacity-90">Level</p>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="calendar" />
    </div>
  );
};

export default Dashboard;

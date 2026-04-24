import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Flame, Target, TrendingUp, Trash2 } from "lucide-react";
import { Card, Progress as AntProgress, Tabs, Modal } from "antd";
import Swal from "sweetalert2";
import { useUserProgress } from "@/hooks/useUserProgress";
import { dailyArticles } from "@/data/dailyArticles";
import BottomNavigation from "@/components/BottomNavigation";
import { getCurrentLanguage, translate } from "@/lib/utils";

const girlCharacterImg = "/images/girl.png";
const boyCharacterImg = "/images/Project SAFE Calendar/Project SAFE Calendar Elements/boy.png";
const januaryAchievementImg = "/images/imagesPerWeek/January Achievement.png";
const februaryAchievementImg = "/images/Project SAFE Calendar/Project SAFE Calendar Elements/February Achievement.png";

const getMonthlyRewardImage = (month: number, character: "boy" | "girl"): string | null => {
  if (character === "girl") {
    switch (month) {
      case 1: return "/images/imagesPerWeek/January Girl.png";
      case 2: return "/images/imagesPerWeek/February Girl.png";
      case 3: return "/images/imagesPerWeek/March Girl.png";
      case 4: return "/images/imagesPerWeek/April Girl.png";
      case 5: return "/images/imagesPerWeek/May girl.png";
      case 6: return "/images/imagesPerWeek/June Girl.png";
      case 7: return "/images/imagesPerWeek/July Girl.png";
      case 8: return "/images/imagesPerWeek/August Girl.png";
      case 9: return "/images/imagesPerWeek/September Girl.png";
      case 10: return "/images/imagesPerWeek/October Girl.png";
      case 11: return "/images/imagesPerWeek/November Girl.png";
      case 12: return "/images/imagesPerWeek/December Girl.png";
      default: return null;
    }
  }

  switch (month) {
    case 1: return "/images/imagesPerWeek/January Achievement.A.png";
    case 2: return "/images/imagesPerWeek/February Achievement.A.png";
    case 3: return "/images/imagesPerWeek/March Achievement.A.png";
    case 4: return "/images/imagesPerWeek/April Achievement.A.png";
    case 5: return "/images/imagesPerWeek/May Achievement.A.png";
    case 6: return "/images/imagesPerWeek/June Achievement.A.png";
    case 7: return "/images/imagesPerWeek/July Achievment.A.png";
    case 8: return "/images/imagesPerWeek/August Achievement.A.png";
    case 9: return "/images/imagesPerWeek/September Achievement.A.png";
    case 10: return "/images/imagesPerWeek/October Achievement.A.png";
    case 11: return "/images/imagesPerWeek/November Achievement.A.png";
    case 12: return "/images/imagesPerWeek/December Achievement.A.png";
    default: return null;
  }
};

const Progress = () => {
  const navigate = useNavigate();
  const [selectedCharacter] = useState<"boy" | "girl">(() => {
    return (localStorage.getItem("selectedCharacter") as "boy" | "girl") || "girl";
  });
  const { getStats, progress, resetProgress } = useUserProgress();
  const stats = getStats();

  const handleReset = () => {
    Swal.fire({
      title: translate(language, {
        en: "Reset All Progress?",
        tl: "I-reset ang lahat ng progreso?",
        bis: "I-reset ang tanan nga progreso?",
      }),
      text: translate(language, {
        en: "This will permanently delete all your completed lessons, streaks, and rewards. This action cannot be undone!",
        tl: "Buburahin nito nang permanente ang lahat ng iyong natapos na lesson, streak, at rewards. Hindi na ito mababawi!",
        bis: "Mapapas ang tanan nimo nga nahuman nga leksiyon, streak, ug rewards. Dili na kini mabalik!",
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: translate(language, {
        en: "Yes, reset everything",
        tl: "Oo, i-reset ang lahat",
        bis: "Oo, i-reset tanan",
      }),
      cancelButtonText: translate(language, {
        en: "Cancel",
        tl: "Kanselahin",
        bis: "Kanselahon",
      }),
    }).then((result) => {
      if (result.isConfirmed) {
        resetProgress();
        Swal.fire({
          title: "Reset!",
          text: "Your progress has been cleared.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const totalLessons = dailyArticles.length;
  const completionPercentage = Math.round((stats.completed / totalLessons) * 100);
  const passScore = 85.5; // Example pass score

  const hasEarnedRewards = progress.earnedRewards.length > 0;
  const hasJanuary30Reward = progress.earnedRewards.some((ds) => ds.slice(5) === "01-30");
  const hasFebruaryEndReward = progress.earnedRewards.some((ds) => {
    const dayPart = ds.slice(5);
    return dayPart === "02-28" || dayPart === "02-29";
  });

  const getEvolvedImage = () => {
    const activeGender = selectedCharacter;
    
    // Combine earnedRewards with any lessons completed on the 30th (or Feb end)
    const allRewardDates = Array.from(new Set([
      ...progress.earnedRewards,
      ...progress.completedLessons.filter(ds => {
        const day = parseInt(ds.slice(8, 10));
        const month = parseInt(ds.slice(5, 7));
        if (day === 30) return true;
        if (month === 2 && (day === 28 || day === 29)) return true;
        return false;
      })
    ]));

    const earnedMonths = allRewardDates
      .map(ds => parseInt(ds.slice(5, 7)))
      .filter(m => !isNaN(m))
      .sort((a, b) => b - a);

    if (earnedMonths.length > 0) {
      return getMonthlyRewardImage(earnedMonths[0], activeGender) || getCharacterImage();
    }

    return getCharacterImage();
  };

  const getCharacterImage = () => {
    return selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg;
  };

  const [activeTab, setActiveTab] = useState("overview");
  const language = getCurrentLanguage();

  const tabItems = [
    {
      key: "overview",
      label: translate(language, {
        en: "Overview",
        tl: "Buod",
        bis: "Overview",
      }),
    },
    {
      key: "statistics",
      label: translate(language, {
        en: "Statistics",
        tl: "Mga Statistika",
        bis: "Mga Statistika",
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-secondary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">
              {translate(language, {
                en: "Progress Tracker",
                tl: "Tagasubay ng Progreso",
                bis: "Tigsubay sa Progreso",
              })}
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="custom-tabs"
        />
      </div>

      {activeTab === "overview" && (
        <div className="px-4 py-4">
          {/* Character and Level Card */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Character Card */}
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center border-5 border-primary overflow-hidden">
                  <img 
                    src={selectedCharacter === "boy" && hasJanuary30Reward ? januaryAchievementImg : getCharacterImage()}
                    alt="character"
                    className="w-full h-full object-contain"
                  />
              </div>
              <div className="bg-primary text-white px-3 py-1 rounded-full inline-block">
                <span className="text-sm font-semibold">
                  {translate(language, {
                    en: "Level",
                    tl: "Antas",
                    bis: "Lebel",
                  })}{" "}
                  {stats.level}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {translate(language, {
                  en: "Experience",
                  tl: "Karanasan",
                  bis: "Kasinatian",
                })}
              </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-secondary text-lg">{completionPercentage}%</span>
                  <Trophy className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card className="rounded-2xl shadow-sm border-2 border-primary/20 bg-card">
              <div className="text-center h-full flex flex-col justify-center">
                <div className="w-32 h-40 mx-auto mb-2">
                  <img 
                    src={getEvolvedImage()}
                    alt="character"
                    className="w-auto h-full object-contain"
                  />
                </div>
                {hasEarnedRewards && (
                  <div className="text-xs text-primary font-medium">
                    Rewards Earned: {progress.earnedRewards.length}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Progress Overview Section */}
         

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Lessons Completed */}
            <Card className="rounded-2xl shadow-sm border-2 border-primary/20 bg-card">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {translate(language, {
                    en: "Lessons",
                    tl: "Mga Aralin",
                    bis: "Mga Leksyon",
                  })}
                </p>
                <p className="text-2xl font-bold text-primary">{stats.completed}/{totalLessons}</p>
                <p className="text-xs text-muted-foreground">
                  {translate(language, {
                    en: "Completed",
                    tl: "Tapos",
                    bis: "Humana",
                  })}
                </p>
              </div>
            </Card>

            {/* Pass Score */}
            <Card className="rounded-2xl shadow-sm border-2 border-secondary/20 bg-white">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {translate(language, {
                    en: "Pass Score",
                    tl: "Pasa na Iskor",
                    bis: "Iskor sa Pagpasa",
                  })}
                </p>
                <p className="text-2xl font-bold text-secondary">{passScore}%</p>
                <p className="text-xs text-muted-foreground">
                  {translate(language, {
                    en: "Excellent!",
                    tl: "Napakahusay!",
                    bis: "Nindot kaayo!",
                  })}
                </p>
              </div>
            </Card>

            {/* Streak */}
            <Card className="rounded-2xl shadow-sm border-2 border-yellow-500/30 bg-card">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 mx-auto mb-2 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {translate(language, {
                    en: "Streak",
                    tl: "Sunod-sunod na Araw",
                    bis: "Sunod-sunod nga Adlaw",
                  })}
                </p>
                <p className="text-2xl font-bold text-yellow-500">
                  {stats.streak}{" "}
                  {translate(language, {
                    en: "days",
                    tl: "araw",
                    bis: "ka adlaw",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {translate(language, {
                    en: "Keep going!",
                    tl: "Ituloy mo lang!",
                    bis: "Padayon lang!",
                  })}
                </p>
              </div>
            </Card>

            {/* Overall Progress */}
            <Card className="rounded-2xl shadow-sm border-2 border-green-500/30 bg-card">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {translate(language, {
                    en: "Progress",
                    tl: "Progreso",
                    bis: "Progreso",
                  })}
                </p>
                <p className="text-2xl font-bold text-green-500">{completionPercentage}%</p>
                <p className="text-xs text-muted-foreground">
                  {translate(language, {
                    en: "Amazing!",
                    tl: "Ang galing!",
                    bis: "Nindot kaayo!",
                  })}
                </p>
              </div>
            </Card>
          </div>



          {/* Progress Overview Section */}
          <Card className="rounded-2xl shadow-sm border border-border mb-4 bg-card" data-onboarding="progress-overview">
            <h3 className="font-semibold text-foreground mb-3">
              {translate(language, {
                en: "Overall Completion",
                tl: "Kabuuang Pagtatapos",
                bis: "Tibuok Pagtuman",
              })}
            </h3>
            <AntProgress 
              percent={completionPercentage} 
              strokeColor={{
                '0%': '#00A99D',
                '100%': '#10b981',
              }}
              trailColor="#f0f0f0"
              strokeWidth={12}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>
                {stats.completed}{" "}
                {translate(language, {
                  en: "lessons completed",
                  tl: "mga leksyon ang natapos",
                  bis: "ka leksiyon ang nahuman",
                })}
              </span>
              <span>
                {totalLessons - stats.completed}{" "}
                {translate(language, {
                  en: "remaining",
                  tl: "natitira",
                  bis: "nahibilin",
                })}
              </span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "statistics" && (
        <div className="px-4 py-4">
          <Card className="rounded-2xl shadow-sm border border-border mb-4 bg-card">
            <h3 className="font-semibold text-foreground mb-4">
              {translate(language, {
                en: "Detailed Statistics",
                tl: "Detalyadong Statistika",
                bis: "Detalyadong Statistika",
              })}
            </h3>
            
            <div className="space-y-4">
              {/* Total Lessons */}
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Total Lessons",
                        tl: "Kabuuang Mga Aralin",
                        bis: "Tibuok Mga Leksyon",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Completed lessons",
                        tl: "Mga natapos na leksyon",
                        bis: "Nahuman nga mga leksiyon",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">{stats.completed}</p>
              </div>

              {/* Current Level */}
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Current Level",
                        tl: "Kasalukuyang Antas",
                        bis: "Karon nga Lebel",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Your achievement level",
                        tl: "Antas ng iyong achievement",
                        bis: "Lebel sa imong achievement",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-yellow-500">{stats.level}</p>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Current Streak",
                        tl: "Kasalukuyang Sunod-sunod na Araw",
                        bis: "Karon nga Sunod-sunod nga Adlaw",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Consecutive days",
                        tl: "Magkakasunod na araw",
                        bis: "Sunod-sunod nga mga adlaw",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-secondary">{stats.streak}</p>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Completion Rate",
                        tl: "Porsyento ng Natapos",
                        bis: "Rate sa Pagtuman",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Overall progress",
                        tl: "Kabuuang progreso",
                        bis: "Kinabuok-ang progreso",
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">{completionPercentage}%</p>
              </div>
            </div>
          </Card>

          {/* Motivational Message */}
          <Card className="rounded-2xl shadow-sm border border-border bg-card">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-foreground mb-2">
                {translate(language, {
                  en: "Keep Up the Great Work!",
                  tl: "Ipagpatuloy ang Napakagandang Gawa!",
                  bis: "Padayon sa Maayong Pagpaningkamot!",
                })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {translate(language, {
                  en: "You're doing amazing! Continue learning about children's rights and make a difference.",
                  tl: "Ang galing mo! Ipagpatuloy ang pag-aaral tungkol sa karapatan ng mga bata at gumawa ng pagbabago.",
                  bis: "Nindot kaayo imong gihimo! Padayon sa pagkat-on sa katungod sa mga bata ug paghimo og kausaban.",
                })}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Reset Progress Area */}
      <div className="pb-24 px-4 flex justify-center">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-[10px] font-medium text-destructive hover:text-white border border-destructive/30 hover:bg-destructive rounded-lg transition-all opacity-60 hover:opacity-100"
        >
          <Trash2 className="w-3 h-3" />
          {translate(language, {
            en: "Reset Journey Statistics",
            tl: "I-reset ang mga Estadistika ng Paglalakbay",
            bis: "I-reset ang mga Estadistika sa Paglawig",
          })}
        </button>
      </div>

      <BottomNavigation activeTab="progress" />
    </div>
  );
};

export default Progress;

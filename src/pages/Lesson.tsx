import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import confetti from "canvas-confetti";
import Lottie from "lottie-react";
import goldingGaunlet from "@/Lotties/goldingGaunlet.json";
import goldencandy from "@/Lotties/goldencandy.json";
import goldenFlame from "@/Lotties/goldenFlame.json";
import { createRoot } from "react-dom/client";
import successSfx from "../soundEffects/success.mp3";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Share2, HelpCircle } from "lucide-react";
import { Button, Progress } from "antd";
import { getArticleForDate, isRewardDay as isRewardDate, type DailyArticle } from "@/data/dailyArticles";
import { useUserProgress } from "@/hooks/useUserProgress";
import { cancelTodayReminders } from "@/notifications/mobileScheduler";
import { getCurrentLanguage, translate } from "@/lib/utils";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const getMonthlyPrizeImage = (month: number): string | null => {
  switch (month) {
    case 1:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Chestplate of Strength.1.png";
    case 2:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Ecoheart Amulet.1.png";
    case 3:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Gauntlets of Safety.1.png";
    case 4:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Boots of Stability.1.png";
    case 5:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Shield of Wise Choices.1.png";
    case 6:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Sword of Courage.1.png";
    case 7:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Shoulder Pads of Resilience.1.png";
    case 9:
      return "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Belt of Endurance.1.png";
    default:
      return null;
  }
};

const Lesson = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<DailyArticle | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const { markLessonCompleted, isLessonCompleted, getStats, progress } = useUserProgress();
  const stats = getStats();
  const language = getCurrentLanguage();

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

  const handleMarkComplete = async () => {
    if (!date) return;

    const result = await Swal.fire({
      title: translate(language, {
        en: "Mark as completed?",
        tl: "Markahan bilang tapos?",
        bis: "I-mark nga nahuman na?",
      }),
      text: translate(language, {
        en: "Confirm to mark today's lesson as completed.",
        tl: "Kumpirmahin para markahan ang lesson ngayon bilang tapos.",
        bis: "Kumpirmaha nga nahuman na nimo ang karon nga leksiyon.",
      }),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: translate(language, {
        en: "Yes, mark it",
        tl: "Oo, markahan",
        bis: "Oo, i-mark",
      }),
      cancelButtonText: translate(language, {
        en: "Cancel",
        tl: "Kanselahin",
        bis: "Kanselahon",
      }),
      focusCancel: true,
    });

    if (result.isConfirmed) {
      const [year, month, day] = date.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const isRewardMilestone = Boolean(article?.isRewardDay ?? isRewardDate(selectedDate));
      const isEndOfMonth = isRewardMilestone && day === 30;
      const isMilestone = isRewardMilestone;

      try {
        const audio = new Audio(successSfx);
        const saved = localStorage.getItem("settings");
        let enabled = true;
        let vol = 0.9;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (typeof parsed.successVolume === "number") {
              vol = Math.max(0, Math.min(1, parsed.successVolume / 100));
            } else if (typeof parsed.soundVolume === "number") {
              vol = Math.max(0, Math.min(1, parsed.soundVolume / 100));
            }
            if (typeof parsed.soundEffects === "boolean") {
              enabled = parsed.soundEffects;
            } else if (typeof parsed.soundVolume === "number") {
              enabled = parsed.soundVolume > 0;
            }
          } catch {}
        }
        if (enabled && vol > 0) {
          audio.volume = vol;
          audio.play().catch(() => {});
        }
      } catch {}
      if (isMilestone) {
        confetti({ particleCount: 220, spread: 110, startVelocity: 55, origin: { y: 0.6 } });
        setTimeout(() => {
          confetti({ particleCount: 160, angle: 60, spread: 80, origin: { x: 0, y: 0.6 } });
          confetti({ particleCount: 160, angle: 120, spread: 80, origin: { x: 1, y: 0.6 } });
        }, 250);
        setTimeout(() => {
          confetti({ particleCount: 140, spread: 90, origin: { x: 0.3, y: 0.2 } });
          confetti({ particleCount: 140, spread: 90, origin: { x: 0.7, y: 0.2 } });
        }, 600);
      } else {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          confetti({ particleCount: 70, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 70, angle: 120, spread: 55, origin: { x: 1 } });
        }, 200);
      }

      markLessonCompleted(selectedDate);
      try { await cancelTodayReminders(); } catch {}

      if (isMilestone) {
        const monthlyPrizeImage = isEndOfMonth ? getMonthlyPrizeImage(month) : null;
        if (monthlyPrizeImage) {
          const modalTitle = translate(language, {
            en: "🎉 Congratulations! You’ve unlocked a prize!",
            tl: "🎉 Binabati ka! May na-unlock kang prize!",
            bis: "🎉 Congratulations! Nakadawat kag ganti!",
          });
          const modalMessage = translate(language, {
            en: "You’ve completed this month’s learning journey. Enjoy your special prize!",
            tl: "Natapos mo ang pag-aaral para sa buwan na ito. I-enjoy ang iyong espesyal na prize!",
            bis: "Nahuman nimo ang pagtuon karong buwana. Lingia ang espesyal nga ganti!",
          });
          const confirmText = translate(language, {
            en: "Got it!",
            tl: "Sige!",
            bis: "Nakuha!",
          });
          await Swal.fire({
            title: "",
            html: `
              <div class="monthly-prize-backdrop">
                <div class="monthly-prize-image-wrapper">
                  <div class="monthly-prize-image-mask">
                    <img
                      src="${monthlyPrizeImage}"
                      alt="Monthly prize"
                      class="monthly-prize-image"
                      style="width:100%;height:100%;object-fit:contain;"
                    />
                  </div>
                </div>
                <button type="button" class="monthly-prize-confirm monthly-prize-cta">
                  ${confirmText}
                </button>
                <div class="monthly-prize-title" style="text-align:center;">
                  ${modalTitle}
                </div>
                <p class="monthly-prize-message" style="text-align:center;max-width:80ch;">
                  ${modalMessage}
                </p>
                <div class="monthly-prize-meta" style="text-align:center;">
                  Day ${displayDay}
                </div>
              </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
              popup: "monthly-prize-popup",
            },
            showClass: {
              popup: "monthly-prize-popup-enter",
            },
            hideClass: {
              popup: "monthly-prize-popup-exit",
            },
            didOpen: (popup: HTMLElement) => {
              const btn = popup.querySelector(".monthly-prize-cta") as HTMLButtonElement | null;
              if (!btn) return;
              btn.disabled = true;
              setTimeout(() => {
                btn.classList.add("monthly-prize-confirm-visible");
                btn.disabled = false;
              }, 2000);
              btn.addEventListener("click", () => {
                Swal.close();
              });
            },
          });
        } else {
          const priorThirtyCompletions = progress.completedLessons.reduce((count, ds) => {
            const [yy, mm, dd] = ds.split('-').map(Number);
            return count + (dd === 30 ? 1 : 0);
          }, 0);
          const currentThirtyIndex = priorThirtyCompletions + 1;
          let selectedAnimation = goldenFlame;
          if (currentThirtyIndex === 1) {
            selectedAnimation = goldingGaunlet;
          } else if (currentThirtyIndex === 2) {
            selectedAnimation = goldencandy;
          }

          const rewardTitle =
            article?.reward?.title ??
            translate(language, {
              en: "Reward Day! 🎉",
              tl: "Reward Day! 🎉",
              bis: "Adlaw sa Ganti! 🎉",
            });
          const rewardMessage =
            article?.reward?.message ??
            translate(language, {
              en: "Fantastic job — you completed 30 days of learning!",
              tl: "Ang galing — natapos mo ang 30 araw ng pag-aaral!",
              bis: "Nindot kaayo — nahuman nimo ang 30 ka adlaw sa pagtuon!",
            });

          let lottieRoot: ReturnType<typeof createRoot> | null = null;
          await Swal.fire({
            title: rewardTitle,
            html: `
              <div class="reward-content" style="display:flex;flex-direction:column;align-items:center;">
                <div id="reward-lottie" class="reward-lottie-pulse" style="width:min(90vw, 780px);height:min(90vw, 780px);margin:0 auto"></div>
                <p style="margin-top:8px;text-align:center;">${rewardMessage}</p>
                <div class="badge">Day ${displayDay}</div>
              </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Claim Reward 🎁",
            customClass: {
              popup: "reward-modal",
              title: "reward-title",
              htmlContainer: "reward-content",
              confirmButton: "reward-confirm",
            },
            showClass: { popup: "reward-popup-enter" },
            hideClass: { popup: "reward-popup-exit" },
            didOpen: () => {
              const container = document.getElementById("reward-lottie");
              if (container) {
                lottieRoot = createRoot(container);
                lottieRoot.render(
                  <Lottie animationData={selectedAnimation} loop={true} autoplay={true} style={{ width: "100%", height: "100%" }} />
                );
              }
            },
            willClose: () => {
              if (lottieRoot) {
                lottieRoot.unmount();
                lottieRoot = null;
              }
            }
          });
        }
      } else {
        await Swal.fire({
          title: translate(language, {
            en: "Completed!",
            tl: "Tapos na!",
            bis: "Nahuman na!",
          }),
          text: translate(language, {
            en: "Lesson marked as completed.",
            tl: "Naka-mark na ang lesson bilang tapos.",
            bis: "Na-mark na ang leksiyon nga nahuman na.",
          }),
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-muted-foreground">
            {translate(language, {
              en: "Lesson not found",
              tl: "Walang nahanap na lesson",
              bis: "Wala nakit-an nga leksiyon",
            })}
          </h2>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="mt-4"
            type="primary"
          >
            {translate(language, {
              en: "Back to Dashboard",
              tl: "Bumalik sa Dashboard",
              bis: "Balik sa Dashboard",
            })}
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
  // Safer day parsing to avoid timezone issues in display
  const displayDay = (() => {
    const [y, m, d] = date.split('-').map(Number);
    return d;
  })();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">
              {translate(language, {
                en: "Daily Lesson",
                tl: "Araw-araw na Lesson",
                bis: "Adlaw-adlaw nga Leksyon",
              })}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center overflow-hidden">
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
            Day {displayDay}
          </div>
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            {article.title}
          </h2>
        </div>

        {/* Reading Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {translate(language, {
                en: "Reading Progress:",
                tl: "Pag-usad sa Pagbabasa:",
                bis: "Pag-uswag sa Pagbasa:",
              })}
            </span>
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
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6" data-onboarding="lesson-content">
          {/* Show full content if available, otherwise show description */}
          {article.fullContent && (
            <div className="mb-4">
              <h4 className="font-semibold text-foreground mb-3">
                {translate(language, {
                  en: "Content:",
                  tl: "Nilalaman:",
                  bis: "Sulod:",
                })}
              </h4>
              <p className="text-foreground leading-relaxed">
                {article.fullContent}
              </p>
            </div>
          )}
          
          {!article.fullContent && (
            <p className="text-foreground leading-relaxed mb-4">
              {article.description}
            </p>
          )}
        </div>

          {/* Image placeholder - you can add actual images here */}
        <div className="bg-muted rounded-2xl h-48 mb-6 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
            <p className="text-sm">Lesson illustration</p>
          </div>
        </div>

        {/* Show external link if available */}
        <div>
          {article.externalLink && (
            <div className="mt-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {translate(language, {
                      en: "Learn More:",
                      tl: "Matuto Pa:",
                      bis: "Dugangi ang Kahibalo:",
                    })}
                  </h4>
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
        <div className="bg-muted rounded-2xl h-48 mb-6 flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
            <p className="text-sm">
              {translate(language, {
                en: "Lesson illustration",
                tl: "Ilustrasyon ng lesson",
                bis: "Hulagway sa leksiyon",
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Mark as Complete Button */}
          {isCompleted ? (
            <div className="flex items-center justify-center gap-2 py-3 bg-primary/10 rounded-xl border border-primary/20">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">
                {translate(language, {
                  en: "Lesson Completed!",
                  tl: "Tapos na ang lesson!",
                  bis: "Nahuman na ang leksiyon!",
                })}
              </span>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              onClick={handleMarkComplete}
              className="h-12 rounded-xl font-medium shadow-sm"
              icon={<CheckCircle className="w-5 h-5" />}
              data-onboarding="lesson-complete"
            >
              {translate(language, {
                en: "Mark as Complete",
                tl: "Markahan bilang Tapos",
                bis: "I-mark nga Nahuman",
              })}
            </Button>
          )}

          {/* Quiz Button */}
          <Button
            size="large"
            block
            onClick={handleQuiz}
            className="h-12 rounded-xl font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white"
            icon={<HelpCircle className="w-5 h-5" />}
            data-onboarding="lesson-quiz"
          >
            {translate(language, {
              en: "Quiz",
              tl: "Quiz",
              bis: "Quiz",
            })}
          </Button>

          {/* Share Button */}
          <Button
            size="large"
            block
            onClick={handleShareWithFamily}
            className="h-12 rounded-xl font-medium bg-card border-2 border-border text-foreground hover:bg-muted shadow-sm"
            icon={<Share2 className="w-5 h-5" />}
          >
            {translate(language, {
              en: "Share with Family",
              tl: "Ibahagi sa Pamilya",
              bis: "I-share sa Pamilya",
            })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lesson;

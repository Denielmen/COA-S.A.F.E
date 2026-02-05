import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import welcomeSound from "@/soundEffects/welcome.wav";
import { getCurrentLanguage, translate } from "@/lib/utils";

const Welcome = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const language = getCurrentLanguage();

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    const selectedCharacter = localStorage.getItem("selectedCharacter");
    if (onboardingCompleted === "true" && selectedCharacter) {
      navigate("/dashboard");
      return;
    }

    const audio = new Audio(welcomeSound);
    audioRef.current = audio;
    let handler: (() => void) | null = null;

    audio.play().catch(() => {
      handler = () => {
        audio.play().catch(() => {});
        if (handler) {
          document.removeEventListener("click", handler);
          document.removeEventListener("keydown", handler);
        }
      };
      document.addEventListener("click", handler);
      document.addEventListener("keydown", handler);
    });

    return () => {
      if (handler) {
        document.removeEventListener("click", handler);
        document.removeEventListener("keydown", handler);
      }
      audio.pause();
      audio.currentTime = 0;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl text-muted-foreground font-medium">
            {translate(language, {
              en: "Welcome to",
              tl: "Maligayang pagdating sa",
              bis: "Maayong pag-abot sa",
            })}
          </h2>
          <h1 className="welcome-wave-in text-6xl font-bold tracking-tight">
            <span className="text-[hsl(187,100%,42%)]">S</span>
            <span className="text-[hsl(33,100%,50%)]">A</span>
            <span className="text-[hsl(187,100%,42%)]">F</span>
            <span className="text-[hsl(45,100%,51%)]">E</span>
            <span className="text-[hsl(187,100%,42%)]"> !</span>
          </h1>
        </div>

        <div className="pt-20 space-y-4">
          <p className="text-secondary text-sm font-medium">
            {translate(language, {
              en: "Learn Philippine Children's Law",
              tl: "Alamin ang Batas para sa mga Bata sa Pilipinas",
              bis: "Pagtuon sa Balaod sa mga Bata sa Pilipinas",
            })}
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/onboarding")}
            className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="end"
          >
            {translate(language, {
              en: "Get Started",
              tl: "Magsimula",
              bis: "Sugdi na",
            })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

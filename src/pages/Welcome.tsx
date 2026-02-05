import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import welcomeSound from "@/soundEffects/welcome.wav";
import { getCurrentLanguage, translate } from "@/lib/utils";

const Welcome = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const language = getCurrentLanguage();

  useEffect(() => {
    const audio = new Audio(welcomeSound);
    audioRef.current = audio;
    let handler: (() => void) | null = null;

    // Try to play immediately; if blocked by browser autoplay policy, play on first user interaction.
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
  }, []);

  const handleProceed = () => navigate("/onboarding");

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6 cursor-pointer"
      onClick={handleProceed}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleProceed();
      }}
      aria-label="Proceed to onboarding"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm sm:text-base text-muted-foreground font-medium">Welcome to</h2>
          <h1 className="text-6xl sm:text-7xl md:text-8xl leading-none font-extrabold tracking-tight flex justify-center items-end space-x-3 select-none">
            <span className="bounce-letter" style={{ color: "#2F92F3", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '0ms' } as React.CSSProperties}>S</span>
            <span className="bounce-letter" style={{ color: "#FF6A00", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '120ms' } as React.CSSProperties}>A</span>
            <span className="bounce-letter" style={{ color: "#00A695", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '240ms' } as React.CSSProperties}>F</span>
            <span className="bounce-letter" style={{ color: "#FFC048", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '360ms' } as React.CSSProperties}>E</span>
          </h1>
        </div>

        <div className="pt-6">
          <p className="text-black text-sm font-medium tagline" style={{ ['--delay' as any]: '880ms' } as React.CSSProperties}>Learn Philippine Laws for Children</p>
          <p className="mt-2 text-xs text-muted-foreground">Tap anywhere to continue</p>
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

import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import welcomeSound from "@/soundEffects/welcome.wav";

const Welcome = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl text-muted-foreground font-medium">
            Welcome to
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
            Learn Philippine Children's Law
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/onboarding")}
            className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="end"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

import { useEffect, useRef, useState } from "react";
import { Button, Card } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import startSfx from "@/soundEffects/start.mp3";
import Lottie from "lottie-react";
import teamAnimation from "@/Lotties/team.json";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const CharacterSelect = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">("girl");
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showTransition, setShowTransition] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(startSfx);
    audioRef.current.volume = 0.8; // 80% volume
    audioRef.current.preload = "auto";
  }, []);

  const handleContinue = () => {
    // Save selected character to localStorage
    localStorage.setItem("selectedCharacter", selectedCharacter);
    // Trigger full-screen transition, then navigate after ~1.5s
    setShowTransition(true);
    // Play start sound at the moment the transition begins
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    }
    // After the swallow animation, show a welcome modal; user will proceed manually
    setTimeout(() => {
      setShowTransition(false);
      setShowWelcomeModal(true);
    }, 1500);
  };

  const closeWelcomeAndNavigate = () => {
    setShowWelcomeModal(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            Choose Your Child's Character
          </h1>
          <p className="text-secondary text-sm">
            Select a character to track your progress and unlock achievements together!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card
            hoverable
            onClick={() => setSelectedCharacter("boy")}
            className={`rounded-2xl cursor-pointer transition-all ${
              selectedCharacter === "boy"
                ? "border-4 border-primary shadow-lg scale-105"
                : "border-2 border-border"
            }`}
            bodyStyle={{ padding: "2rem 1rem" }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={boyCharacterImg} 
                  alt="Boy character"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    console.error("Failed to load boy character image:", boyCharacterImg);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-accent">boy</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => setSelectedCharacter("girl")}
            className={`rounded-2xl cursor-pointer transition-all ${
              selectedCharacter === "girl"
                ? "border-4 border-primary shadow-lg scale-105"
                : "border-2 border-border"
            }`}
            bodyStyle={{ padding: "2rem 1rem" }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={girlCharacterImg} 
                  alt="Girl character"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    console.error("Failed to load girl character image:", girlCharacterImg);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-accent">girl</p>
            </div>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-primary text-sm font-medium">Let's Start!</p>
          <Button
            type="primary"
            size="large"
            onClick={handleContinue}
            className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="end"
          >
            Continue
          </Button>
          <div className="flex gap-2 justify-center pt-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === 3 ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {showTransition && <div className="screen-transition" aria-hidden="true" />}

      {showWelcomeModal && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm welcome-bounce-in">
            <div className="w-36 mx-auto">
              <Lottie animationData={teamAnimation} loop autoplay />
            </div>
            <h2 className="text-xl font-bold text-center mt-4">Hi! 👋</h2>
            <p className="text-center text-muted-foreground">Welcome back!</p>
            <div className="mt-6 flex justify-center">
              <Button type="primary" size="middle" onClick={closeWelcomeAndNavigate}>
                Let’s go
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelect;

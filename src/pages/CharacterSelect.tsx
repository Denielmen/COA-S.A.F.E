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
  // start with no selection so Continue is disabled until user chooses
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl" | null>(null);
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
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCharacter('boy'); }}
            role="button"
            tabIndex={0}
            className={`character-card rounded-2xl cursor-pointer transition-all p-2 ${
              selectedCharacter === "boy"
                ? "selected"
                : ""
            }`}
            bodyStyle={{ padding: "1.25rem" }}
          >
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <img 
                  src={boyCharacterImg} 
                  alt="Boy character"
                  className="w-36 h-36 object-contain rounded-lg"
                  onError={(e) => {
                    console.error("Failed to load boy character image:", boyCharacterImg);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-teal-700 capitalize">Boy</p>
            </div>
          </Card>

          <Card
            hoverable
            onClick={() => setSelectedCharacter("girl")}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCharacter('girl'); }}
            role="button"
            tabIndex={0}
            className={`character-card rounded-2xl cursor-pointer transition-all p-2 ${
              selectedCharacter === "girl"
                ? "selected"
                : ""
            }`}
            bodyStyle={{ padding: "1.25rem" }}
          >
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <img 
                  src={girlCharacterImg} 
                  alt="Girl character"
                  className="w-36 h-36 object-contain rounded-lg"
                  onError={(e) => {
                    console.error("Failed to load girl character image:", girlCharacterImg);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <p className="text-lg font-bold text-teal-700 capitalize">Girl</p>
            </div>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-teal-700 text-sm font-medium">Tap to select.</p>

          <button
            onClick={handleContinue}
            disabled={!selectedCharacter}
            aria-disabled={!selectedCharacter}
            className={`w-full h-12 rounded-full font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-200 ${
              selectedCharacter
                ? 'bg-teal-700 hover:bg-teal-600 text-white'
                : 'bg-teal-200 text-teal-700 opacity-70 cursor-not-allowed'
            }`}
          >
            Continue
          </button>

          <div className="flex gap-2 justify-center pt-3">
            {['boy','girl'].map((c, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full ${selectedCharacter === (c as any) ? 'bg-amber-400' : 'bg-amber-200'}`} />
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

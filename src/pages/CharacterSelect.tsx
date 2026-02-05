import { useEffect, useRef, useState } from "react";
import { Button, Card } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import starAnimation from "@/Lotties/Star.json";
import startSfx from "@/soundEffects/start.mp3";
import { getCurrentLanguage, translate } from "@/lib/utils";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const CharacterSelect = () => {
  // start with no selection so Continue is disabled until user chooses
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl" | null>(null);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const language = getCurrentLanguage();

  const [showTransition, setShowTransition] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState<React.CSSProperties | undefined>(undefined);
  const [showStar, setShowStar] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(startSfx);
    audioRef.current.volume = 0.8; // 80% volume
    audioRef.current.preload = "auto";
  }, []);

  const handleContinue = () => {
    // Save selected character to localStorage
    localStorage.setItem("selectedCharacter", selectedCharacter);
    // Trigger full-screen blue transition, then show welcome modal after ~1.5s
    setTransitionStyle({ background: "#2563eb" });
    setShowTransition(true);
    // Play start sound at the moment the transition begins
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play();
    }
    // After the swallow animation, show star Lottie for 1.5s, then navigate
    setTimeout(() => {
      setShowTransition(false);
      setShowStar(true);
      setTimeout(() => {
        setShowStar(false);
        navigate("/dashboard");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">
            {translate(language, {
              en: "Choose Your Child's Character",
              tl: "Piliin ang Character ng Iyong Anak",
              bis: "Pili-a ang Character sa Imong Anak",
            })}
          </h1>
          <p className="text-secondary text-sm">
            {translate(language, {
              en: "Select a character to track your progress and unlock achievements together!",
              tl: "Pumili ng character para masubaybayan ang progreso at ma-unlock ang achievements nang magkasama!",
              bis: "Pili ug character para masubaybayan ang progreso ug ma-unlock ang achievements kuyog ninyo!",
            })}
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
              <p className="text-lg font-bold text-accent">
                {translate(language, {
                  en: "Boy",
                  tl: "Lalaki",
                  bis: "Bata nga Lalaki",
                })}
              </p>
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
              <p className="text-lg font-bold text-accent">
                {translate(language, {
                  en: "Girl",
                  tl: "Babae",
                  bis: "Bata nga Babaye",
                })}
              </p>
            </div>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-teal-700 text-sm font-medium">Tap to select.</p>

          <button
          <p className="text-primary text-sm font-medium">
            {translate(language, {
              en: "Let's Start!",
              tl: "Magsimula na tayo!",
              bis: "Magsugod ta!",
            })}
          </p>
          <Button
            type="primary"
            size="large"
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
            {translate(language, {
              en: "Continue",
              tl: "Magpatuloy",
              bis: "Padayon",
            })}
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
      {showTransition && (
        <div
          className="screen-transition"
          style={transitionStyle}
          aria-hidden="true"
        >
          <h1 className="text-6xl font-bold tracking-tight safe-zoom-out">
            <span className="text-[hsl(187,100%,42%)]">S</span>
            <span className="text-[hsl(33,100%,50%)]">A</span>
            <span className="text-[hsl(187,100%,42%)]">F</span>
            <span className="text-[hsl(45,100%,51%)]">E</span>
            <span className="text-[hsl(187,100%,42%)]"> !</span>
          </h1>
        </div>
      )}

      {showStar && (
        <div
          className="screen-overlay"
          style={transitionStyle}
          aria-hidden="true"
        >
          <Lottie
            animationData={starAnimation}
            loop={false}
            style={{ width: 220, height: 220 }}
          />
        </div>
      )}

      {/* Welcome modal removed */}
    </div>
  );
};

export default CharacterSelect;

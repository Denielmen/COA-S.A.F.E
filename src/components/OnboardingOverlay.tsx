import type { ReactNode, CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import welcomeVoice from "@/soundEffects/_Welcome to Project .mp3";
import letsWithToday from "@/soundEffects/_LetsWithToday.mp3";
import thisIsYourLessonCard from "@/soundEffects/ThisIsYourLessonCard.mp3";
import whenYouFinish from "@/soundEffects/WhenYouFinish.mp3";
import afterYouRead from "@/soundEffects/AfterYouRead.mp3";
import hereYouCanSee from "@/soundEffects/HereYouCanSee.mp3";

type OnboardingStep = {
  id: string;
  routePrefix: string;
  title: string;
  body: string;
  ctaLabel?: string;
  secondaryCtaLabel?: string;
  targetSelector?: string;
  arrowSide?: "top" | "bottom" | "left" | "right";
};

type OnboardingState = {
  isActive: boolean;
  currentStepIndex: number;
};

const STORAGE_KEY = "safe-onboarding-tour";
const NARRATOR_IMAGE =
  "/images/Project SAFE Calendar/Project SAFE Calendar Elements/Onboarding-Boy.png";
const POINTER_IMAGE =
  "/images/Project SAFE Calendar/Project SAFE Calendar Elements/pointingHand.png";

const STEP_AUDIO: Record<string, string> = {
  "welcome-dashboard": welcomeVoice,
  "calendar-today": letsWithToday,
  "lesson-content": thisIsYourLessonCard,
  "lesson-complete": whenYouFinish,
  "lesson-quiz": afterYouRead,
  "progress-overview": hereYouCanSee,
};

const steps: OnboardingStep[] = [
  {
    id: "welcome-dashboard",
    routePrefix: "/dashboard",
    title: "Welcome to SAFE!",
    body: "Welcome to Project SAFE. This calendar is where you’ll see your daily lessons and challenges. Each day you tap a date to learn something new about keeping children safe.",
    ctaLabel: "Next step",
    secondaryCtaLabel: "Skip tour",
    targetSelector: '[data-onboarding="calendar-main"]',
    arrowSide: "left",
  },
  {
    id: "calendar-today",
    routePrefix: "/dashboard",
    title: "Start with today",
    body: "Let’s start with today. Look at the calendar and tap today’s date to open your lesson.",
    ctaLabel: "Next step",
    secondaryCtaLabel: "Skip tour",
    targetSelector: '[data-onboarding="calendar-today"]',
    arrowSide: "top",
  },
  {
    id: "lesson-content",
    routePrefix: "/lesson/",
    title: "Read the lesson card",
    body: "This is your lesson card. Read through today’s story and the law so you understand how to protect children in real-life situations.",
    ctaLabel: "Next step",
    secondaryCtaLabel: "Skip tour",
    targetSelector: '[data-onboarding="lesson-content"]',
    arrowSide: "bottom",
  },
  {
    id: "lesson-complete",
    routePrefix: "/lesson/",
    title: "Mark as complete",
    body: "When you finish reading, tap the ‘Mark as Complete’ button. This will save your progress and keep your learning streak going.",
    ctaLabel: "Next step",
    secondaryCtaLabel: "Skip tour",
    targetSelector: '[data-onboarding="lesson-complete"]',
    arrowSide: "top",
  },
  {
    id: "lesson-quiz",
    routePrefix: "/lesson/",
    title: "Try the quiz",
    body: "After reading, try the quiz. Answering a few questions helps you remember what you learned and earn more rewards for your character.",
    ctaLabel: "Next step",
    secondaryCtaLabel: "Skip tour",
    targetSelector: '[data-onboarding="lesson-quiz"]',
    arrowSide: "bottom",
  },
  {
    id: "progress-overview",
    routePrefix: "/progress",
    title: "See your progress",
    body: "Here you can see your overall progress. You’ll find how many lessons you’ve finished, your streak, and your level. Keep coming back every day to grow your knowledge and protect more children.",
    ctaLabel: "Finish tour",
    secondaryCtaLabel: "Skip",
    targetSelector: '[data-onboarding="progress-overview"]',
    arrowSide: "bottom",
  },
];

const loadInitialState = (): OnboardingState => {
  if (typeof window === "undefined") {
    return { isActive: false, currentStepIndex: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isActive: true, currentStepIndex: 0 };
    const parsed = JSON.parse(raw) as { completed?: boolean; currentStepIndex?: number };
    if (parsed.completed) {
      return { isActive: false, currentStepIndex: 0 };
    }
    return {
      isActive: true,
      currentStepIndex: typeof parsed.currentStepIndex === "number" ? parsed.currentStepIndex : 0,
    };
  } catch {
    return { isActive: true, currentStepIndex: 0 };
  }
};

type ProviderProps = {
  children: ReactNode;
};

const routeMatchesPrefix = (pathname: string, prefix: string) => {
  if (prefix.endsWith("/")) {
    return pathname.startsWith(prefix);
  }
  return pathname === prefix;
};

const OnboardingOverlay = ({
  step,
  onNext,
  onSkip,
}: {
  step: OnboardingStep | null;
  onNext: () => void;
  onSkip: () => void;
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const narratorAudioRef = useRef<HTMLAudioElement | null>(null);
  const [typedBody, setTypedBody] = useState(step?.body ?? "");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!step || !step.targetSelector) {
      setTargetRect(null);
      return;
    }
    const updateRect = () => {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [step]);

  useEffect(() => {
    if (!step) {
      setTypedBody("");
      setIsTyping(false);
      return;
    }
    const fullText = step.body;
    setTypedBody("");
    setIsTyping(true);
    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setTypedBody(fullText.slice(0, index));
      if (index >= fullText.length) {
        window.clearInterval(intervalId);
        setIsTyping(false);
      }
    }, 55);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [step]);

  useEffect(() => {
    if (narratorAudioRef.current) {
      narratorAudioRef.current.pause();
      narratorAudioRef.current.currentTime = 0;
      narratorAudioRef.current = null;
    }

    if (!step) {
      return;
    }

    const src = STEP_AUDIO[step.id];
    if (!src) {
      return;
    }

    const audio = new Audio(src);
    narratorAudioRef.current = audio;

    let volume = 0.9;
    let enabled = true;
    try {
      const saved = localStorage.getItem("settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.soundVolume === "number") {
          volume = Math.max(0, Math.min(1, parsed.soundVolume / 100));
        }
        if (typeof parsed.soundEffects === "boolean") {
          enabled = parsed.soundEffects;
        } else if (typeof parsed.soundVolume === "number") {
          enabled = parsed.soundVolume > 0;
        }
      }
    } catch {
      volume = 0.9;
      enabled = true;
    }

    let timeoutId: number | undefined;
    if (enabled && volume > 0) {
      timeoutId = window.setTimeout(() => {
        audio.volume = volume;
        audio.play().catch(() => {});
      }, 700);
    }

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      audio.pause();
      audio.currentTime = 0;
      if (narratorAudioRef.current === audio) {
        narratorAudioRef.current = null;
      }
    };
  }, [step]);

  if (!step) return null;

  const spotlightRect = targetRect
    ? (() => {
        const padding = 16;
        const top = Math.max(0, targetRect.top - padding);
        const left = Math.max(0, targetRect.left - padding);
        const width = Math.min(window.innerWidth - left, targetRect.width + padding * 2);
        const height = Math.min(window.innerHeight - top, targetRect.height + padding * 2);
        return { top, left, width, height };
      })()
    : null;

  const bubbleStyle: CSSProperties | undefined = targetRect
    ? (() => {
        const offset = 24;
        if (step.arrowSide === "top") {
          return {
            top: targetRect.top + targetRect.height + offset,
            left: Math.min(
              window.innerWidth - 280,
              Math.max(16, targetRect.left + targetRect.width / 2 - 140),
            ),
          };
        }
        if (step.arrowSide === "bottom") {
          return {
            top: Math.max(16, targetRect.top - offset - 140),
            left: Math.min(
              window.innerWidth - 280,
              Math.max(16, targetRect.left + targetRect.width / 2 - 140),
            ),
          };
        }
        if (step.arrowSide === "left") {
          return {
            top: Math.max(16, targetRect.top),
            left: Math.min(window.innerWidth - 280, targetRect.left + targetRect.width + offset),
          };
        }
        if (step.arrowSide === "right") {
          return {
            top: Math.max(16, targetRect.top),
            left: Math.max(16, targetRect.left - 280 - offset),
          };
        }
        return {
          top: Math.max(16, window.innerHeight / 2 - 100),
          left: Math.max(16, window.innerWidth / 2 - 140),
        };
      })()
    : {
        top: Math.max(16, window.innerHeight / 2 - 100),
        left: Math.max(16, window.innerWidth / 2 - 140),
      };

  const pointerPosition: CSSProperties | undefined = targetRect
    ? (() => {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const offset = 56;
        if (step.arrowSide === "top") {
          return {
            top: centerY + targetRect.height / 2 + offset,
            left: centerX,
          };
        }
        if (step.arrowSide === "bottom") {
          return {
            top: centerY - targetRect.height / 2 - offset,
            left: centerX,
          };
        }
        if (step.arrowSide === "left") {
          return {
            top: centerY,
            left: targetRect.left - offset,
          };
        }
        if (step.arrowSide === "right") {
          return {
            top: centerY,
            left: targetRect.right + offset,
          };
        }
        return {
          top: centerY,
          left: centerX + offset,
        };
      })()
    : undefined;

  const pointerClassName = [
    "onboarding-pointer",
    step.arrowSide ? `onboarding-pointer-${step.arrowSide}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="onboarding-overlay">
      {spotlightRect ? (
        <>
          <div
            className="onboarding-overlay-part"
            style={{
              top: 0,
              left: 0,
              width: "100vw",
              height: spotlightRect.top,
            }}
          />
          <div
            className="onboarding-overlay-part"
            style={{
              top: spotlightRect.top + spotlightRect.height,
              left: 0,
              width: "100vw",
              height: Math.max(
                0,
                window.innerHeight - (spotlightRect.top + spotlightRect.height),
              ),
            }}
          />
          <div
            className="onboarding-overlay-part"
            style={{
              top: spotlightRect.top,
              left: 0,
              width: spotlightRect.left,
              height: spotlightRect.height,
            }}
          />
          <div
            className="onboarding-overlay-part"
            style={{
              top: spotlightRect.top,
              left: spotlightRect.left + spotlightRect.width,
              width: Math.max(
                0,
                window.innerWidth - (spotlightRect.left + spotlightRect.width),
              ),
              height: spotlightRect.height,
            }}
          />
        </>
      ) : (
        <div className="onboarding-overlay-inner" />
      )}
      {pointerPosition && (
        <div className={pointerClassName} style={pointerPosition}>
          <img src={POINTER_IMAGE} alt="" />
        </div>
      )}
      <div
        className="onboarding-bubble"
        style={{
          top: bubbleStyle?.top,
          left: bubbleStyle?.left,
        }}
      >
        <div className="onboarding-bubble-header">
          <div className="onboarding-title">{step.title}</div>
        </div>
        <div className={isTyping ? "onboarding-body onboarding-body-typing" : "onboarding-body"}>
          {typedBody}
        </div>
        <div className="onboarding-actions">
          {step.secondaryCtaLabel && (
            <button type="button" className="onboarding-secondary" onClick={onSkip}>
              {step.secondaryCtaLabel}
            </button>
          )}
          {step.ctaLabel && (
            <button type="button" className="onboarding-primary" onClick={onNext}>
              {step.ctaLabel}
            </button>
          )}
        </div>
      </div>
      <img src={NARRATOR_IMAGE} alt="" className="onboarding-character" />
    </div>
  );
};


export const OnboardingProvider = ({ children }: ProviderProps) => {
  const location = useLocation();
  const [state, setState] = useState<OnboardingState>(() => loadInitialState());

  useEffect(() => {
    try {
      const payload = {
        currentStepIndex: state.currentStepIndex,
        completed: !state.isActive,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    }
  }, [state]);

  const visibleStep = useMemo(() => {
    if (!state.isActive) return null;
    const step = steps[state.currentStepIndex];
    if (!step) return null;
    if (!routeMatchesPrefix(location.pathname, step.routePrefix)) return null;
    return step;
  }, [state.isActive, state.currentStepIndex, location.pathname]);

  const goNext = () => {
    setState(prev => {
      const nextIndex = prev.currentStepIndex + 1;
      if (nextIndex >= steps.length) {
        return { isActive: false, currentStepIndex: prev.currentStepIndex };
      }
      return { ...prev, currentStepIndex: nextIndex };
    });
  };

  const skip = () => {
    setState({ isActive: false, currentStepIndex: state.currentStepIndex });
  };

  useEffect(() => {
    const handler = () => {
      setState({ isActive: true, currentStepIndex: 0 });
    };
    window.addEventListener("restart-onboarding-tour", handler);
    return () => {
      window.removeEventListener("restart-onboarding-tour", handler);
    };
  }, []);

  return (
    <>
      {children}
      <OnboardingOverlay step={visibleStep} onNext={goNext} onSkip={skip} />
    </>
  );
};

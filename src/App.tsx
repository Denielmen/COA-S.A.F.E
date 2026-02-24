import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider } from "antd";
import { useEffect, useRef } from "react";
import mainSound from "@/soundEffects/main.mp3";
import { useReminderNotifications } from "@/hooks/useReminderNotifications";
import { OnboardingProvider } from "@/components/OnboardingOverlay";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import CharacterSelect from "./pages/CharacterSelect";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Lessons from "./pages/Lessons";
import Quizzes from "./pages/Quizzes";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";  
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Persistent global audio player: plays main.mp3 at 50% volume on all routes
// except the Lesson page, and loops on all other routes.
const GlobalAudio = () => {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionHandlerRef = useRef<((e: Event) => void) | null>(null);

  const isExcludedRoute = (pathname: string) => {
    if (pathname.startsWith("/lesson")) return true;
    const excluded = ["/", "/onboarding", "/character-select", "/dashboard"];
    return excluded.includes(pathname);
  };

  const isAudioAllowed = (pathname: string) => !isExcludedRoute(pathname);

  const computeVolumeFromSettings = () => {
    try {
      const saved = localStorage.getItem("settings");
      let vol = 0.5; // default 50%
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
      return enabled ? vol : 0;
    } catch {
      return 0.5;
    }
  };

  // Initialize audio once
  useEffect(() => {
    const audio = new Audio(mainSound);
    audio.volume = computeVolumeFromSettings();
    audio.loop = true;  // loop by default
    audioRef.current = audio;

    // Only attempt autoplay if current route allows audio
    if (isAudioAllowed(location.pathname)) {
      audio.play().catch(() => {
        const handler = () => {
          audio.play().catch(() => {});
          document.removeEventListener("click", handler);
          document.removeEventListener("keydown", handler);
          interactionHandlerRef.current = null;
        };
        interactionHandlerRef.current = handler;
        document.addEventListener("click", handler);
        document.addEventListener("keydown", handler);
      });
    }

    return () => {
      // Cleanup listeners and audio on unmount
      if (interactionHandlerRef.current) {
        document.removeEventListener("click", interactionHandlerRef.current);
        document.removeEventListener("keydown", interactionHandlerRef.current);
      }
      audio.pause();
      audio.currentTime = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respond to route changes: pause on lesson, play+loop elsewhere
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isAudioAllowed(location.pathname)) {
      // Pause on excluded routes and remove any pending interaction handler
      audio.pause();
      if (interactionHandlerRef.current) {
        document.removeEventListener("click", interactionHandlerRef.current);
        document.removeEventListener("keydown", interactionHandlerRef.current);
        interactionHandlerRef.current = null;
      }
    } else {
      // Ensure desired settings, then attempt playback
      audio.volume = computeVolumeFromSettings();
      audio.loop = true;
      audio.play().catch(() => {
        // Add one-time interaction fallback to start playback after a user gesture
        if (!interactionHandlerRef.current) {
          const handler = () => {
            audio.play().catch(() => {});
            document.removeEventListener("click", handler);
            document.removeEventListener("keydown", handler);
            interactionHandlerRef.current = null;
          };
          interactionHandlerRef.current = handler;
          document.addEventListener("click", handler, { once: true });
          document.addEventListener("keydown", handler, { once: true });
        }
      });
    }
  }, [location.pathname]);

  // React to settings save events to adjust volume live
  useEffect(() => {
    const onSettingsSaved = (e: Event) => {
      const audio = audioRef.current;
      if (!audio) return;
      try {
        const detail = (e as CustomEvent<any>).detail;
        let vol = 0.5;
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
        audio.volume = enabled ? vol : 0;
      } catch {}
    };
    window.addEventListener("settings-saved", onSettingsSaved as EventListener);
    return () => {
      window.removeEventListener("settings-saved", onSettingsSaved as EventListener);
    };
  }, []);

  // Pause/resume audio when the app goes to background or tab is hidden
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onVisibility = () => {
      if (document.hidden) {
        audio.pause();
      } else if (isAudioAllowed(location.pathname)) {
        audio.volume = computeVolumeFromSettings();
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let removeAppState: (() => void) | null = null;
    import("@capacitor/app")
      .then(({ App }) => {
        App.addListener("appStateChange", ({ isActive }) => {
          const a = audioRef.current;
          if (!a) return;
          if (!isActive) {
            a.pause();
          } else if (isAudioAllowed(location.pathname)) {
            a.volume = computeVolumeFromSettings();
            a.play().catch(() => {});
          }
        }).then(sub => {
          removeAppState = () => sub.remove();
        });
      })
      .catch(() => {});

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (removeAppState) removeAppState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return null;
};

const App = () => {
  // Initialize theme from localStorage
  // Theme is controlled from pages (Profile switch) and persists via localStorage.
  // We don't auto-apply saved theme on app mount to avoid unexpected route-based changes.
  useReminderNotifications();

  return (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00A99D",
          colorSuccess: "#00A99D",
          colorWarning: "#F7941D",
          colorError: "#f5222d",
          borderRadius: 16,
          fontSize: 16,
        },
        components: {
          Button: {
            primaryShadow: "0 4px 15px rgba(0, 169, 157, 0.3)",
          },
        },
      }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OnboardingProvider>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/character-select" element={<CharacterSelect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/lesson/:date" element={<Lesson />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/quiz/:month" element={<Quiz />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
  );
};

export default App;

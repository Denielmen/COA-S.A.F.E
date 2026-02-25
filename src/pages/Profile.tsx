import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Bell, Save, Edit2 } from "lucide-react";
import { Card, Tabs, Button, Input, Switch, Select, Slider } from "antd";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getCurrentLanguage, translate } from "@/lib/utils";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const Profile = () => {
  const navigate = useNavigate();
  const { getStats, resetProgress } = useUserProgress();
  const stats = getStats();
  const language = getCurrentLanguage();
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">(() => {
    return (localStorage.getItem("selectedCharacter") as "boy" | "girl") || "girl";
  });
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: (localStorage.getItem("username") as string) || "User",
    email: (localStorage.getItem("email") as string) || "user@example.com",
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('settings');
      return saved ? JSON.parse(saved) : { notifications: true, soundEffects: true, darkMode: false, language: 'en' };
    } catch {
      return { notifications: true, soundEffects: true, darkMode: false, language: 'en' };
    }
    const saved = localStorage.getItem("settings");
    return saved
      ? JSON.parse(saved)
      : {
          notifications: true,
          soundEffects: true,
          soundVolume: 80,
          vibrate: true,
          darkMode: false,
          language: "en",
        };
  });
  const [dirty, setDirty] = useState(false);

  // Dark mode will only change when the user toggles the switch.
  const handleDarkModeToggle = (checked: boolean) => {
    const newSettings = { ...settings, darkMode: checked };
    setSettings(newSettings);
    document.documentElement.classList.toggle("theme-dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  useEffect(() => {
    // Apply dark mode class to document when toggled
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleCharacterChange = (character: "boy" | "girl") => {
    setSelectedCharacter(character);
    localStorage.setItem("selectedCharacter", character);
  };

  const handleSaveProfile = () => {
    // Save profile data
    localStorage.setItem("username", profileData.name);
    localStorage.setItem("email", profileData.email);
    // notify other components (Dashboard) about update
    try {
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { name: profileData.name } }));
    } catch {
      // ignore
    }
    console.log("Saving profile:", profileData);
  };

  const handleSaveSettings = async () => {
    // Persist settings and trigger side effects
    localStorage.setItem("settings", JSON.stringify(settings));
    // apply immediately as well
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try {
      window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
    } catch {}
    console.log("Saving settings:", settings);
    setDirty(false);
    try {
      // Notify other pages to react (e.g., adjust music volume)
      window.dispatchEvent(new CustomEvent("settings-saved", { detail: settings }));
    } catch {}
    try {
      const { Capacitor } = await import("@capacitor/core");
      if (Capacitor.getPlatform() !== "web") {
        const scheduler = await import("@/notifications/mobileScheduler");
        if (settings.notifications) {
          await scheduler.ensureDailyUnlockRepeating();
          await scheduler.scheduleForTodayIfNeeded();
        } else {
          await scheduler.cancelTodayReminders();
          await scheduler.cancelDailyUnlockRepeating();
        }
      }
    } catch {}
    await Swal.fire({
      title: translate(language, {
        en: "Settings saved",
        tl: "Na-save ang settings",
        bis: "Nasave na ang settings",
      }),
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleResetProgress = async () => {
    const result = await Swal.fire({
      title: translate(language, {
        en: "Reset all progress?",
        tl: "I-reset ang lahat ng progreso?",
        bis: "I-reset ang tanang progreso?",
      }),
      text: translate(language, {
        en: "This will clear completed lessons, rewards, streak, level, and quiz scores.",
        tl: "Mawawala ang mga natapos na leksyon, rewards, streak, level, at quiz scores.",
        bis: "Mawala ang nahuman nga leksiyon, rewards, streak, level, ug quiz scores.",
      }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: translate(language, {
        en: "Reset",
        tl: "I-reset",
        bis: "I-reset",
      }),
      cancelButtonText: translate(language, {
        en: "Cancel",
        tl: "Kanselahin",
        bis: "Kanselahon",
      }),
      focusCancel: true,
    });

    if (result.isConfirmed) {
      resetProgress();
      await Swal.fire({
        title: translate(language, {
          en: "Progress reset",
          tl: "Na-reset ang progreso",
          bis: "Na-reset ang progreso",
        }),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <User className="w-4 h-4" />
          {translate(language, {
            en: "Profile",
            tl: "Profile",
            bis: "Profile",
          })}
        </span>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <Settings className="w-4 h-4" />
          {translate(language, {
            en: "Settings",
            tl: "Mga Setting",
            bis: "Mga Settings",
          })}
        </span>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <Bell className="w-4 h-4" />
          {translate(language, {
            en: "Notifications",
            tl: "Mga Notipikasyon",
            bis: "Mga Notipikasyon",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
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
                en: "Profile & Settings",
                tl: "Profile at Mga Setting",
                bis: "Profile ug Mga Settings",
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

      {/* Tab Content */}
      <div className="px-4 py-4">
        {activeTab === "profile" && (
          <div className="space-y-4">
            {/* Character Selection */}
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">
                {translate(language, {
                  en: "Character Selection",
                  tl: "Pagpili ng Character",
                  bis: "Pagpili sa Character",
                })}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleCharacterChange("boy")}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    selectedCharacter === "boy"
                      ? "border-primary shadow-md scale-105"
                      : "border-border hover:border-muted"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-card mx-auto flex items-center justify-center overflow-hidden border-2 border-border">
                      <img 
                        src={boyCharacterImg}
                        alt="Boy character"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {translate(language, {
                        en: "Boy",
                        tl: "Lalaki",
                        bis: "Bata nga Lalaki",
                      })}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleCharacterChange("girl")}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    selectedCharacter === "girl"
                      ? "border-primary shadow-md scale-105"
                      : "border-border hover:border-muted"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-card mx-auto flex items-center justify-center overflow-hidden border-2 border-border">
                      <img 
                        src={girlCharacterImg}
                        alt="Girl character"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {translate(language, {
                        en: "Girl",
                        tl: "Babae",
                        bis: "Bata nga Babaye",
                      })}
                    </p>
                  </div>
                </button>
              </div>
            </Card>

            {/* User Profile Info */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">
                {translate(language, {
                  en: "User Information",
                  tl: "Impormasyon ng User",
                  bis: "Impormasyon sa User",
                })}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translate(language, {
                      en: "Name",
                      tl: "Pangalan",
                      bis: "Ngalan",
                    })}
                  </label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder={translate(language, {
                      en: "Enter your name",
                      tl: "Ilagay ang iyong pangalan",
                      bis: "Ibutang ang imong ngalan",
                    })}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {translate(language, {
                      en: "Email",
                      tl: "Email",
                      bis: "Email",
                    })}
                  </label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder={translate(language, {
                      en: "Enter your email",
                      tl: "Ilagay ang iyong email",
                      bis: "Ibutang ang imong email",
                    })}
                    className="rounded-lg"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSaveProfile}
                  className="w-full h-12 rounded-xl font-medium shadow-sm"
                >
                  {translate(language, {
                    en: "Save Changes",
                    tl: "I-save ang mga Pagbabago",
                    bis: "I-save ang mga Ka-usaban",
                  })}
                </Button>
              </div>
            </Card>

            {/* Stats Summary */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">
                {translate(language, {
                  en: "Your Progress",
                  tl: "Iyong Progreso",
                  bis: "Imong Progreso",
                })}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                  <div className="text-xs text-gray-600">
                    {translate(language, {
                      en: "Completed",
                      tl: "Tapos",
                      bis: "Humana",
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
                  <div className="text-xs text-gray-600">
                    {translate(language, {
                      en: "Streak",
                      tl: "Sunod-sunod na Araw",
                      bis: "Sunod-sunod nga Adlaw",
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.level}</div>
                  <div className="text-xs text-gray-600">
                    {translate(language, {
                      en: "Level",
                      tl: "Antas",
                      bis: "Lebel",
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">
                {translate(language, {
                  en: "General Settings",
                  tl: "Pangunahing Settings",
                  bis: "General nga Settings",
                })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Sound Effects Volume",
                        tl: "Lakas ng Sound Effects",
                        bis: "Kusog sa Sound Effects",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Adjust all sound effects volume (0–100)",
                        tl: "Ayusin ang lakas ng lahat ng sound effects (0–100)",
                        bis: "Usba ang kusog sa tanang sound effects (0–100)",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground" aria-label="current volume">{settings.soundVolume ?? 80}%</div>
                    <Slider
                      min={0}
                      max={100}
                      value={settings.soundVolume ?? 80}
                      onChange={(value) => {
                        const vol = Array.isArray(value) ? value[0] : value;
                        const newSettings = { ...settings, soundVolume: vol, soundEffects: vol > 0 };
                        setSettings(newSettings);
                        setDirty(true);
                      }}
                      style={{ width: 160 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Dark Mode",
                        tl: "Dark Mode",
                        bis: "Dark Mode",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Switch to dark theme",
                        tl: "Lumipat sa dark na tema",
                        bis: "Ibalhin sa dark nga tema",
                      })}
                    </p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleDarkModeToggle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {translate(language, {
                      en: "Language",
                      tl: "Wika",
                      bis: "Pinulongan",
                    })}
                  </label>
                  <Select
                    value={settings.language}
                    onChange={(value) => {
                      setSettings({ ...settings, language: value });
                      setDirty(true);
                    }}
                    className="w-full"
                    options={[
                      { value: "en", label: "English" },
                      { value: "tl", label: "Tagalog" },
                      { value: "bis", label: "Bisaya" },
                    ]}
                  />
                </div>

                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSaveSettings}
                  className="w-full h-12 rounded-xl font-medium shadow-sm"
                  disabled={!dirty}
                >
                  {translate(language, {
                    en: "Save Settings",
                    tl: "I-save ang Settings",
                    bis: "I-save ang Settings",
                  })}
                </Button>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">
                {translate(language, {
                  en: "About",
                  tl: "Tungkol sa App",
                  bis: "Mahitungod sa App",
                })}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>COA-S.A.F.E App</p>
                <p>Version 1.0.0</p>
                <p>
                  {translate(language, {
                    en: "Learn Philippine Children's Law",
                    tl: "Alamin ang Batas para sa mga Bata sa Pilipinas",
                    bis: "Pagtuon sa Balaod sa mga Bata sa Pilipinas",
                  })}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center text-xs text-primary underline"
                  onClick={() => {
                    try {
                      localStorage.removeItem("safe-onboarding-tour");
                      window.dispatchEvent(new Event("restart-onboarding-tour"));
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                >
                  {translate(language, {
                    en: "Restart walkthrough",
                    tl: "I-restart ang walkthrough",
                    bis: "I-restart ang walkthrough",
                  })}
                </button>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">
                {translate(language, {
                  en: "Reset Progress",
                  tl: "I-reset ang Progreso",
                  bis: "I-reset ang Progreso",
                })}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {translate(language, {
                  en: "Clear all completed lessons, rewards, streaks, levels, and quiz scores.",
                  tl: "Burahin ang lahat ng natapos na leksyon, rewards, streaks, levels, at quiz scores.",
                  bis: "Papas-a ang tanang nahuman nga leksiyon, rewards, streaks, levels, ug quiz scores.",
                })}
              </p>
              <Button
                danger
                type="primary"
                onClick={handleResetProgress}
                className="w-full h-12 rounded-xl font-medium"
              >
                {translate(language, {
                  en: "Reset All Progress",
                  tl: "I-reset ang Lahat ng Progreso",
                  bis: "I-reset ang Tanan nga Progreso",
                })}
              </Button>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">
                {translate(language, {
                  en: "Notification Preferences",
                  tl: "Mga Setting ng Notipikasyon",
                  bis: "Mga Setting sa Notipikasyon",
                })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Push Notifications",
                        tl: "Push Notifications",
                        bis: "Push Notifications",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Receive push notifications",
                        tl: "Tumanggap ng push notifications",
                        bis: "Dawat og push notifications",
                      })}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onChange={async (checked) => {
                      const newSettings = { ...settings, notifications: checked };
                      setSettings(newSettings);
                      setDirty(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Daily Reminders",
                        tl: "Araw-araw na Paalala",
                        bis: "Adlaw-adlaw nga Pahinumdom",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Get reminded to complete daily lessons",
                        tl: "Paalala para tapusin ang araw-araw na lessons",
                        bis: "Pahinumdom nga tapuson ang adlaw-adlaw nga leksiyon",
                      })}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Vibrate",
                        tl: "Vibrate",
                        bis: "Vibrate",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Vibrate when notifications arrive",
                        tl: "Mag-vibrate kapag may notification",
                        bis: "Mag-vibrate kung naay notification",
                      })}
                    </p>
                  </div>
                  <Switch
                    checked={settings.vibrate !== false}
                    onChange={(checked) => {
                      const newSettings = { ...settings, vibrate: checked };
                      setSettings(newSettings);
                      setDirty(true);
                    }}
                  />
                </div>


                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Quiz Notifications",
                        tl: "Mga Notipikasyon sa Quiz",
                        bis: "Mga Notipikasyon sa Quiz",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Notify when quizzes are available",
                        tl: "Ipaalam kapag may quizzes na puwede na",
                        bis: "Sultihi kung pwede na ang quizzes",
                      })}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {translate(language, {
                        en: "Achievement Alerts",
                        tl: "Mga Alert sa Achievement",
                        bis: "Mga Alert sa Achievement",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {translate(language, {
                        en: "Get notified about achievements",
                        tl: "Makatanggap ng alert kapag may naabot na achievement",
                        bis: "Makadawat og alert kung naay achievement",
                      })}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSaveSettings}
                  className="w-full h-12 rounded-xl font-medium shadow-sm"
                  disabled={!dirty}
                >
                  {translate(language, {
                    en: "Save Notification Settings",
                    tl: "I-save ang Notification Settings",
                    bis: "I-save ang Notification Settings",
                  })}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;


import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Bell, Save, Edit2 } from "lucide-react";
import { Card, Tabs, Button, Input, Switch, Select, Slider } from "antd";
import { useUserProgress } from "@/hooks/useUserProgress";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const Profile = () => {
  const navigate = useNavigate();
  const { getStats } = useUserProgress();
  const stats = getStats();
  const [selectedCharacter, setSelectedCharacter] = useState<"boy" | "girl">(() => {
    return (localStorage.getItem("selectedCharacter") as "boy" | "girl") || "girl";
  });
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: "User",
    email: "user@example.com",
  });

  const [settings, setSettings] = useState(() => {
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

  const handleCharacterChange = (character: "boy" | "girl") => {
    setSelectedCharacter(character);
    localStorage.setItem("selectedCharacter", character);
  };

  const handleSaveProfile = () => {
    // Save profile data
    console.log("Saving profile:", profileData);
  };

  const handleSaveSettings = async () => {
    // Persist settings and trigger side effects
    localStorage.setItem("settings", JSON.stringify(settings));
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
      title: "Settings saved",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <User className="w-4 h-4" />
          Profile
        </span>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <Settings className="w-4 h-4" />
          Settings
        </span>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-2 text-foreground">
          <Bell className="w-4 h-4" />
          Notifications
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
            <h1 className="text-lg font-semibold text-primary">Profile & Settings</h1>
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
              <h3 className="font-semibold text-foreground mb-4">Character Selection</h3>
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
                    <p className="text-sm font-medium text-muted-foreground">Boy</p>
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
                    <p className="text-sm font-medium text-muted-foreground">Girl</p>
                  </div>
                </button>
              </div>
            </Card>

            {/* User Profile Info */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="rounded-lg"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSaveProfile}
                  className="w-full h-12 rounded-xl font-medium shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </Card>

            {/* Stats Summary */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.completed}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
                  <div className="text-xs text-gray-600">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{stats.level}</div>
                  <div className="text-xs text-gray-600">Level</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Sound Effects Volume</p>
                    <p className="text-sm text-muted-foreground">Adjust all sound effects volume (0–100)</p>
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
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleDarkModeToggle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language
                  </label>
                  <Select
                    value={settings.language}
                    onChange={(value) => setSettings({ ...settings, language: value })}
                    className="w-full"
                    options={[
                      { value: "en", label: "English" },
                      { value: "tl", label: "Tagalog" },
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
                  Save Settings
                </Button>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>COA-S.A.F.E App</p>
                <p>Version 1.0.0</p>
                <p>Learn Philippine Children's Law</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
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
                    <p className="font-medium text-foreground">Daily Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded to complete daily lessons</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Vibrate</p>
                    <p className="text-sm text-muted-foreground">Vibrate when notifications arrive</p>
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
                    <p className="font-medium text-foreground">Quiz Notifications</p>
                    <p className="text-sm text-muted-foreground">Notify when quizzes are available</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Achievement Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about achievements</p>
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
                  Save Notification Settings
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


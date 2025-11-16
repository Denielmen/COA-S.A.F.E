import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Bell, Save, Edit2 } from "lucide-react";
import { Card, Tabs, Button, Input, Switch, Select } from "antd";
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

  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    language: "en",
  });

  const handleCharacterChange = (character: "boy" | "girl") => {
    setSelectedCharacter(character);
    localStorage.setItem("selectedCharacter", character);
  };

  const handleSaveProfile = () => {
    // Save profile data
    console.log("Saving profile:", profileData);
  };

  const handleSaveSettings = () => {
    // Save settings
    localStorage.setItem("settings", JSON.stringify(settings));
    console.log("Saving settings:", settings);
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Profile
        </span>
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </span>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Notifications
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">Character Selection</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleCharacterChange("boy")}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    selectedCharacter === "boy"
                      ? "border-primary shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      <img 
                        src={boyCharacterImg}
                        alt="Boy character"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Boy</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCharacterChange("girl")}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    selectedCharacter === "girl"
                      ? "border-primary shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      <img 
                        src={girlCharacterImg}
                        alt="Girl character"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Girl</p>
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
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Sound Effects</p>
                    <p className="text-sm text-gray-600">Enable sound effects in the app</p>
                  </div>
                  <Switch
                    checked={settings.soundEffects}
                    onChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                >
                  Save Settings
                </Button>
              </div>
            </Card>

            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">About</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>COA-S.A.F.E App</p>
                <p>Version 1.0.0</p>
                <p>Learn Philippine Children's Law</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Daily Reminders</p>
                    <p className="text-sm text-gray-600">Get reminded to complete daily lessons</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Quiz Notifications</p>
                    <p className="text-sm text-gray-600">Notify when quizzes are available</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Achievement Alerts</p>
                    <p className="text-sm text-gray-600">Get notified about achievements</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSaveSettings}
                  className="w-full h-12 rounded-xl font-medium shadow-sm"
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


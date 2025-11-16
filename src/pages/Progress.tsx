import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Flame, Target, TrendingUp } from "lucide-react";
import { Card, Progress as AntProgress, Tabs } from "antd";
import { useUserProgress } from "@/hooks/useUserProgress";
import { dailyArticles } from "@/data/dailyArticles";
import BottomNavigation from "@/components/BottomNavigation";

const boyCharacterImg = "/images/boy.png";
const girlCharacterImg = "/images/girl.png";

const Progress = () => {
  const navigate = useNavigate();
  const [selectedCharacter] = useState<"boy" | "girl">(() => {
    return (localStorage.getItem("selectedCharacter") as "boy" | "girl") || "girl";
  });
  const { getStats } = useUserProgress();
  const stats = getStats();

  const totalLessons = dailyArticles.length;
  const completionPercentage = Math.round((stats.completed / totalLessons) * 100);
  const passScore = 85.5; // Example pass score

  const [activeTab, setActiveTab] = useState("overview");

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
    },
    {
      key: "statistics",
      label: "Statistics",
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
            <h1 className="text-lg font-semibold text-primary">Progress Tracker</h1>
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

      {activeTab === "overview" && (
        <div className="px-4 py-4">
          {/* Character and Level Card */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Character Card */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center border-4 border-primary">
                  <img 
                    src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
                    alt={`${selectedCharacter} character`}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="bg-primary text-white px-3 py-1 rounded-full inline-block">
                  <span className="text-sm font-semibold">Level {stats.level}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">Experience</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="text-secondary text-lg">70%</span>
                  <Trophy className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </Card>

            {/* Statistics Card */}
            <Card className="rounded-2xl shadow-sm border-2 border-primary/20">
              <div className="text-center h-full flex flex-col justify-center">
                <div className="w-24 h-24 mx-auto mb-2">
                  <img 
                    src={selectedCharacter === "boy" ? boyCharacterImg : girlCharacterImg}
                    alt="character"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Progress Overview Section */}
          <h2 className="text-lg font-bold text-gray-900 mb-4">Progress Overview</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Lessons Completed */}
            <Card className="rounded-2xl shadow-sm border-2 border-primary/20">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Lessons</p>
                <p className="text-2xl font-bold text-primary">{stats.completed}/{totalLessons}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </Card>

            {/* Pass Score */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 mx-auto mb-2 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Pass Score</p>
                <p className="text-2xl font-bold text-secondary">{passScore}%</p>
                <p className="text-xs text-gray-500">Excellent!</p>
              </div>
            </Card>

            {/* Streak */}
            <Card className="rounded-2xl shadow-sm border-2 border-yellow-200">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 mx-auto mb-2 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Streak</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.streak} days</p>
                <p className="text-xs text-gray-500">Keep going!</p>
              </div>
            </Card>

            {/* Overall Progress */}
            <Card className="rounded-2xl shadow-sm border-2 border-green-200">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 mx-auto mb-2 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-xs text-gray-600 mb-1">Progress</p>
                <p className="text-2xl font-bold text-green-500">{completionPercentage}%</p>
                <p className="text-xs text-gray-500">Amazing!</p>
              </div>
            </Card>
          </div>

          {/* Overall Progress Bar */}
          <Card className="rounded-2xl shadow-sm border border-gray-200 mb-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-3">Overall Completion</h3>
            <AntProgress 
              percent={completionPercentage} 
              strokeColor={{
                '0%': '#00A99D',
                '100%': '#10b981',
              }}
              trailColor="#f0f0f0"
              strokeWidth={12}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{stats.completed} lessons completed</span>
              <span>{totalLessons - stats.completed} remaining</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "statistics" && (
        <div className="px-4 py-4">
          <Card className="rounded-2xl shadow-sm border border-gray-100 mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
            
            <div className="space-y-4">
              {/* Total Lessons */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Total Lessons</p>
                    <p className="text-sm text-gray-600">Completed lessons</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">{stats.completed}</p>
              </div>

              {/* Current Level */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Current Level</p>
                    <p className="text-sm text-gray-600">Your achievement level</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-yellow-500">{stats.level}</p>
              </div>

              {/* Streak */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Current Streak</p>
                    <p className="text-sm text-gray-600">Consecutive days</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-secondary">{stats.streak}</p>
              </div>

              {/* Completion Rate */}
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completion Rate</p>
                    <p className="text-sm text-gray-600">Overall progress</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">{completionPercentage}%</p>
              </div>
            </div>
          </Card>

          {/* Motivational Message */}
          <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Keep Up the Great Work!</h3>
              <p className="text-sm text-gray-600">
                You're doing amazing! Continue learning about children's rights and make a difference.
              </p>
            </div>
          </Card>
        </div>
      )}

      <BottomNavigation activeTab="progress" />
    </div>
  );
};

export default Progress;

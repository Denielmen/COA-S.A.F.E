import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle, Play, Trophy } from "lucide-react";
import { Button, Badge, Progress } from "antd";
import { monthlyQuizzes, hasQuizForMonth } from "@/data/quizzes";
import { useUserProgress } from "@/hooks/useUserProgress";
import BottomNavigation from "@/components/BottomNavigation";

const Quizzes = () => {
  const navigate = useNavigate();
  const { isMonthCompleted, getStats } = useUserProgress();
  const stats = getStats();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getMonthStatus = (month: number) => {
    const monthCompleted = isMonthCompleted(month);
    const hasQuiz = hasQuizForMonth(month);
    
    if (!hasQuiz) {
      return { status: 'coming-soon', canTakeQuiz: false };
    }
    
    if (monthCompleted) {
      return { status: 'available', canTakeQuiz: true };
    }
    
    return { status: 'locked', canTakeQuiz: false };
  };

  const handleQuizClick = (month: number) => {
    const { canTakeQuiz } = getMonthStatus(month);
    if (canTakeQuiz) {
      navigate(`/quiz/${month}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Play className="w-5 h-5 text-green-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-green-200 bg-green-50';
      case 'locked':
        return 'border-gray-200 bg-gray-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const availableQuizzes = monthlyQuizzes.filter(quiz => 
    isMonthCompleted(quiz.month)
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">Monthly Quizzes</h1>
          </div>
          <div className="text-sm text-gray-600">
            {availableQuizzes} / {monthlyQuizzes.length} available
          </div>
        </div>
      </div>

      {/* Stats Header */}
      <div className="px-4 py-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Activity Center</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Complete monthly challenges to unlock quizzes and test your knowledge!
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm">
              <div className="text-2xl font-bold text-primary">{availableQuizzes}</div>
              <div className="text-xs text-gray-600">Quizzes Unlocked</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="px-4 py-4">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Complete 80% of lessons in a month to unlock its quiz</li>
            <li>• Each quiz has 5 questions about that month's topics</li>
            <li>• Score 70% or higher to pass the quiz</li>
            <li>• Earn rewards and level up your knowledge!</li>
          </ul>
        </div>

        {/* Monthly Quizzes Grid */}
        <div className="grid grid-cols-1 gap-4">
          {months.map((monthName, index) => {
            const monthNumber = index + 1;
            const { status, canTakeQuiz } = getMonthStatus(monthNumber);
            const quiz = monthlyQuizzes.find(q => q.month === monthNumber);
            const hasQuiz = hasQuizForMonth(monthNumber);

            return (
              <div
                key={monthNumber}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  canTakeQuiz 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'cursor-not-allowed'
                } ${getStatusColor(status)}`}
                onClick={() => handleQuizClick(monthNumber)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      canTakeQuiz 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {monthNumber}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        canTakeQuiz ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {monthName}
                      </h3>
                      {quiz ? (
                        <p className={`text-sm ${
                          canTakeQuiz ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {quiz.title}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">Coming Soon</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'locked' && (
                      <Badge 
                        count="Locked" 
                        style={{ backgroundColor: '#6b7280' }}
                      />
                    )}
                    {status === 'available' && (
                      <Badge 
                        count="Available" 
                        style={{ backgroundColor: '#10b981' }}
                      />
                    )}
                    {!hasQuiz && (
                      <Badge 
                        count="Soon" 
                        style={{ backgroundColor: '#f59e0b' }}
                      />
                    )}
                    {getStatusIcon(status)}
                  </div>
                </div>

                {quiz && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{quiz.questions.length} questions</span>
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                  </div>
                )}

                {status === 'locked' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Complete {monthName} challenges to unlock
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNavigation activeTab="quizzes" />
    </div>
  );
};

export default Quizzes;

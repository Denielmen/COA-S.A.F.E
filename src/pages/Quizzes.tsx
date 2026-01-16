import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, CheckCircle, Play, Trophy } from "lucide-react";
import { Button, Badge, Progress } from "antd";
import { monthlyQuizzes, hasQuizForMonth } from "@/data/quizzes";
import { useUserProgress } from "@/hooks/useUserProgress";
import BottomNavigation from "@/components/BottomNavigation";
import { getCurrentLanguage, translate } from "@/lib/utils";

const Quizzes = () => {
  const navigate = useNavigate();
  const { isMonthCompleted, getStats } = useUserProgress();
  const stats = getStats();
  const language = getCurrentLanguage();

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
        return 'border-primary/20 bg-primary/10';
      case 'locked':
        return 'border-gray-200 bg-gray-50';
      case 'completed':
        return 'border-primary/20 bg-primary/10';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const availableQuizzes = monthlyQuizzes.filter(quiz => 
    isMonthCompleted(quiz.month)
  ).length;

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
            <h1 className="text-lg font-semibold text-primary">
              {translate(language, {
                en: "Monthly Quizzes",
                tl: "Mga Quiz Buwan-buwan",
                bis: "Mga Quiz Matag Bulan",
              })}
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            {availableQuizzes} / {monthlyQuizzes.length}{" "}
            {translate(language, {
              en: "available",
              tl: "na available",
              bis: "nga available",
            })}
          </div>
        </div>
      </div>

      {/* Stats Header */}
      <div className="px-4 py-6 bg-white border-b border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">
              {translate(language, {
                en: "Activity Center",
                tl: "Sentro ng Gawain",
                bis: "Sentro sa Aktibidad",
              })}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {translate(language, {
              en: "Complete monthly challenges to unlock quizzes and test your knowledge!",
              tl: "Tapusin ang mga buwanang hamon para ma-unlock ang quizzes at masubukan ang iyong kaalaman!",
              bis: "Humanon ang mga hagit matag bulan para ma-unlock ang quizzes ug matestingan ang imong kahibalo!",
            })}
          </p>
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-primary">{availableQuizzes}</div>
              <div className="text-xs text-gray-600">
                {translate(language, {
                  en: "Quizzes Unlocked",
                  tl: "Mga Quiz na Na-unlock",
                  bis: "Mga Quiz nga Na-unlock",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-6 shadow-sm">
          <h3 className="font-semibold text-primary mb-2">
            {translate(language, {
              en: "How it works:",
              tl: "Paano ito gumagana:",
              bis: "Unsaon ni siya pagtrabaho:",
            })}
          </h3>
          <ul className="text-sm text-foreground space-y-1">
            <li>
              {translate(language, {
                en: "• Complete 80% of lessons in a month to unlock its quiz",
                tl: "• Tapusin ang 80% ng mga leksyon sa isang buwan para ma-unlock ang quiz nito",
                bis: "• Humanon ang 80% sa mga leksiyon sa usa ka bulan para ma-unlock ang iyang quiz",
              })}
            </li>
            <li>
              {translate(language, {
                en: "• Each quiz has 5 questions about that month's topics",
                tl: "• Bawat quiz ay may 5 tanong tungkol sa paksa ng buwan na iyon",
                bis: "• Kada quiz adunay 5 ka pangutana bahin sa mga hilisgutan sa maong bulan",
              })}
            </li>
            <li>
              {translate(language, {
                en: "• Score 70% or higher to pass the quiz",
                tl: "• Kailangan ng 70% o mas mataas para pumasa sa quiz",
                bis: "• Kinahanglan 70% o mas taas para makapasar sa quiz",
              })}
            </li>
            <li>
              {translate(language, {
                en: "• Earn rewards and level up your knowledge!",
                tl: "• Kumita ng rewards at i-level up ang iyong kaalaman!",
                bis: "• Makakuha og rewards ug mapa-taas ang imong kahibalo!",
              })}
            </li>
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
                className={`rounded-2xl p-4 border transition-all ${
                  canTakeQuiz 
                    ? 'hover:shadow-md cursor-pointer border-gray-200 bg-white shadow-sm' 
                    : 'cursor-not-allowed'
                } ${!canTakeQuiz ? getStatusColor(status) : 'border-gray-200 bg-white shadow-sm'}`}
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
                      <span>
                        {quiz.questions.length}{" "}
                        {translate(language, {
                          en: "questions",
                          tl: "mga tanong",
                          bis: "ka pangutana",
                        })}
                      </span>
                      <span>
                        {translate(language, {
                          en: "Pass",
                          tl: "Pasa",
                          bis: "Pasa",
                        })}
                        : {quiz.passingScore}%
                      </span>
                    </div>
                  </div>
                )}

                {status === 'locked' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {translate(language, {
                          en: `Complete ${monthName} challenges to unlock`,
                          tl: `Tapusin ang mga hamon sa ${monthName} para ma-unlock`,
                          bis: `Huma ang mga hagit sa ${monthName} para ma-unlock`,
                        })}
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

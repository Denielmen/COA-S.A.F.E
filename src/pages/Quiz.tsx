import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Button, Progress, Card } from "antd";
import { getQuizForMonth, type MonthlyQuiz, type QuizQuestion } from "@/data/quizzes";
import { getCurrentLanguage, translate } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useUserProgress";
const Quiz = () => {
  const { month } = useParams<{ month: string }>();
  const navigate = useNavigate();
  const { setQuizScore } = useUserProgress();
  const [quiz, setQuiz] = useState<MonthlyQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const language = getCurrentLanguage();

  useEffect(() => {
    if (month) {
      const monthNumber = parseInt(month);
      const quizData = getQuizForMonth(monthNumber);
      setQuiz(quizData || null);
    }
  }, [month]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score and show results
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(percentage);
    
    // Save quiz score if passed
    if (month && percentage >= 70) {
      const monthNumber = parseInt(month);
      setQuizScore(monthNumber, percentage);
    }
    
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const isPassed = score >= (quiz?.passingScore || 70);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-muted-foreground">
            {translate(language, {
              en: "Quiz not found",
              tl: "Walang nahanap na quiz",
              bis: "Wala nakit-an nga quiz",
            })}
          </h2>
          <Button 
            onClick={() => navigate("/quizzes")} 
            className="mt-4"
            type="primary"
          >
            {translate(language, {
              en: "Back to Quizzes",
              tl: "Bumalik sa Quizzes",
              bis: "Balik sa Quizzes",
            })}
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/quizzes")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <h1 className="text-lg font-semibold text-primary">
              {translate(language, {
                en: "Quiz Results",
                tl: "Mga Resulta ng Quiz",
                bis: "Resulta sa Quiz",
              })}
            </h1>
          </div>
        </div>

        {/* Results */}
        <div className="px-4 py-6">
          <div className="text-center mb-6">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isPassed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${
              isPassed ? 'text-green-700' : 'text-red-700'
            }`}>
              {isPassed
                ? translate(language, {
                    en: "Congratulations!",
                    tl: "Binabati ka namin!",
                    bis: "Congratulations!",
                  })
                : translate(language, {
                    en: "Keep Learning!",
                    tl: "Magpatuloy sa pag-aaral!",
                    bis: "Padayon sa pagtuon!",
                  })}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {isPassed
                ? translate(language, {
                    en: "You passed the quiz! Great job learning about children's rights.",
                    tl: "Nakapasa ka sa quiz! Ang galing sa pag-aaral tungkol sa karapatan ng mga bata.",
                    bis: "Nakapasa ka sa quiz! Maayo kaayo sa pagkat-on sa katungod sa mga bata.",
                  })
                : translate(language, {
                    en: `You need ${quiz.passingScore}% to pass. Review the lessons and try again!`,
                    tl: `Kailangan mo ng ${quiz.passingScore}% para pumasa. Balikan ang mga lesson at subukan ulit!`,
                    bis: `Kinahanglan nimo og ${quiz.passingScore}% para makapasar. Balika ang mga leksiyon ug sulayi pag-usab!`,
                  })}
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
              <div className="text-gray-600">
                {translate(language, {
                  en: "Your Score",
                  tl: "Iyong Iskor",
                  bis: "Imong Iskor",
                })}
              </div>
              <div className="mt-4">
                <Progress 
                  percent={score} 
                  strokeColor={isPassed ? '#10b981' : '#ef4444'}
                  trailColor="#f0f0f0"
                  strokeWidth={12}
                />
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {selectedAnswers.filter(
                  (answer, index) => answer === quiz.questions[index].correctAnswer,
                ).length}{" "}
                {translate(language, {
                  en: "out of",
                  tl: "sa",
                  bis: "sa",
                })}{" "}
                {quiz.questions.length}{" "}
                {translate(language, {
                  en: "correct",
                  tl: "tamang sagot",
                  bis: "husto nga tubag",
                })}
              </div>
            </div>
          </div>

          {/* Review Answers */}
          <Card className="rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {translate(language, {
                en: "Review Your Answers",
                tl: "Suriin ang Iyong mga Sagot",
                bis: "Usba ang Imong mga Tubag",
              })}
            </h3>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1">
                          <div className={`text-sm px-2 py-1 rounded ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {translate(language, {
                              en: "Your answer:",
                              tl: "Iyong sagot:",
                              bis: "Imong tubag:",
                            })}{" "}
                            {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                              {translate(language, {
                                en: "Correct answer:",
                                tl: "Tamang sagot:",
                                bis: "Hustong tubag:",
                              })}{" "}
                              {question.options[question.correctAnswer]}
                            </div>
                          )}
                          {question.explanation && (
                            <div className="text-sm text-gray-600 mt-2 italic">
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              type="primary"
              size="large"
              block
              onClick={isPassed ? () => navigate("/lessons") : resetQuiz}
              className="h-12 rounded-xl font-medium"
              icon={isPassed ? undefined : <RotateCcw className="w-5 h-5" />}
            >
              {translate(language, {
                en: "Try Again",
                tl: "Subukan Muli",
                bis: "Sulayi Pag-usab",
              })}
            </Button>
            
            <Button
              size="large"
              block
              onClick={() => navigate("/quizzes")}
              className="h-12 rounded-xl font-medium"
            >
              {translate(language, {
                en: "Back to Quizzes",
                tl: "Bumalik sa Quizzes",
                bis: "Balik sa Quizzes",
              })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100);
  const hasSelectedAnswer = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/quizzes")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-primary">{quiz.title}</h1>
              <p className="text-sm text-gray-600">
                {translate(language, {
                  en: "Question",
                  tl: "Tanong",
                  bis: "Pangutana",
                })}{" "}
                {currentQuestionIndex + 1}{" "}
                {translate(language, {
                  en: "of",
                  tl: "ng",
                  bis: "sa",
                })}{" "}
                {quiz.questions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <Progress 
          percent={progress} 
          strokeColor="#00A99D"
          trailColor="#f0f0f0"
          strokeWidth={8}
          showInfo={false}
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>
            {translate(language, {
              en: "Progress:",
              tl: "Progreso:",
              bis: "Progreso:",
            })}{" "}
            {progress}%
          </span>
          <span>
            {translate(language, {
              en: "Pass:",
              tl: "Pasa:",
              bis: "Pasa:",
            })}{" "}
            {quiz.passingScore}%
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-6">
        <Card className="rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentQuestionIndex > 0 && (
            <Button
              size="large"
              onClick={handlePrevious}
              className="flex-1 h-12 rounded-xl font-medium"
            >
              {translate(language, {
                en: "Previous",
                tl: "Nakaraan",
                bis: "Miaging",
              })}
            </Button>
          )}
          
          <Button
            type="primary"
            size="large"
            onClick={handleNext}
            disabled={!hasSelectedAnswer}
            className="flex-1 h-12 rounded-xl font-medium"
          >
            {currentQuestionIndex === quiz.questions.length - 1
              ? translate(language, {
                  en: "Finish Quiz",
                  tl: "Tapusin ang Quiz",
                  bis: "Humanon ang Quiz",
                })
              : translate(language, {
                  en: "Next",
                  tl: "Susunod",
                  bis: "Sunod",
                })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

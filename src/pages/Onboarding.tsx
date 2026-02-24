import { useState } from "react";
import { useNavigate } from "react-router-dom";
import familyProtectionImg from "/images/image 1.jpg";
import interactiveLearningImg from "/images/image 2.jpg";
import educationalContentImg from "/images/image 3.jpg";
import { getCurrentLanguage, translate } from "@/lib/utils";

const onboardingData = [
  {
    title: "Daily Lessons for Child Protection",
    description:
      "Learn Philippine Laws for Children through bite-sized daily lessons designed for busy Filipino parents. Build legal awareness in just 5 minutes a day.",
    illustration: familyProtectionImg,
  },
  {
    title: "Interactive Quizzes and Progress Tracking",
    description:
      "Test your knowledge with engaging quizzes and watch your child character grow as you complete lessons. Make learning fun and rewarding.",
    illustration: interactiveLearningImg,
  },
  {
    title: "Free Educational Lessons and Articles",
    description:
      "Learn Philippine Laws for Children through bite-sized daily lessons designed for busy Filipino parents. Build legal awareness in just 5 minutes a day.",
    illustration: educationalContentImg,
    features: [
      { icon: "🎯", title: "Curated of fun lessons" },
      { icon: "🛡️", title: "100% Privacy Protected" },
      { icon: "👨‍👩‍👧", title: "Child-friendly learning" },
    ],
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const language = getCurrentLanguage();

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else { 
      navigate("/character-select");
    }
  };

  const handleSkip = () => {
    navigate("/character-select");
  };

  const currentData = onboardingData[currentStep];
  const isLastStep = currentStep === onboardingData.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-6 py-8">
      <div className="max-w-md w-full flex-1 flex flex-col space-y-6">
        {/* Illustration Card */}
        <div key={currentStep} className="w-full rounded-2xl bg-white shadow-lg overflow-hidden mb-6 onboarding-illustration-card">
          <div className="p-4 sm:p-6 flex justify-center">
            <img
              src={currentData.illustration}
              alt={currentData.title}
              className="w-full max-w-xs sm:max-w-sm h-auto object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center space-y-3 px-4 slide-fade-in" key={`text-${currentStep}`}>
          <h2 className="text-xl sm:text-2xl font-extrabold text-teal-700">
            {currentData.title}
          </h2>
          <p className="text-orange-500 text-sm sm:text-base leading-relaxed px-2">
            {currentData.description}
          </p>

          {currentData.features && (
            <div className="grid grid-cols-3 gap-4 pt-4">
              {currentData.features.map((feature, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <div className="text-3xl">{feature.icon}</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Indicators (pills) */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {onboardingData.map((_, idx) => (
            <div
              key={idx}
              className={
                idx === currentStep
                  ? "w-8 h-2 rounded-full bg-amber-400 transition-all"
                  : "w-2 h-2 rounded-full bg-amber-200 transition-all"
              }
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-md w-full pt-6 pb-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="text-primary font-semibold"
          >
            {translate(language, {
              en: "Skip",
              tl: "Laktawan",
              bis: "Lakta",
            })}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 bg-teal-700 hover:bg-teal-600 text-white h-12 rounded-full font-semibold shadow-md flex items-center justify-center"
            aria-label={isLastStep ? "Get Started" : "Next"}
          >
            {isLastStep
              ? translate(language, {
                  en: "Get Started",
                  tl: "Magsimula",
                  bis: "Sugdi na",
                })
              : translate(language, {
                  en: "Next",
                  tl: "Susunod",
                  bis: "Sunod",
                })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

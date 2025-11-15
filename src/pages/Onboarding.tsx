import { useState } from "react";
import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import familyProtectionImg from "/images/image 1.jpg";
import interactiveLearningImg from "/images/image 2.jpg";
import educationalContentImg from "/images/image 3.jpg";

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
        {/* Illustration Container */}
        <div className="w-full rounded-3xl bg-muted shadow-md overflow-hidden mb-4">
          <div className="flex justify-center p-6">
            <img 
              src={currentData.illustration} 
              alt={currentData.title}
              className="w-full max-w-sm h-auto object-contain"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center space-y-4 px-4">
          <h2 className="text-2xl font-bold text-primary">
            {currentData.title}
          </h2>
          <p className="text-secondary text-base leading-relaxed">
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

        {/* Navigation Indicators */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {onboardingData.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all ${
                idx === currentStep
                  ? "w-3 h-3 bg-secondary"
                  : "w-2 h-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-md w-full flex items-center justify-between pt-6 pb-4">
        <Button
          type="text"
          size="large"
          onClick={handleSkip}
          className="text-primary font-semibold hover:bg-transparent"
        >
          Skip
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleNext}
          className="h-12 px-8 text-base font-semibold rounded-full shadow-md hover:shadow-lg"
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="end"
        >
          {isLastStep ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
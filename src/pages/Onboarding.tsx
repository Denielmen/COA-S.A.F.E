import { useState } from "react";
import { Button, Card } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import familyProtectionImg from "/images/family-protection.svg";
import interactiveLearningImg from "/images/interactive-learning.svg";
import educationalContentImg from "/images/educational-content.svg";

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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-between p-6 py-12">
      <div className="max-w-md w-full flex-1 flex flex-col items-center justify-center space-y-8">
        <Card
          className="w-full rounded-3xl shadow-[var(--shadow-card)] border-2 border-primary/20 overflow-hidden"
          bodyStyle={{ padding: "3rem 2rem" }}
        >
          <div className="text-center space-y-6">
            <div className="mb-4 flex justify-center">
              <img 
                src={currentData.illustration} 
                alt={currentData.title}
                className="w-32 h-32 object-contain"
              />
            </div>
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
        </Card>

        <div className="flex gap-2">
          {onboardingData.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? "w-8 bg-secondary"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {isLastStep && (
          <p className="text-primary font-semibold text-sm">
            Trusted by Filipino Families
          </p>
        )}
      </div>

      <div className="max-w-md w-full flex items-center justify-between pt-6">
        <Button
          type="text"
          size="large"
          onClick={handleSkip}
          className="text-primary font-semibold"
        >
          Skip
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleNext}
          className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl"
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
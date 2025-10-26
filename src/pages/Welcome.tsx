import { Button } from "antd";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl text-muted-foreground font-medium">
            Welcome to
          </h2>
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="text-[hsl(187,100%,42%)]">S</span>
            <span className="text-[hsl(33,100%,50%)]">A</span>
            <span className="text-[hsl(187,100%,42%)]">F</span>
            <span className="text-[hsl(45,100%,51%)]">E</span>
            <span className="text-[hsl(187,100%,42%)]"> !</span>
          </h1>
        </div>

        <div className="pt-20 space-y-4">
          <p className="text-secondary text-sm font-medium">
            Learn Philippine Children's Law
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/onboarding")}
            className="h-12 px-8 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="end"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

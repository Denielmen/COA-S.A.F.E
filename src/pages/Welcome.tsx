import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const handleProceed = () => navigate("/onboarding");

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col items-center justify-center p-6 cursor-pointer"
      onClick={handleProceed}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleProceed();
      }}
      aria-label="Proceed to onboarding"
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm sm:text-base text-muted-foreground font-medium">Welcome to</h2>
          <h1 className="text-6xl sm:text-7xl md:text-8xl leading-none font-extrabold tracking-tight flex justify-center items-end space-x-3 select-none">
            <span className="bounce-letter" style={{ color: "#2F92F3", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '0ms' } as React.CSSProperties}>S</span>
            <span className="bounce-letter" style={{ color: "#FF6A00", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '120ms' } as React.CSSProperties}>A</span>
            <span className="bounce-letter" style={{ color: "#00A695", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '240ms' } as React.CSSProperties}>F</span>
            <span className="bounce-letter" style={{ color: "#FFC048", textShadow: "0 6px 10px rgba(0,0,0,0.12)", ['--delay' as any]: '360ms' } as React.CSSProperties}>E</span>
          </h1>
        </div>

        <div className="pt-6">
          <p className="text-black text-sm font-medium tagline" style={{ ['--delay' as any]: '880ms' } as React.CSSProperties}>Learn Philippine Laws for Children</p>
          <p className="mt-2 text-xs text-muted-foreground">Tap anywhere to continue</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

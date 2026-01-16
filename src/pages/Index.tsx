import { getCurrentLanguage, translate } from "@/lib/utils";

const Index = () => {
  const language = getCurrentLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">
          {translate(language, {
            en: "Welcome to S.A.F.E App",
            tl: "Maligayang pagdating sa S.A.F.E App",
            bis: "Maayong pag-abot sa S.A.F.E App",
          })}
        </h1>
        <p className="text-xl text-muted-foreground">
          {translate(language, {
            en: "Start building your amazing project here!",
            tl: "Simulan ang paggawa ng iyong napakahusay na proyekto dito!",
            bis: "Sugdi ang pagtukod sa imong nindot nga proyekto dinhi!",
          })}
        </p>
      </div>
    </div>
  );
};

export default Index;

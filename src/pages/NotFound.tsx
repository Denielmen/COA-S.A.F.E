import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentLanguage, translate } from "@/lib/utils";

const NotFound = () => {
  const location = useLocation();
  const language = getCurrentLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">
          {translate(language, {
            en: "Oops! Page not found",
            tl: "Oops! Hindi nahanap ang page",
            bis: "Oops! Wala nakit-an ang panid",
          })}
        </p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          {translate(language, {
            en: "Return to Home",
            tl: "Bumalik sa Home",
            bis: "Balik sa Home",
          })}
        </a>
      </div>
    </div>
  );
};

export default NotFound;

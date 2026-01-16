import { Calendar as CalendarIcon, Book, FileQuestion, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentLanguage, translate } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: "calendar" | "lessons" | "quizzes" | "progress";
}

const BottomNavigation = ({ activeTab = "calendar" }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const language = getCurrentLanguage();

  const navItems = [
    {
      id: "calendar",
      icon: CalendarIcon,
      label: translate(language, {
        en: "Calendar",
        tl: "Kalendaryo",
        bis: "Kalendaryo",
      }),
      path: "/dashboard",
    },
    {
      id: "lessons",
      icon: Book,
      label: translate(language, {
        en: "Lessons",
        tl: "Mga Aralin",
        bis: "Mga Leksyon",
      }),
      path: "/lessons",
    },
    {
      id: "quizzes",
      icon: FileQuestion,
      label: translate(language, {
        en: "Activity",
        tl: "Gawain",
        bis: "Aktibidad",
      }),
      path: "/quizzes",
    },
    {
      id: "progress",
      icon: BarChart3,
      label: translate(language, {
        en: "Progress",
        tl: "Progreso",
        bis: "Progreso",
      }),
      path: "/progress",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 ${
                isActive 
                  ? 'text-white bg-primary rounded-lg px-4 py-2' 
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

import { Calendar as CalendarIcon, Book, FileQuestion, BarChart3 } from "lucide-react";

interface BottomNavigationProps {
  activeTab?: 'calendar' | 'lessons' | 'quizzes' | 'progress';
}

const BottomNavigation = ({ activeTab = 'calendar' }: BottomNavigationProps) => {
  const navItems = [
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'lessons', icon: Book, label: 'Lessons' },
    { id: 'quizzes', icon: FileQuestion, label: 'Quizzes' },
    { id: 'progress', icon: BarChart3, label: 'Progress' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id}
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

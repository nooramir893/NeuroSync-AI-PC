import { motion } from 'motion/react';
import { Home, History, Settings } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'history' | 'settings') => void;
  darkMode: boolean;
}

export function BottomNav({ currentScreen, onNavigate, darkMode }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className={`${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-lg border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="flex flex-col items-center gap-1 relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
                    />
                  )}
                  <div className={`p-3 rounded-2xl transition-colors ${
                    isActive
                      ? 'bg-gradient-to-br from-teal-500 to-blue-500 border-b-4 border-teal-300'
                      : darkMode
                      ? 'text-slate-400 hover:bg-slate-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                    <Icon className={`size-5 ${isActive ? 'text-white' : ''}`} />
                  </div>
                  <span
                    className={`text-xs ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent'
                        : darkMode
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
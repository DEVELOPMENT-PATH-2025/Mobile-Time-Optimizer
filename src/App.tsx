import { useState, useEffect } from "react";
import { Home, MessageSquare, Settings as SettingsIcon, BarChart2, Cpu } from "lucide-react";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import Setup from "./components/Setup";
import LockScreen from "./components/LockScreen";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import AgentReport from "./components/AgentReport";

export type AppUsage = {
  app: string;
  timeInMinutes: number;
  targetInMinutes: number;
  iconName: string;
  isStudyApp?: boolean;
};

const DEFAULT_USAGE: AppUsage[] = [
  { app: "Instagram", timeInMinutes: 150, targetInMinutes: 60, iconName: "Instagram" },
  { app: "YouTube", timeInMinutes: 90, targetInMinutes: 60, iconName: "Youtube" },
  { app: "WhatsApp", timeInMinutes: 60, targetInMinutes: 30, iconName: "MessageCircle" },
];

export default function App() {
  const [domain, setDomain] = useState<string | null>(localStorage.getItem("student_domain"));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("student_name"));
  const [activeTab, setActiveTab] = useState<"home" | "agent" | "analytics" | "focus" | "settings">("home");
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme_mode");
    return saved ? saved === "dark" : true; // Default to dark mode
  });

  const [usageData, setUsageData] = useState<AppUsage[]>(() => {
    const saved = localStorage.getItem("screen_time_usage");
    if (saved) return JSON.parse(saved);
    return DEFAULT_USAGE;
  });

  const [isMidnightLockEnabled, setIsMidnightLockEnabled] = useState(() => {
    return localStorage.getItem("midnight_lock_enabled") !== "false";
  });

  const [isMidnightLocked, setIsMidnightLocked] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme_mode", isDarkMode ? "dark" : "light");
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("screen_time_usage", JSON.stringify(usageData));
  }, [usageData]);

  useEffect(() => {
    // Check if it's between 11 PM and 3 AM
    const checkTime = () => {
      if (!isMidnightLockEnabled) {
        setIsMidnightLocked(false);
        return;
      }
      const currentHour = new Date().getHours();
      // 23, 0, 1, 2 (11 PM to 3 AM)
      if (currentHour >= 23 || currentHour < 3) {
        setIsMidnightLocked(true);
      } else {
        setIsMidnightLocked(false);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isMidnightLockEnabled]);

  const updateTarget = (appName: string, deltaMinutes: number) => {
    setUsageData(prev => prev.map(u => 
      u.app === appName 
        ? { ...u, targetInMinutes: Math.max(0, u.targetInMinutes + deltaMinutes) } 
        : u
    ));
  };

  if (isMidnightLocked) {
    return <LockScreen />;
  }

  if (!domain || !userName) {
    return <Setup onComplete={(n, d) => {
      setUserName(n);
      setDomain(d);
      localStorage.setItem("student_name", n);
      localStorage.setItem("student_domain", d);
    }} />;
  }

  const handleReset = () => {
    localStorage.removeItem("student_domain");
    localStorage.removeItem("student_name");
    setDomain(null);
    setUserName(null);
  };

  return (
    <div className={`flex justify-center bg-bg-app min-h-screen text-text-primary font-sans selection:bg-blue-500/30 ${isDarkMode ? 'dark' : ''}`}>
      {/* Mobile Form Factor Wrapper */}
      <div className="w-full max-w-md h-[100dvh] relative flex flex-col shadow-2xl overflow-hidden bg-bg-mobile border-x border-bg-border">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-5 pt-8 pb-24 hide-scrollbar">
          {activeTab === "home" && <Dashboard domain={domain} userName={userName} usage={usageData} onSwitchToAgent={() => setActiveTab("agent")} onSwitchToAnalytics={() => setActiveTab("analytics")} onUpdateTarget={updateTarget} isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />}
          {activeTab === "agent" && <AgentReport domain={domain} usage={usageData} />}
          {activeTab === "analytics" && <Analytics usage={usageData} />}
          {activeTab === "focus" && <Chatbot domain={domain} userName={userName} />}
          {activeTab === "settings" && <Settings 
            userName={userName} 
            domain={domain} 
            onReset={handleReset} 
            midnightLockEnabled={isMidnightLockEnabled} 
            onToggleMidnightLock={(enabled) => {
              setIsMidnightLockEnabled(enabled);
              localStorage.setItem("midnight_lock_enabled", String(enabled));
            }} 
            onUpdateProfile={(name, newDomain) => {
              setUserName(name);
              setDomain(newDomain);
              localStorage.setItem("student_name", name);
              localStorage.setItem("student_domain", newDomain);
            }} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute shadow-[0_-10px_40px_rgba(0,0,0,0.8)] bottom-0 w-full h-[88px] bg-bg-mobile/95 backdrop-blur-2xl border-t border-bg-border flex items-center justify-between px-3 pb-4 pt-2 z-20">
          <button onClick={() => setActiveTab("home")} className={`flex flex-col flex-1 items-center justify-center gap-1.5 transition-colors ${activeTab === 'home' ? 'text-blue-500' : 'text-text-muted'}`}>
            <Home className="w-[22px] h-[22px]" />
            <span className="text-[10px] tracking-wide font-medium">Dashboard</span>
          </button>
          
          <button onClick={() => setActiveTab("agent")} className={`flex flex-col flex-1 items-center justify-center gap-1.5 transition-colors ${activeTab === 'agent' ? 'text-blue-500' : 'text-text-muted'}`}>
            <Cpu className="w-[22px] h-[22px]" />
            <span className="text-[10px] tracking-wide font-medium">Agent</span>
          </button>

          <button onClick={() => setActiveTab("analytics")} className={`flex flex-col flex-1 items-center justify-center gap-1.5 transition-colors ${activeTab === 'analytics' ? 'text-blue-500' : 'text-text-muted'}`}>
            <BarChart2 className="w-[22px] h-[22px]" />
            <span className="text-[10px] tracking-wide font-medium">Analytics</span>
          </button>

          <button onClick={() => setActiveTab("focus")} className={`flex flex-col flex-1 items-center justify-center gap-1.5 transition-colors ${activeTab === 'focus' ? 'text-blue-500' : 'text-text-muted'}`}>
            <MessageSquare className="w-[22px] h-[22px]" />
            <span className="text-[10px] tracking-wide font-medium">FocusAI</span>
          </button>

          <button onClick={() => setActiveTab("settings")} className={`flex flex-col flex-1 items-center justify-center gap-1.5 transition-colors ${activeTab === 'settings' ? 'text-blue-500' : 'text-text-muted'}`}>
            <SettingsIcon className="w-[22px] h-[22px]" />
            <span className="text-[10px] tracking-wide font-medium">Settings</span>
          </button>
        </nav>
      </div>
    </div>
  );
}


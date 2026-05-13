import { User, Bell, Lock, Shield, LogOut, ChevronRight, Moon, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function Settings({ 
  userName, 
  domain, 
  onReset,
  midnightLockEnabled,
  onToggleMidnightLock,
  onUpdateProfile
}: { 
  userName: string, 
  domain: string,
  onReset: () => void,
  midnightLockEnabled: boolean,
  onToggleMidnightLock: (enabled: boolean) => void,
  onUpdateProfile: (name: string, domain: string) => void
}) {
  const [view, setView] = useState<"main" | "edit_profile" | "notifications" | "privacy">("main");

  const [editName, setEditName] = useState(userName);
  const [editDomain, setEditDomain] = useState(domain);

  const [limitAlerts, setLimitAlerts] = useState(() => localStorage.getItem("notify_limits") !== "false");
  const [weeklyReports, setWeeklyReports] = useState(() => localStorage.getItem("notify_weekly") !== "false");

  const handleSaveProfile = () => {
    onUpdateProfile(editName, editDomain);
    setView("main");
  };

  if (view === "edit_profile") {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-6 text-left">
        <div className="flex items-center gap-4 pt-2 pb-2">
          <button onClick={() => setView("main")} className="p-2 -ml-2 rounded-full hover:bg-[#1a2130] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[24px] font-semibold text-white">Edit Profile</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[13px] font-bold text-[#5e7194] uppercase tracking-wider mb-2 block">Name</label>
            <input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[#131823] border border-[#1e2433] text-white p-4 rounded-xl focus:outline-none focus:border-[#3c78d8] transition-colors"
            />
          </div>
          <div>
            <label className="text-[13px] font-bold text-[#5e7194] uppercase tracking-wider mb-2 block">Domain of Study</label>
            <input 
              value={editDomain}
              onChange={(e) => setEditDomain(e.target.value)}
              className="w-full bg-[#131823] border border-[#1e2433] text-white p-4 rounded-xl focus:outline-none focus:border-[#3c78d8] transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveProfile}
          className="w-full py-4 mt-8 rounded-xl bg-[#3c78d8] text-white font-semibold flex items-center justify-center hover:bg-[#2a5bb0] transition-colors shadow-lg"
        >
          Save Changes
        </button>
      </div>
    );
  }

  if (view === "notifications") {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-6 text-left">
        <div className="flex items-center gap-4 pt-2 pb-2">
          <button onClick={() => setView("main")} className="p-2 -ml-2 rounded-full hover:bg-[#1a2130] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[24px] font-semibold text-white">Notifications</h1>
        </div>

        <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] overflow-hidden shadow-sm">
          <button 
            onClick={() => {
              setLimitAlerts(!limitAlerts);
              localStorage.setItem("notify_limits", String(!limitAlerts));
            }} 
            className="w-full flex items-center justify-between p-4 border-b border-[#1e2433] hover:bg-[#1a2130] transition-colors"
          >
             <span className="text-[15px] font-medium text-white">App Limit Alerts</span>
             <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${limitAlerts ? 'bg-[#3c78d8]' : 'bg-[#1e2433]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${limitAlerts ? 'left-5' : 'left-1'}`}/>
             </div>
          </button>
          
          <button 
            onClick={() => {
              setWeeklyReports(!weeklyReports);
              localStorage.setItem("notify_weekly", String(!weeklyReports));
            }} 
            className="w-full flex items-center justify-between p-4 hover:bg-[#1a2130] transition-colors"
          >
             <span className="text-[15px] font-medium text-white">Weekly AI Reports</span>
             <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${weeklyReports ? 'bg-[#3c78d8]' : 'bg-[#1e2433]'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${weeklyReports ? 'left-5' : 'left-1'}`}/>
             </div>
          </button>
        </div>
        <p className="text-[#5e7194] text-[13px] px-2 leading-relaxed">
          These settings control whether FocusAI agent alerts you when usage goes over limits and whether it prepares an end-of-week analysis report.
        </p>
      </div>
    );
  }

  if (view === "privacy") {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-6 text-left">
        <div className="flex items-center gap-4 pt-2 pb-2">
          <button onClick={() => setView("main")} className="p-2 -ml-2 rounded-full hover:bg-[#1a2130] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[24px] font-semibold text-white">Privacy Details</h1>
        </div>

        <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-[#10b981] mb-2">
            <Shield className="w-6 h-6" />
            <h3 className="font-bold text-[18px]">Your Data is Local</h3>
          </div>
          <p className="text-[14px] leading-relaxed text-[#8ca0c9]">
            We care deeply about your privacy. All your screen time data and application statistics are stored strictly on your local device.
          </p>
          <p className="text-[14px] leading-relaxed text-[#8ca0c9]">
            The only data transmitted to the cloud is what you actively type to the <b>FocusAI Agent</b> and aggregated usage data strictly when you manually request an optimization report. We do not sell or track your background activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6 text-left">
      <div className="pt-2 pb-2">
         <h1 className="text-[28px] leading-tight font-semibold text-white">
           App <span className="text-[#3c78d8]">Settings</span>
         </h1>
      </div>

      <div className="bg-[#131823] border border-[#1e2433] rounded-[24px] p-5 flex items-center gap-4 shadow-sm">
        <div className="w-14 h-14 bg-gradient-to-br from-[#3c78d8] to-[#254f94] rounded-full flex items-center justify-center text-xl font-bold text-white">
          {userName.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-[17px]">{userName}</h3>
          <p className="text-[#5e7194] text-[14px]">{domain}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[13px] font-bold text-[#5e7194] uppercase tracking-wider px-2">Preferences</h3>
        
        <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] overflow-hidden shadow-sm">
          <button onClick={() => setView("edit_profile")} className="w-full flex items-center justify-between p-4 border-b border-[#1e2433] hover:bg-[#1a2130] transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1e2433] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#8ca0c9]" />
                </div>
                <span className="text-[15px] font-medium text-white">Edit Profile</span>
             </div>
             <ChevronRight className="w-5 h-5 text-[#5e7194]" />
          </button>
          
          <button onClick={() => setView("notifications")} className="w-full flex items-center justify-between p-4 border-b border-[#1e2433] hover:bg-[#1a2130] transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1e2433] flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#8ca0c9]" />
                </div>
                <span className="text-[15px] font-medium text-white">Notifications</span>
             </div>
             <ChevronRight className="w-5 h-5 text-[#5e7194]" />
          </button>

          <button 
             onClick={() => onToggleMidnightLock(!midnightLockEnabled)}
             className="w-full flex items-center justify-between p-4 hover:bg-[#1a2130] transition-colors"
          >
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1e2433] flex items-center justify-center">
                  <Moon className="w-4 h-4 text-[#8ca0c9]" />
                </div>
                <span className="text-[15px] font-medium text-white">Midnight Lock Settings</span>
             </div>
             <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${midnightLockEnabled ? 'bg-[#3c78d8]' : 'bg-[#1e2433]'}`}>
                <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 ${midnightLockEnabled ? 'left-5' : 'left-1'}`}/>
             </div>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[13px] font-bold text-[#5e7194] uppercase tracking-wider px-2">Account</h3>
        
        <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] overflow-hidden shadow-sm">
          <button onClick={() => setView("privacy")} className="w-full flex items-center justify-between p-4 border-b border-[#1e2433] hover:bg-[#1a2130] transition-colors">
             <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1e2433] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#8ca0c9]" />
                </div>
                <span className="text-[15px] font-medium text-white">Privacy Details</span>
             </div>
             <ChevronRight className="w-5 h-5 text-[#5e7194]" />
          </button>
          
          <button onClick={onReset} className="w-full flex items-center justify-between p-4 hover:bg-[#f75b6e]/10 transition-colors">
             <div className="flex items-center gap-4 text-[#f75b6e]">
                <div className="w-9 h-9 rounded-full bg-[#f75b6e]/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-medium">Reset Profile & App Data</span>
             </div>
          </button>
        </div>
      </div>
    </div>
  );
}

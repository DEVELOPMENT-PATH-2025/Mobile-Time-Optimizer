import { useState } from "react";
import { Cpu, ArrowRight, AlertCircle, Zap, Instagram, Youtube, MessageCircle, TrendingUp, Plus, Minus, Moon, Sun } from "lucide-react";
import { AppUsage } from "../App";

export default function Dashboard({ domain, userName, usage, onSwitchToAgent, onSwitchToAnalytics, onUpdateTarget, isDarkMode, onToggleDarkMode }: { domain: string, userName: string, usage: AppUsage[], onSwitchToAgent: () => void, onSwitchToAnalytics: () => void, onUpdateTarget: (app: string, delta: number) => void, isDarkMode: boolean, onToggleDarkMode: () => void }) {
  
  // Format Date (e.g. Wednesday, May 13)
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Calculate totals
  const totalMinutes = usage.reduce((acc, curr) => acc + curr.timeInMinutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // 4h daily goal
  const dailyGoalMinutes = 4 * 60;
  const isOverGoal = totalMinutes > dailyGoalMinutes;
  
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Instagram': return <Instagram className="w-6 h-6 text-[#bb4a77]" />;
      case 'Youtube': return <Youtube className="w-6 h-6 text-[#ff0000]" />;
      case 'MessageCircle': return <MessageCircle className="w-6 h-6 text-[#25D366]" />;
      default: return <Cpu className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-6">
      
      {/* Header section */}
      <div className="pt-2 pb-2 flex justify-between items-start">
         <div>
           <h1 className="text-[28px] leading-tight font-semibold text-text-primary">
             Good morning, <span className="text-[#3c78d8]">{userName}</span>
           </h1>
           <p className="text-[15px] font-medium text-text-muted mt-1">{dateStr}</p>
         </div>
         <button 
           onClick={onToggleDarkMode} 
           className="p-2.5 bg-bg-card border border-bg-border rounded-[18px] text-text-secondary hover:text-text-primary transition-colors shadow-sm"
         >
            {isDarkMode ? <Sun className="w-5 h-5 cursor-pointer" /> : <Moon className="w-5 h-5 cursor-pointer" />}
         </button>
      </div>

      {/* Overview Card */}
      <div className="bg-bg-card border border-bg-border rounded-[24px] p-6 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-baseline">
            <span className="text-[48px] font-bold tracking-tight">{hours}.{(minutes/60*10).toFixed(0)}h</span>
          </div>
          
          {isOverGoal && (
            <div className="bg-[#f75b6e]/10 text-[#f75b6e] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[13px] font-medium mt-2">
              <TrendingUp className="w-[14px] h-[14px]" />
              Over limit
            </div>
          )}
        </div>
        
        <p className="text-[#8c9bab] text-[15px] font-medium mb-6">Total screen time today</p>
        
        <div className="flex justify-between text-[13px] text-text-muted font-medium mb-2.5">
          <span>Daily goal: {dailyGoalMinutes/60}h</span>
          <span>{isOverGoal ? "0.0h" : ((dailyGoalMinutes - totalMinutes)/60).toFixed(1) + "h"} remaining</span>
        </div>
        
        <div className="h-2.5 w-full bg-bg-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#fbbc04] rounded-full" 
            style={{ width: `${Math.min((totalMinutes / dailyGoalMinutes) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Alert Banners */}
      <div className="space-y-3">
        <button onClick={onSwitchToAgent} className="w-full bg-[#f75b6e]/5 border border-[#f75b6e]/20 rounded-2xl p-4 flex items-center gap-4 text-left hover:bg-[#f75b6e]/10 transition-colors">
          <AlertCircle className="w-5 h-5 text-[#f75b6e] shrink-0" />
          <span className="text-[#f75b6e] text-[15px] font-medium leading-snug">
            3 apps over daily limit — tap AI Agent for suggestions
          </span>
        </button>

        <div className="w-full bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl p-4 flex items-center gap-4 text-left">
          <Zap className="w-5 h-5 text-[#10b981] shrink-0" />
          <span className="text-[#10b981] text-[15px] font-medium leading-snug">
            Spend more time on study apps for B.Tech success
          </span>
        </div>
      </div>

      {/* App List */}
      <div className="space-y-4 pt-2">
        <h2 className="text-[20px] font-bold text-text-primary tracking-wide">Top Apps Today</h2>
        
        <div className="space-y-3">
          {usage.map((item) => {
            const isAppOver = item.timeInMinutes > item.targetInMinutes;
            return (
              <div key={item.app} className="bg-bg-card border border-bg-border rounded-[20px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1c2230] rounded-2xl flex items-center justify-center shrink-0">
                      {getIcon(item.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[17px] text-text-primary">{item.app}</h3>
                      <p className="text-[#8c9bab] text-[14px]">
                        {(item.timeInMinutes/60).toFixed(1)}h / {(item.targetInMinutes/60).toFixed(1)}h target
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => onUpdateTarget(item.app, -15)} className="w-9 h-9 rounded-full bg-[#1c2230] flex items-center justify-center text-[#8c9bab] hover:text-text-primary transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <button onClick={() => onUpdateTarget(item.app, 15)} className="w-9 h-9 rounded-full bg-[#1c2230] flex items-center justify-center text-[#8c9bab] hover:text-text-primary transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={onSwitchToAgent} className="w-9 h-9 rounded-[12px] bg-[#3c78d8]/20 flex items-center justify-center text-[#3c78d8] ml-1">
                      <Zap className="w-[18px] h-[18px] fill-[#3c78d8]" />
                    </button>
                  </div>
                </div>

                <div className="h-[6px] w-full bg-bg-border rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full ${isAppOver ? 'bg-[#f75b6e]' : 'bg-[#3c78d8]'}`} 
                    style={{ width: `${Math.min((item.timeInMinutes / item.targetInMinutes) * 100, 100)}%` }}
                  />
                  {/* Excess line overlay if over target */}
                  {isAppOver && (
                     <div 
                      className="absolute top-0 left-0 h-full bg-[#f75b6e] rounded-full z-10 opacity-60" 
                      style={{ width: '100%' }}
                    />
                  )}
                </div>
                {isAppOver && (
                  <p className="text-[#f75b6e] text-[13px] font-medium mt-2">
                    {((item.timeInMinutes - item.targetInMinutes)/60).toFixed(1)}h over limit
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onSwitchToAnalytics} className="w-full flex items-center justify-center gap-2 py-4 bg-bg-card border border-bg-border rounded-[20px] text-text-secondary font-medium hover:bg-bg-hover transition-colors mt-2 text-[15px]">
          View All Apps & Analytics
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* AI Agent CTA Block */}
        <button 
          onClick={onSwitchToAgent}
          className="w-full mt-4 bg-gradient-to-r from-[#4d88ff] to-[#3a6be8] p-5 rounded-[24px] flex items-center justify-between shadow-[0_10px_30px_rgba(58,107,232,0.3)] group transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-4 text-left">
            <Cpu className="w-8 h-8 text-text-primary shrink-0" />
            <div>
              <h3 className="text-text-primary font-bold text-[18px] mb-0.5">Personal AI Agent</h3>
              <p className="text-blue-100 text-[14px] leading-snug">
                Get recommendations for {domain}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-text-primary shrink-0 opacity-80 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

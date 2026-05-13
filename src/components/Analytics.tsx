import { BarChart, ChevronDown, Activity, Clock, Smartphone } from "lucide-react";
import { AppUsage } from "../App";

export default function Analytics({ usage }: { usage: AppUsage[] }) {
  const totalMinutes = usage.reduce((acc, curr) => acc + curr.timeInMinutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Mock weekly data
  const weekData = [
    { day: "Mon", val: 65 },
    { day: "Tue", val: 80 },
    { day: "Wed", val: 50 },
    { day: "Thu", val: 90 },
    { day: "Fri", val: 70 },
    { day: "Sat", val: 120 },
    { day: "Sun", val: 100 },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-6">
      <div className="pt-2 pb-2">
         <h1 className="text-[28px] leading-tight font-semibold text-white">
           Your <span className="text-[#3c78d8]">Analytics</span>
         </h1>
      </div>

      <div className="bg-[#131823] border border-[#1e2433] rounded-[24px] p-6 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#8ca0c9] font-medium">Weekly Overview</h3>
          <button className="flex items-center gap-1 text-[13px] font-medium text-[#5e7194] bg-[#1a2130] px-3 py-1.5 rounded-full">
            This Week <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="h-40 flex items-end justify-between gap-2 mt-4 px-1">
           {weekData.map((d, i) => {
             const isToday = d.day === "Wed";
             return (
               <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                 <div className="w-full relative flex justify-center h-full items-end">
                    <div 
                      className={`w-full max-w-[24px] rounded-t-md transition-colors ${isToday ? 'bg-[#3c78d8]' : 'bg-[#1e2433] group-hover:bg-[#2a344a]'}`} 
                      style={{ height: `${d.val}%` }}
                    />
                 </div>
                 <span className={`text-[11px] uppercase tracking-wider font-bold ${isToday ? 'text-white' : 'text-[#5e7194]'}`}>
                   {d.day}
                 </span>
               </div>
             )
           })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1e2433] flex items-center justify-center">
                 <Clock className="w-5 h-5 text-[#8ca0c9]" />
              </div>
              <span className="text-[12px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded w-fit">
                -12%
              </span>
            </div>
            <p className="text-[#5e7194] text-[13px] font-medium mb-1">Daily Average</p>
            <h4 className="text-[20px] font-bold text-white tracking-wide">3h 45m</h4>
         </div>

         <div className="bg-[#131823] border border-[#1e2433] rounded-[20px] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1e2433] flex items-center justify-center">
                 <Smartphone className="w-5 h-5 text-[#8ca0c9]" />
              </div>
              <span className="text-[12px] font-bold text-[#f75b6e] bg-[#f75b6e]/10 px-2 py-1 rounded w-fit">
                +4%
              </span>
            </div>
            <p className="text-[#5e7194] text-[13px] font-medium mb-1">Pickups</p>
            <h4 className="text-[20px] font-bold text-white tracking-wide">64</h4>
         </div>
      </div>

      {/* Categories */}
      <div className="bg-[#131823] border border-[#1e2433] rounded-[24px] p-6 shadow-sm mt-4">
         <h3 className="text-[#8ca0c9] font-medium mb-5">By Category</h3>
         
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#3c78d8]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-white font-medium">Social & Entertainment</span>
                   <span className="text-[#8ca0c9]">65%</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#1e2433] rounded-full">
                   <div className="h-full bg-[#3c78d8] rounded-full" style={{ width: '65%' }} />
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-white font-medium">Productivity & Study</span>
                   <span className="text-[#8ca0c9]">25%</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#1e2433] rounded-full">
                   <div className="h-full bg-[#10b981] rounded-full" style={{ width: '25%' }} />
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-white font-medium">Other</span>
                   <span className="text-[#8ca0c9]">10%</span>
                 </div>
                 <div className="h-1.5 w-full bg-[#1e2433] rounded-full">
                   <div className="h-full bg-[#fbbc04] rounded-full" style={{ width: '10%' }} />
                 </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

import { BarChart as BarIcon, ChevronDown, Activity, Clock, Smartphone } from "lucide-react";
import { AppUsage } from "../App";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis } from "recharts";

const COLORS = ['#3c78d8', '#10b981', '#fbbc04', '#f75b6e', '#8ca0c9', '#a259ff'];

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

  const pieData = usage.map(u => ({
    name: u.app,
    value: u.timeInMinutes
  }));

  const maxWeeklyValue = Math.max(...weekData.map(d => d.val));

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-6">
      <div className="pt-2 pb-2">
         <h1 className="text-[28px] leading-tight font-semibold text-text-primary">
           Your <span className="text-[#3c78d8]">Analytics</span>
         </h1>
      </div>

      <div className="bg-bg-card border border-bg-border rounded-[24px] p-6 relative overflow-hidden shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-text-secondary font-medium">Weekly Overview</h3>
          <button className="flex items-center gap-1 text-[13px] font-medium text-text-muted bg-bg-hover px-3 py-1.5 rounded-full">
            This Week <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="h-40 mt-4 px-1 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#5e7194', fontSize: 11, fontWeight: 'bold' }} 
                dy={10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                itemStyle={{ color: '#3c78d8', fontSize: '14px', fontWeight: 'bold' }}
                labelStyle={{ color: 'var(--color-text-secondary)', marginBottom: '4px' }}
                formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, 'Time']}
              />
              <Line 
                type="monotone" 
                dataKey="val" 
                stroke="#3c78d8" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-bg-card)', stroke: '#3c78d8', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#3c78d8', stroke: 'var(--color-bg-mobile)', strokeWidth: 2, r: 6 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
         <div className="bg-bg-card border border-bg-border rounded-[20px] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-bg-border flex items-center justify-center">
                 <Clock className="w-5 h-5 text-text-secondary" />
              </div>
              <span className="text-[12px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded w-fit">
                -12%
              </span>
            </div>
            <p className="text-text-muted text-[13px] font-medium mb-1">Daily Average</p>
            <h4 className="text-[20px] font-bold text-text-primary tracking-wide">3h 45m</h4>
         </div>

         <div className="bg-bg-card border border-bg-border rounded-[20px] p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-bg-border flex items-center justify-center">
                 <Smartphone className="w-5 h-5 text-text-secondary" />
              </div>
              <span className="text-[12px] font-bold text-[#f75b6e] bg-[#f75b6e]/10 px-2 py-1 rounded w-fit">
                +4%
              </span>
            </div>
            <p className="text-text-muted text-[13px] font-medium mb-1">Pickups</p>
            <h4 className="text-[20px] font-bold text-text-primary tracking-wide">64</h4>
         </div>
      </div>

      {/* Categories */}
      <div className="bg-bg-card border border-bg-border rounded-[24px] p-6 shadow-sm mt-4">
         <h3 className="text-text-secondary font-medium mb-5">By Category</h3>
         
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#3c78d8]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-text-primary font-medium">Social & Entertainment</span>
                   <span className="text-text-secondary">65%</span>
                 </div>
                 <div className="h-1.5 w-full bg-bg-border rounded-full">
                   <div className="h-full bg-[#3c78d8] rounded-full" style={{ width: '65%' }} />
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-text-primary font-medium">Productivity & Study</span>
                   <span className="text-text-secondary">25%</span>
                 </div>
                 <div className="h-1.5 w-full bg-bg-border rounded-full">
                   <div className="h-full bg-[#10b981] rounded-full" style={{ width: '25%' }} />
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" />
               <div className="flex-1">
                 <div className="flex justify-between text-[14px] mb-1.5">
                   <span className="text-text-primary font-medium">Other</span>
                   <span className="text-text-secondary">10%</span>
                 </div>
                 <div className="h-1.5 w-full bg-bg-border rounded-full">
                   <div className="h-full bg-[#fbbc04] rounded-full" style={{ width: '10%' }} />
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* App Distribution */}
      <div className="bg-bg-card border border-bg-border rounded-[24px] p-6 shadow-sm mt-4">
         <h3 className="text-text-secondary font-medium mb-5">App Distribution</h3>
         <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-bg-border)', borderRadius: '12px', color: 'var(--color-text-primary)' }}
                  itemStyle={{ color: 'var(--color-text-high)', fontSize: '14px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, 'Time Spent']}
                  labelStyle={{ display: 'none' }}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
         </div>
         <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-[13px] font-medium text-text-high">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {entry.name}
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}

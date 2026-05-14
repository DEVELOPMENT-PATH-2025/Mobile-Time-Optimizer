import { useState, useEffect } from "react";
import { Cpu, ArrowUpRight, ArrowDownRight, Lightbulb, Loader2, RefreshCw } from "lucide-react";
import { AppUsage } from "../App";
import { analyzeUsage } from "../services/gemini";

type AnalysisResult = {
  summary: string;
  constructiveSuggestion: string;
  idealHighUsage: string[];
  idealLowUsage: string[];
};

export default function AgentReport({ domain, usage }: { domain: string, usage: AppUsage[] }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeUsage(
        domain, 
        usage.map(u => ({ app: u.app, time: `${Math.floor(u.timeInMinutes / 60)}h ${u.timeInMinutes % 60}m` }))
      );
      if (result && result.error) {
         setError(result.error);
      } else if (result) {
        setAnalysis(result);
      } else {
         setError("Failed to fetch analysis.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [domain]);

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-6">
      <div className="pt-2 pb-2">
         <h1 className="text-[28px] leading-tight font-semibold text-text-primary">
           AI <span className="text-[#3c78d8]">Agent</span>
         </h1>
         <p className="text-[15px] font-medium text-text-muted mt-1">Domain optimization for {domain}</p>
      </div>

      {loading && (
        <div className="w-full bg-bg-card border border-bg-border rounded-[24px] p-10 flex flex-col items-center justify-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-bg-hover rounded-full flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-[#3c78d8] animate-spin" />
          </div>
          <p className="text-text-secondary text-[15px] font-medium animate-pulse">Running domain algorithms...</p>
        </div>
      )}

      {error && !loading && (
        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-[24px] p-6 flex flex-col items-center justify-center space-y-4 shadow-sm text-center">
          <p className="text-red-400 text-[15px] font-medium">{error}</p>
          <button onClick={fetchAnalysis} className="mt-2 text-[#3c78d8] text-sm hover:underline">Try Again</button>
        </div>
      )}

      {analysis && !loading && !error && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-gradient-to-br from-[#1c2233] to-[#131823] border border-bg-border rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3c78d8]/20 flex items-center justify-center">
                 <Cpu className="w-5 h-5 text-[#3c78d8]" />
              </div>
              <h3 className="font-bold text-[18px] text-text-primary">Assessment</h3>
            </div>
            <p className="text-[15px] leading-relaxed text-text-high">{analysis.summary}</p>
          </div>

          <div className="bg-bg-card rounded-[24px] p-6 border border-bg-border shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-[#fbbc04]">
              <div className="w-10 h-10 rounded-full bg-[#fbbc04]/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[18px]">Constructive Shift</h3>
            </div>
            <p className="text-[15px] text-text-secondary leading-relaxed">{analysis.constructiveSuggestion}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f75b6e]/5 border border-[#f75b6e]/20 rounded-[20px] p-5">
              <div className="flex items-center gap-2 text-[#f75b6e] mb-3 text-[12px] uppercase tracking-wider font-bold">
                <ArrowDownRight className="w-4 h-4" />
                Reduce
              </div>
              <ul className="space-y-2">
                {analysis.idealLowUsage.map(app => (
                  <li key={app} className="text-[15px] font-medium text-[#ff9bab]">• {app}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#10b981]/5 border border-[#10b981]/20 rounded-[20px] p-5">
              <div className="flex items-center gap-2 text-[#10b981] mb-3 text-[12px] uppercase tracking-wider font-bold">
                <ArrowUpRight className="w-4 h-4" />
                Focus On
              </div>
              <ul className="space-y-2">
                {analysis.idealHighUsage.map(app => (
                  <li key={app} className="text-[15px] font-medium text-[#79dfb9]">• {app}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button 
            onClick={fetchAnalysis} 
            className="mt-6 flex items-center justify-center gap-2 text-[14px] text-text-muted font-medium w-full py-4 uppercase tracking-widest hover:text-text-secondary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Recalculate Analysis
          </button>
        </div>
      )}
    </div>
  );
}

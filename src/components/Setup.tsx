import { useState } from "react";
import { Brain, ArrowRight } from "lucide-react";

export default function Setup({ onComplete }: { onComplete: (name: string, domain: string) => void }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim() || !name.trim()) {
      setError(true);
      return;
    }
    onComplete(name.trim(), domain.trim());
  };

  const suggestions = [
    "B.Tech Computer Science",
    "Medical Studies",
    "Graphic Design",
    "Business Administration"
  ];

  return (
    <div className="flex justify-center bg-[#0b0e14] min-h-screen text-white font-sans">
      <div className="w-full max-w-md h-[100dvh] relative flex flex-col justify-center px-8 overflow-hidden bg-[#0b0e14] border-x border-zinc-900">
        
        <div className="mb-12 space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="font-medium text-3xl tracking-tight mb-2">Optimize your<br />screen time.</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              To provide personalized recommendations, tell us your name and your field of study.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2 block">
              Your Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Amritanshu Tiwari"
              className="w-full bg-[#121620] border-b-2 border-[#1e2433] text-white p-4 rounded-t-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(false);
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2 block">
              Your Domain
            </label>
            <input 
              type="text" 
              placeholder="e.g. Computer Science"
              className="w-full bg-[#121620] border-b-2 border-[#1e2433] text-white p-4 rounded-t-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-[#f75b6e] text-xs mt-2">Please enter your name and domain.</p>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map(s => (
              <button 
                key={s}
                type="button"
                onClick={() => setDomain(s)}
                className="px-3 py-1.5 rounded-full border border-[#1e2433] text-xs font-medium text-zinc-400 hover:bg-[#1e2433] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 mt-4"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

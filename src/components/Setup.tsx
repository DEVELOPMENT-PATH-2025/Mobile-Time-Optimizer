import { useState } from "react";
import { Brain, ArrowRight } from "lucide-react";
import { signInWithGoogle } from "../services/firebase";

export default function Setup({ onComplete, onGoogleLogin }: { onComplete: (name: string, domain: string) => void, onGoogleLogin: (user: any) => void }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim() || (!name.trim() && !googleUser?.displayName)) {
      setError(true);
      return;
    }
    onComplete(googleUser?.displayName || name.trim(), domain.trim());
  };

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      const user = await signInWithGoogle();
      setGoogleUser(user);
      onGoogleLogin(user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const suggestions = [
    "B.Tech Computer Science",
    "Medical Studies",
    "Graphic Design",
    "Business Administration"
  ];

  return (
    <div className="flex justify-center bg-bg-mobile min-h-screen text-text-primary font-sans">
      <div className="w-full max-w-md h-[100dvh] relative flex flex-col justify-center px-8 overflow-hidden bg-bg-mobile border-x border-zinc-900">
        
        <div className="mb-12 space-y-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Brain className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="font-medium text-[32px] tracking-tight mb-2 text-text-primary">Optimize your<br />screen time.</h1>
            <p className="text-text-muted text-[15px] leading-relaxed">
              {googleUser ? `Hi ${googleUser.displayName}! Please tell us your field of study.` : "To provide personalized recommendations, tell us your name and your field of study."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {!googleUser && (
            <>
              <button 
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="w-full py-4 rounded-xl bg-bg-card border border-bg-border text-text-primary font-semibold flex items-center justify-center gap-3 hover:bg-bg-hover transition-colors shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                {loadingGoogle ? "Signing in..." : "Continue with Google"}
              </button>
              
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-bg-border"></div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-600">Or continue manually</p>
                <div className="flex-1 h-px bg-bg-border"></div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {(!googleUser || !googleUser.displayName) && (
               <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2 block">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Amritanshu Tiwari"
                    className="w-full bg-bg-card border-b-2 border-bg-border text-text-primary p-4 rounded-t-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError(false);
                    }}
                  />
                </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2 block">
                Your Domain
              </label>
              <input 
                type="text" 
                placeholder="e.g. Computer Science"
                className="w-full bg-bg-card border-b-2 border-bg-border text-text-primary p-4 rounded-t-lg focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
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
                  className="px-3 py-1.5 rounded-full border border-bg-border text-xs font-medium text-zinc-400 hover:bg-bg-border transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-[#3c78d8] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#2a5bb0] transition-colors shadow-lg mt-4"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

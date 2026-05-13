import { MoonStar, Lock } from "lucide-react";

export default function LockScreen() {
  const currentHour = new Date().getHours();
  // Display AM/PM beautifully
  const displayTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="flex justify-center bg-black min-h-screen text-white font-sans">
      <div className="w-full max-w-md h-[100dvh] relative flex flex-col items-center justify-center overflow-hidden bg-black border-x border-zinc-900">
        
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.15)_0%,_transparent_60%)] filter blur-3xl opacity-60 pointer-events-none" />

        <div className="z-10 flex flex-col items-center text-center px-8 space-y-8">
          <div className="w-24 h-24 rounded-full bg-red-950/50 flex items-center justify-center relative">
             <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-20" />
             <Lock className="w-10 h-10 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-6xl font-light tracking-tighter text-white">
              {displayTime}
            </h1>
            <h2 className="text-xl font-medium tracking-wide text-red-400 uppercase">
              Midnight Lock Active
            </h2>
          </div>

          <div className="space-y-4 max-w-xs text-zinc-400">
            <p className="text-sm leading-relaxed">
              You are using your phone late at night. Late night screen time disrupts your circadian rhythm and reduces cognitive focus for your studies tomorrow.
            </p>
            <p className="text-sm font-medium text-zinc-300">
              The phone is locked until 3:00 AM.
            </p>
          </div>

          <div className="pt-8">
             <div className="flex items-center justify-center gap-2 text-zinc-600">
               <MoonStar className="w-4 h-4" />
               <span className="text-xs uppercase tracking-widest">Rest to optimize</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

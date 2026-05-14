import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { sendChatMessage } from "../services/gemini";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

export default function Chatbot({ domain, userName }: { domain: string, userName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "model", text: `Hi ${userName}! I'm your Digital Screen Time Optimizer. Since you are studying ${domain}, I can give you advice on exactly which apps you should focus on and which to avoid.` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    
    // Create history for API request (excluding the current msg we are about to add)
    const history = [...messages];
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: userMsg }]);
    setIsTyping(true);

    try {
      const responseText = await sendChatMessage(domain, userName, history, userMsg);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "model", 
        text: responseText || "I couldn't process that properly." 
      }]);
    } catch(err) {
       console.error(err);
       setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "model", 
        text: "I'm having trouble connecting right now. Please ensure your GEMINI_API_KEY is configured in the Secrets tab and associated with a project." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="pt-2 pb-4 px-2">
         <h1 className="text-[28px] leading-tight font-semibold text-text-primary">
           Focus<span className="text-[#3c78d8]">AI</span> Chat
         </h1>
      </div>
      <div className="flex-1 overflow-y-auto space-y-6 pt-2 pb-4 hide-scrollbar px-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-blue-600" : "bg-blue-500/20 border border-blue-500/30"
            }`}>
              {msg.role === "user" ? <User className="w-5 h-5 text-text-primary" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>
            <div className={`max-w-[80%] rounded-3xl px-5 py-4 ${
              msg.role === "user" 
                ? "bg-blue-600 text-text-primary rounded-tr-md" 
                : "bg-gradient-to-br from-[#1c2233] to-[#121620] border border-bg-border text-blue-50/90 rounded-tl-md shadow-lg"
            }`}>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-blue-400" />
             </div>
             <div className="bg-gradient-to-br from-[#1c2233] to-[#121620] border border-bg-border rounded-3xl rounded-tl-md px-5 py-4 flex items-center gap-1.5 shadow-lg">
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
               <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
        <div ref={endRef} className="h-4" />
      </div>

      <div className="pt-2 pb-6 px-1">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for custom app limits & advice..."
            className="w-full bg-bg-card border border-bg-border rounded-full pl-6 pr-14 py-4 text-[15px] text-text-primary focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-500 shadow-lg"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2.5 bg-blue-600 text-text-primary rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}

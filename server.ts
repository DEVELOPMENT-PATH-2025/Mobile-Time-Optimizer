import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
      
      const { domain, usageData } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are an AI Screen Time Optimizer. The user is a student pursuing: ${domain}.
Their current daily app usage is:
${usageData.map((u: any) => `- ${u.app}: ${u.time}`).join("\n")}

1. Analyze if this usage is aligned with their domain.
2. Provide a constructive suggestion for their highest usage app. If it's a social media or entertainment app (like Instagram), suggest a productive way to use it relevant to their domain (e.g., for a CS student using Instagram for 4 hours, suggest using it for software marketing or following tech channels).
3. Briefly tell them which apps should have high screen time and which should have low screen time for a student in their specific domain.

Format the response in JSON with this structure:
{
  "summary": "overall assessment",
  "constructiveSuggestion": "productive use of high-time app",
  "idealHighUsage": ["app1", "app2"],
  "idealLowUsage": ["app3", "app4"]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch(err: any) {
      console.error("Gemini API Error:", err);
      const errorStr = (err instanceof Error ? err.message : JSON.stringify(err)) || "";
      if (errorStr.includes("API key not valid") || errorStr.includes("API_KEY_INVALID")) {
        return res.status(400).json({ error: "Invalid API Key. Please update your GEMINI_API_KEY in the Secrets tab." });
      }
      res.status(500).json({ error: errorStr });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "Missing GEMINI_API_KEY in server secrets." });
      
      const { domain, userName, history, message } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = "You are a strict but helpful digital & minimalistic screen time optimizer AI agent. You help students manage their app usage intelligently. Encourage them to align their screen time with their field of study. Give concise, direct, and actionable advice.";
      
      const contents = history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: "user", parts: [{ text: `[Context: I am studying ${domain}. My name is ${userName}.] ${message}` }] });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: { systemInstruction }
      });
      res.json({ text: response.text });
    } catch(err: any) {
      console.error("Gemini API Error:", err);
      const errorStr = (err instanceof Error ? err.message : JSON.stringify(err)) || "";
      if (errorStr.includes("API key not valid") || errorStr.includes("API_KEY_INVALID")) {
        return res.status(400).json({ error: "Invalid API Key. Please update your GEMINI_API_KEY in the Secrets tab." });
      }
      res.status(500).json({ error: errorStr });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

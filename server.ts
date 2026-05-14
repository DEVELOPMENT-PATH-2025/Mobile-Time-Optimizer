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
      const apiKey = "AIzaSyCv2FXtpa0Kp9CWfkEfQcYJgBuWTfEFEB8";
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch(err: any) {
      console.error(err);
      if (err.message && err.message.includes("API key not valid")) {
         return res.status(400).json({ error: "The provided API Key (ending in FEB8) is invalid according to Google. Please check your key or generate a new one." });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const apiKey = "AIzaSyCv2FXtpa0Kp9CWfkEfQcYJgBuWTfEFEB8";
      if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
      
      const { domain, userName, history, message } = req.body;
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = "You are a strict but helpful digital & minimalistic screen time optimizer AI agent. You help students manage their app usage intelligently. Encourage them to align their screen time with their field of study. Give concise, direct, and actionable advice.";
      
      const contents = history.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: "user", parts: [{ text: `[Context: I am studying ${domain}. My name is ${userName}.] ${message}` }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: { systemInstruction }
      });
      res.json({ text: response.text });
    } catch(err: any) {
      console.error(err);
      if (err.message && err.message.includes("API key not valid")) {
         return res.status(400).json({ error: "The provided API Key (ending in FEB8) is invalid according to Google. Please check your key or generate a new one." });
      }
      res.status(500).json({ error: err.message });
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
